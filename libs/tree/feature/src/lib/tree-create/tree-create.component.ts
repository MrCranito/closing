import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TreeNode,
  User,
  Tree,
  TreePermissionLevel,
  TreeStatus,
  TreeRootNode,
} from '@closing/shared/interfaces';
import { SidebarModule } from 'primeng/sidebar';
import * as d3 from 'd3';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import * as _ from 'lodash';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TreeStore } from '@closing/tree/data-access';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
type LinkData = {
  source: d3.HierarchyPointNode<TreeNode>;
  target: d3.HierarchyPointNode<TreeNode>;
};

@Component({
  selector: 'lib-tree-create-feature',
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    AvatarModule,
    InputTextModule,
    Textarea,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  standalone: true,
  templateUrl: './tree-create.component.html',
  host: {
    class: 'h-full w-full',
  },
})
export class TreeCreateComponent implements OnInit, AfterViewInit {
  private store = inject(TreeStore);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;

  private treeData: Partial<Tree> = {
    name: 'Tree Node Default',
    description: 'A default tree node structure',
    icon: 'fa-project-diagram',
    status: TreeStatus.ACTIVE,
    rootNode: {
      id: uuidv4(),
      name: 'Root Node',
      description: 'A default root node structure',
      children: [],
    },
  };

  protected tree: Partial<Tree> = this.treeData;
  protected editedTree: Partial<Tree> = _.cloneDeep(this.tree);
  protected editMode: boolean = false;

  protected get isEqual(): boolean {
    return _.isEqual(this.editedTree, this.tree);
  }

  protected sidebarVisible: boolean = false;
  protected selectedNode: TreeNode | null = null;
  protected nodeForm: FormGroup = this.formBuilder.group({
    name: [
      this.editedTree.name,
      [Validators.required, Validators.minLength(3)],
    ],
    description: [''],
  });

  private svg: any;
  private container: any;
  private width = 0;
  private height = 0;
  private nodeIdCounter = 1;
  private zoom: any;
  private highlightedNode: TreeNode | null = null;
  private button: any;
  private deleteButton: any;

  protected form: FormGroup = this.formBuilder.group({
    name: [
      this.editedTree.name,
      [Validators.required, Validators.minLength(3)],
    ],
  });

  ngOnInit(): void {
    this.form.get('name')?.valueChanges.subscribe(() => {
      this.form.markAllAsTouched();
    });
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.initializeSvg();
    this.initializeTree();
  }

  protected resetTree(): void {
    this.editedTree = _.cloneDeep(this.tree);
    this.renderTree();
  }

  protected createTree(): void {
    this.store.createTree(this.editedTree);
    this.router.navigate(['/tree']);
  }

  protected saveTitle(): void {
    this.editedTree.name = this.form.get('name')?.value;
    this.editMode = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setDimensions();
    this.renderTree();
  }

  private setDimensions(): void {
    const element = this.treeContainer.nativeElement;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
  }

