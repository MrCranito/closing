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
  Tree,
  TreeStatus,
  TreeRootNode,
  NodeAction,
  NodeWidget,
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
  AbstractControl,
  FormArray,
} from '@angular/forms';
import * as _ from 'lodash';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TreeStore } from '@closing/tree/data-access';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
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
    DrawerModule,
    DividerModule,
    MenuModule,
    TooltipModule,
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

  private createNodeFormGroup(node: TreeNode): FormGroup {
    return this.formBuilder.group({
      name: [node.name, [Validators.required, Validators.minLength(3)]],
      description: [node.description || ''],
      children: this.formBuilder.array(
        (node.children || []).map((child) => this.createNodeFormGroup(child))
      ),
    });
  }

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

  protected widgetItems: MenuItem[] = [
    { label: 'Text', icon: 'pi pi-align-left' },
    { label: 'Image', icon: 'pi pi-image' },
    { label: 'Video', icon: 'pi pi-video' },
  ];

  protected tree: Partial<Tree> = this.treeData;
  protected editedTree: Partial<Tree> = _.cloneDeep(this.tree);
  protected editMode: boolean = false;

  protected get isEqual(): boolean {
    return _.isEqual(this.editedTree, this.tree);
  }

  protected sidebarVisible: boolean = false;
  protected selectedNode: TreeNode | null = null;
  protected nodeForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  private svg: any;
  private container: any;
  private width = 0;
  private height = 0;
  private nodeIdCounter = 1;
  private zoom: any;
  private button: any;
  private deleteButton: any;
  private currentRotation = 0;
  private isVertical = false; // Track tree orientation

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

    this.nodeForm.get('children')?.valueChanges.subscribe(() => {
      console.log(this.nodeForm.get('children')?.value);
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
      .nodeSize(this.isVertical ? [150, 100] : [100, 150]) // Adjust node sizing based on orientation
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

    const root = d3.hierarchy<TreeNode>(
      this.editedTree.rootNode as unknown as TreeNode,
      (d) => d.children || []
    );

    treeLayout(root);

    // Handle coordinates based on orientation
    root.descendants().forEach((node) => {
      if (!this.isVertical) {
        // Horizontal layout (default)
        const temp = node.x;
        node.x = node.y;
        node.y = temp;
      }
    });

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
      .attr('width', 120) // Reduced from 200
      .attr('height', 100) // Increased to accommodate text below
      .attr('x', -60) // Adjusted for new width
      .attr('y', -30); // Adjusted for new height

    // Create HTML content
    foreignObject
      .append('xhtml:div')
      .attr('class', 'tree-node')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('position', 'relative')
      .style('padding-bottom', '20px')
      .each(function (this: HTMLElement, d: d3.HierarchyPointNode<TreeNode>) {
        const div = d3.select(this);

        // Add container for icon
        const iconContainer = div
          .append('div')
          .style('width', '60px')
          .style('height', '60px')
          .style('display', 'flex')
          .style('align-items', 'center')
          .style('justify-content', 'center')
          .style('background', 'white')
          .style('border-radius', '8px')
          .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
          .style('transition', 'all 0.3s ease')
          .style('cursor', 'pointer')
          .style('border', '2px solid #808184')
          .style('margin-bottom', '8px');

        // Add icon to container
        iconContainer
          .append('i')
          .attr('class', 'pi pi-folder')
          .style('font-size', '24px')
          .style('color', '#10b981');

        // Add name below container
        div
          .append('div')
          .style('font-size', '12px')
          .style('font-weight', '500')
          .style('color', '#1f2937')
          .style('text-align', 'center')
          .style('max-width', '100px')
          .style('overflow', 'hidden')
          .style('text-overflow', 'ellipsis')
          .style('white-space', 'nowrap')
          .style('position', 'absolute')
          .style('bottom', '0')
          .style('left', '50%')
          .style('transform', 'translateX(-50%)')
          .text(d.data.name);

        // Add hover effect to icon container
        iconContainer
          .on('mouseover', function () {
            d3.select(this)
              .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
              .style('background', '#f8fafc');
          })
          .on('mouseout', function () {
            const node = d3.select(this);
            // Only reset if not selected
            if (!node.classed('selected')) {
              node
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
                .style('background', 'white');
            }
          });
      });

    // Update rectangle size based on content
    nodeGroup.each(
      (_: d3.HierarchyPointNode<TreeNode>, i: number, nodes: SVGGElement[]) => {
        const group = d3.select(nodes[i]);
        const foreignObject = group
          .select('foreignObject')
          .attr('width', 120)
          .attr('height', 100)
          .attr('x', -60)
          .attr('y', -30);
      }
    );
  }

  private createForkedLink(d: LinkData): string {
    const parentX = d.source.x;
    const parentY = d.source.y;
    const childX = d.target.x;
    const childY = d.target.y;

    if (this.isVertical) {
      // Vertical layout - links go down
      const midY = (parentY + childY) / 2;
      return `
        M${parentX},${parentY}
        V${midY}
        H${childX}
        V${childY}
      `;
    } else {
      // Horizontal layout - links go right
      const midX = (parentX + childX) / 2;
      return `
        M${parentX},${parentY}
        H${midX}
        V${childY}
        H${childX}
      `;
    }
  }

  protected addNode(): void {
    const parentId = this.selectedNode?.id;

    if (!parentId) return;

    if (!this.editedTree.rootNode) return;

    const newNode: TreeNode = {
      id: uuidv4(),
      name: 'New Node',
      description: '',
      children: [],
    };

    const parentNode = this.findNode(this.editedTree.rootNode, parentId);
    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(newNode);

      // Update the form structure
      if (this.selectedNode) {
        const childFormArray = this.findChildFormArray(this.nodeForm, parentId);
        if (childFormArray) {
          childFormArray.push(this.createNodeFormGroup(newNode));
        }
      }

      console.log(this.nodeForm.value);

      this.renderTree();
    }
  }

  private findChildFormArray(
    formGroup: FormGroup,
    nodeId: string
  ): FormArray | null {
    // Check if the current form group represents the target node
    const currentNodeId = this.findNodeIdForFormGroup(formGroup);
    if (currentNodeId === nodeId) {
      return formGroup.get('children') as FormArray;
    }

    // Get the children form array of the current form group
    const childrenArray = formGroup.get('children') as FormArray;
    if (!childrenArray) return null;

    // Recursively search through all children
    for (let i = 0; i < childrenArray.length; i++) {
      const childFormGroup = childrenArray.at(i) as FormGroup;
      const result = this.findChildFormArray(childFormGroup, nodeId);
      if (result) return result;
    }

    return null;
  }

  private findNodeIdForFormGroup(formGroup: FormGroup): string | null {
    // Find the corresponding node in the tree structure based on the form group's values
    const nameControl = formGroup.get('name');
    const descriptionControl = formGroup.get('description');

    const name = (nameControl?.value as string) || '';
    const description = (descriptionControl?.value as string) || '';

    // Search through the tree to find the matching node
    const findNodeByValues = (node: TreeNode): string | null => {
      if (node.name === name && node.description === description) {
        return node.id || null;
      }

      if (node.children) {
        for (const child of node.children) {
          const result = findNodeByValues(child);
          if (result) return result;
        }
      }

      return null;
    };

    return this.editedTree.rootNode
      ? findNodeByValues(this.editedTree.rootNode)
      : null;
  }

  protected removeNode(): void {
    const nodeId = this.selectedNode?.id;
    if (!nodeId) return;

    if (!this.editedTree.rootNode) return;

    const parentNode = this.findParentNode(this.editedTree.rootNode, nodeId);
    if (parentNode) {
      if (parentNode.children) {
        parentNode.children = parentNode.children.filter(
          (child: TreeNode) => child.id !== nodeId
        );
        this.renderTree();
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

  protected onSubmitNodeForm(): void {
    if (!this.selectedNode || !this.nodeForm.valid) return;

    const formValue = this.nodeForm.value;
    this.selectedNode.name = formValue.name;
    this.selectedNode.description = formValue.description;
    this.renderTree();
  }

  protected addWidget(widgetType: string): void {
    if (!this.selectedNode) return;

    const widget: NodeWidget = {
      id: uuidv4(),
      type: widgetType,
      config: {},
    };

    if (!this.selectedNode.widgets) {
      this.selectedNode.widgets = [];
    }
    this.selectedNode.widgets.push(widget);
    this.renderTree();
  }

  protected addAction(): void {
    if (!this.selectedNode) return;

    const action: NodeAction = {
      id: uuidv4(),
      name: 'New Action',
      type: 'button',
      config: {},
    };

    if (!this.selectedNode.actions) {
      this.selectedNode.actions = [];
    }
    this.selectedNode.actions.push(action);
    this.renderTree();
  }

  protected removeAction(action: NodeAction): void {
    if (!this.selectedNode?.actions) return;

    this.selectedNode.actions = this.selectedNode.actions.filter(
      (a: NodeAction) => a.id !== action.id
    );
    this.renderTree();
  }

  protected removeWidget(widget: NodeWidget): void {
    if (!this.selectedNode?.widgets) return;

    this.selectedNode.widgets = this.selectedNode.widgets.filter(
      (w) => w.id !== widget.id
    );
    this.renderTree();
  }

  protected onNodeClick(selectedNode: TreeNode): void {
    // Hide all connection points and lines first
    this.container.selectAll('.connection-group').style('display', 'none');

    // Reset styling for all nodes first
    this.container
      .selectAll('.node')
      .selectAll('foreignObject')
      .selectAll('.tree-node')
      .selectAll('div')
      .classed('selected', false)
      .style('border-color', '#808184')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('background', 'white');

    // Show connection points and lines only for the selected node
    const selectedNodeElement = this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === selectedNode);

    selectedNodeElement
      .selectAll('.connection-group')
      .style('display', 'block');

    // Apply styling to the selected node's icon container
    selectedNodeElement
      .select('foreignObject')
      .select('.tree-node')
      .select('div') // This selects the icon container
      .classed('selected', true)
      .style('transform', 'scale(1)')
      .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
      .style('border-color', '#10b981')
      .style('border-width', '2px')
      .style('background', '#f8fafc');

    this.selectedNode = selectedNode;
    this.nodeForm = this.createNodeFormGroup(selectedNode);
    this.sidebarVisible = true;
  }

  protected zoomIn(): void {
    this.zoom.scaleBy(this.svg, 1.1);
  }

  protected zoomOut(): void {
    this.zoom.scaleBy(this.svg, 0.9);
  }

  protected rotate(): void {
    // Toggle between vertical and horizontal orientation
    this.isVertical = !this.isVertical;

    // Update rotation angle
    this.currentRotation = this.isVertical ? 90 : 0;

    // Re-render the tree with new orientation
    this.renderTree();

    // Get the center point of the SVG for rotation
    const width = this.treeContainer.nativeElement.clientWidth;
    const height = this.treeContainer.nativeElement.clientHeight;

    // Adjust the container position based on orientation
    if (this.isVertical) {
      this.container.attr(
        'transform',
        `translate(${width / 2}, ${height / 10})`
      );
    } else {
      this.container.attr(
        'transform',
        `translate(${width / 2}, ${height / 10})`
      );
    }
  }

  protected openAIChat(): void {
    // To be implemented
  }

  protected undo(): void {
    // To be implemented
  }

  protected redo(): void {
    // To be implemented
  }

  protected goBack(): void {
    this.router.navigate(['/tree']);
  }
}