  private initializeSvg(): void {
    this.zoom = d3
      .zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', (event) => {
        this.container.attr('transform', event.transform);
      });

    this.svg = d3
      .select(this.treeContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .call(this.zoom);

    const width = this.treeContainer.nativeElement.clientWidth;
    const height = this.treeContainer.nativeElement.clientHeight;

    this.container = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 10})`);
  }

  private initializeTree(): void {
    this.renderTree();
  }

  private renderTree(): void {
    // Adjust nodeSize to account for dynamic text size
    const treeLayout = d3
      .tree<TreeNode>()
      .nodeSize([150, 100]) // Fixed width for node, but dynamic height based on content
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2)); // Increase separation between nodes    const root = d3.hierarchy(this.treeData, d => d.children);

    const root = d3.hierarchy<TreeNode>(
      this.editedTree.rootNode as unknown as TreeNode,
      (d) => d.children || []
    );

    treeLayout(root);

    const nodes = root.descendants();
    const links = root.links();

    this.container.selectAll('*').remove();

    // Draw links
    this.container
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: LinkData) => this.createForkedLink(d))
      .style('stroke', '#999')
      .style('fill', 'none')
      .style('stroke-width', 2);

    // Draw nodes
    const nodeGroup = this.container
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr(
        'transform',
        (d: d3.HierarchyPointNode<TreeNode>) => `translate(${d.x},${d.y})`
      )
      .on('click', (_: Event, d: d3.HierarchyPointNode<TreeNode>) =>
        this.onNodeClick(d.data)
      );

    // Create foreignObject to embed HTML
    const foreignObject = nodeGroup
      .append('foreignObject')
      .attr('width', 200)
      .attr('height', 80)
      .attr('x', -100)
      .attr('y', -40);

    // Create HTML content
    foreignObject
      .append('xhtml:div')
      .attr('class', 'tree-node')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('background', 'white')
      .style('border-radius', '8px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('transition', 'all 0.3s ease')
      .style('cursor', 'pointer')
      .style('border', '1px solid #e5e7eb')
      .each(function (this: HTMLElement, d: d3.HierarchyPointNode<TreeNode>) {
        const div = d3.select(this);

        // Add icon
        div
          .append('i')
          .attr('class', 'pi pi-folder')
          .style('font-size', '24px')
          .style('color', '#10b981')
          .style('margin-bottom', '4px');

        // Add name
        div
          .append('div')
          .style('font-size', '14px')
          .style('font-weight', '500')
          .style('color', '#1f2937')
          .style('text-align', 'center')
          .style('max-width', '180px')
          .style('overflow', 'hidden')
          .style('text-overflow', 'ellipsis')
          .style('white-space', 'nowrap')
          .text(d.data.name);

        // Add hover effect
        div
          .on('mouseover', function () {
            d3.select(this)
              .style('transform', 'scale(1.05)')
              .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
              .style('border-color', '#10b981')
              .style('border-width', '2px')
              .style('background', '#f8fafc');
          })
          .on('mouseout', function () {
            const node = d3.select(this);
            // Only reset if not selected
            if (!node.classed('selected')) {
              node
                .style('transform', 'scale(1)')
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
                .style('border-color', '#e5e7eb')
                .style('border-width', '1px')
                .style('background', 'white');
            }
          })
          .on('click', function () {
            const node = d3.select(this);
            // Add selected class and apply selected styles
            node
              .classed('selected', true)
              .style('transform', 'scale(1)')
              .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
              .style('border-color', '#10b981')
              .style('border-width', '2px')
              .style('background', '#f8fafc');
          });
      });

    // Update rectangle size based on content
    nodeGroup.each(
      (_: d3.HierarchyPointNode<TreeNode>, i: number, nodes: SVGGElement[]) => {
        const group = d3.select(nodes[i]);
        const foreignObject = group.select('foreignObject');
        foreignObject
          .attr('width', 200)
          .attr('height', 80)
          .attr('x', -100)
          .attr('y', -40);
      }
    );

    // Append plus button next to clicked node if available
    if (this.highlightedNode) {
      this.createPlusButton(this.highlightedNode);
      this.createDeleteButton(this.highlightedNode);
    }
  }

  private createForkedLink(d: LinkData): string {
    const parentX = d.source.x;
    const parentY = d.source.y;
    const childX = d.target.x;
    const childY = d.target.y;

    const midY = (parentY + childY) / 2; // Intermediate join point

    return `
      M${parentX},${parentY}
      V${midY}
      H${childX}
      V${childY}
    `;
  }

  private onNodeClick(selectedNode: TreeNode): void {
    // Remove highlight from all nodes (reset to white)
    this.container.selectAll('.node rect').style('fill', 'white');

    // Find and highlight the selected node
    this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === selectedNode)
      .select('rect')
      .style('fill', '#34d399'); // Apply green color

    // Store the highlighted node
    this.highlightedNode = selectedNode;

    // Optionally recreate plus/delete buttons
    this.createPlusButton(this.highlightedNode);
    this.createDeleteButton(this.highlightedNode);
  }

  private createPlusButton(node: TreeNode): void {
    const nodeGroup = this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === node);

    // Remove existing plus button if any
    if (this.button) {
      this.button.remove();
    }

    // Create new plus button
    this.button = nodeGroup
      .append('g')
      .attr('class', 'plus-button')
      .attr('transform', 'translate(140, -30)') // Increased distance from node and between buttons
      .on('click', () => this.addNode(node?.id || ''));

    // Create foreignObject for HTML content
    this.button
      .append('foreignObject')
      .attr('width', 36)
      .attr('height', 36)
      .attr('x', -18)
      .attr('y', -18)
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('background', 'white')
      .style('border-radius', '50%')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('transition', 'all 0.3s ease')
      .style('cursor', 'pointer')
      .style('border', '2px solid #e5e7eb')
      .each(function (this: HTMLElement) {
        const div = d3.select(this);

        div
          .append('i')
          .attr('class', 'pi pi-plus')
          .style('font-size', '18px')
          .style('color', '#10b981');

        // Add hover effect
        div
          .on('mouseover', function () {
            d3.select(this)
              .style('transform', 'scale(1.05)')
              .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
              .style('border-color', '#10b981')
              .style('background', '#f3f4f6')
              .style('border-width', '2px');
          })
          .on('mouseout', function () {
            d3.select(this)
              .style('transform', 'scale(1)')
              .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
              .style('border-color', '#e5e7eb')
              .style('background', 'white')
              .style('border-width', '2px');
          });
      });
  }

  private createDeleteButton(node: TreeNode): void {
    const nodeGroup = this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === node);

    // Remove existing delete button if any
    if (this.deleteButton) {
      this.deleteButton.remove();
    }

    // Create new delete button
    this.deleteButton = nodeGroup
      .append('g')
      .attr('class', 'delete-button')
      .attr('transform', 'translate(140, 30)') // Increased distance from node and between buttons
      .on('click', () => this.removeNode(node?.id || ''));

    // Create foreignObject for HTML content
    this.deleteButton
      .append('foreignObject')
      .attr('width', 36)
      .attr('height', 36)
      .attr('x', -18)
      .attr('y', -18)
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('background', 'white')
      .style('border-radius', '50%')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('transition', 'all 0.3s ease')
      .style('cursor', 'pointer')
      .style('border', '2px solid #e5e7eb')
      .each(function (this: HTMLElement) {
        const div = d3.select(this);

        div
          .append('i')
          .attr('class', 'pi pi-trash')
          .style('font-size', '18px')
          .style('color', '#10b981');

        // Add hover effect
        div
          .on('mouseover', function () {
            d3.select(this)
              .style('transform', 'scale(1.05)')
              .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
              .style('border-color', '#10b981')
              .style('background', '#f3f4f6')
              .style('border-width', '2px');
          })
          .on('mouseout', function () {
            d3.select(this)
              .style('transform', 'scale(1)')
              .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
              .style('border-color', '#e5e7eb')
              .style('background', 'white')
              .style('border-width', '2px');
          });
      });
  }

  addNode(parentId: string): void {
    const parentNode = this.findNode(this.editedTree.rootNode!, parentId);

    if (parentNode) {
      const newNode: TreeNode = {
        id: uuidv4(),
        name: 'New Node',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: this.editedTree.createdBy!,
        updatedBy: this.editedTree.updatedBy!,
        widgets: [],
        children: [],
      };
      parentNode.children = parentNode.children || [];
      parentNode.children.push(newNode);
      this.editedTree = _.cloneDeep(this.editedTree);
      this.renderTree();
    }
  }

  removeNode(nodeId: string): void {
    const parentNode = this.findParentNode(this.editedTree.rootNode!, nodeId);
    if (parentNode) {
      parentNode.children = parentNode?.children?.filter(
        (child) => child.id !== nodeId
      );
      this.editedTree = _.cloneDeep(this.editedTree);
      this.renderTree();

      // Reset highlighted node if it was deleted
      if (this.highlightedNode?.id === nodeId) {
        this.highlightedNode = null;
      }
    }
  }

  private findNode(node: TreeRootNode | TreeNode, id: string): TreeNode | null {
    if (node.id === id) {
      return node as TreeNode;
    }

    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        const found = this.findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  private findParentNode(
    node: Tree | TreeRootNode | TreeNode,
    id: string
  ): TreeNode | null {
    // Handle Tree type
    if ('rootNode' in node && !('children' in node)) {
      return this.findParentNode(node.rootNode, id);
    }

    // Handle TreeRootNode and TreeNode types
    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        if (child.id === id) {
          return node as TreeNode;
        }
        const found = this.findParentNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }
}
