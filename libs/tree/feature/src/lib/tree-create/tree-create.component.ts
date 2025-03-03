import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode, User } from '@closing/shared/interfaces';
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
  ],
  standalone: true,
  templateUrl: './tree-create.component.html',
  host: {
    class: 'h-full w-full',
  },
})
export class TreeCreateComponent {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;

  sidebarVisible: boolean = false;
  editingNode: TreeNode | null = null;
  nodeForm: FormGroup;

  private defaultUser: User = {
    id: '1',
    lastname: 'Doe',
    firstname: 'John',
    email: 'john.doe@example.com',
    isEmailVerified: true,
  };

  private treeData: TreeNode = {
    id: 'root',
    name: 'Root Node',
    description: 'Root node of the tree',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: this.defaultUser,
    updatedBy: this.defaultUser,
    widgets: [],
    children: [],
  };

  private svg: any;
  private container: any;
  private width = 0;
  private height = 0;
  private nodeIdCounter = 1;
  private zoom: any;
  private highlightedNode: TreeNode | null = null;
  private button: any;
  private deleteButton: any;

  constructor(private fb: FormBuilder) {
    this.nodeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.initializeSvg();
    this.initializeTree();
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
    const treeLayout = d3
      .tree<TreeNode>()
      .nodeSize([150, 100])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

    const root = d3.hierarchy(this.treeData, (d) => d.children);
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

    // Append rectangles
    nodeGroup
      .append('rect')
      .attr('rx', 5)
      .attr('ry', 5)
      .style('fill', 'white')
      .style('stroke', 'black');

    // Append text
    const text = nodeGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .style('font-size', '14px')
      .text((d: d3.HierarchyPointNode<TreeNode>) => d.data.name);

    // Update rectangle sizes
    nodeGroup.each(
      (_: d3.HierarchyPointNode<TreeNode>, i: number, nodes: SVGGElement[]) => {
        const group = d3.select(nodes[i]);
        const textElement = group.select('text').node() as SVGTextElement;
        if (!textElement) return;

        const bbox = textElement.getBBox();
        const padding = 10;

        group
          .select('rect')
          .attr('x', -bbox.width / 2 - padding)
          .attr('y', -bbox.height / 2 - padding / 2)
          .attr('width', bbox.width + padding * 2)
          .attr('height', bbox.height + padding);
      }
    );

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
    const midY = (parentY + childY) / 2;

    return `
      M${parentX},${parentY}
      V${midY}
      H${childX}
      V${childY}
    `;
  }

  private onNodeClick(selectedNode: TreeNode): void {
    this.container.selectAll('.node rect').style('fill', 'white');

    this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === selectedNode)
      .select('rect')
      .style('fill', '#34d399');

    this.highlightedNode = selectedNode;
    this.openEditPanel(selectedNode);
    this.createPlusButton(this.highlightedNode);
    this.createDeleteButton(this.highlightedNode);
  }

  private createPlusButton(node: TreeNode): void {
    if (this.button) {
      this.button.remove();
    }

    const nodeGroup = this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === node);

    this.button = nodeGroup
      .append('g')
      .attr('class', 'plus-button')
      .attr('transform', 'translate(80, -20)')
      .on('click', () => this.addNode(node.id));

    this.button
      .append('circle')
      .attr('r', 15)
      .style('fill', 'white')
      .style('stroke', 'black')
      .style('cursor', 'pointer');

    this.button
      .append('text')
      .attr('x', -5)
      .attr('y', 5)
      .style('fill', 'black')
      .text('+');
  }

  private createDeleteButton(node: TreeNode): void {
    if (this.deleteButton) {
      this.deleteButton.remove();
    }

    const nodeGroup = this.container
      .selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === node);

    this.deleteButton = nodeGroup
      .append('g')
      .attr('class', 'delete-button')
      .attr('transform', 'translate(80, 20)')
      .on('click', () => this.removeNode(node.id));

    this.deleteButton
      .append('circle')
      .attr('r', 15)
      .style('fill', 'red')
      .style('cursor', 'pointer');

    this.deleteButton
      .append('text')
      .attr('x', -5)
      .attr('y', 5)
      .style('fill', 'white')
      .text('-');
  }

  private openEditPanel(node: TreeNode): void {
    this.editingNode = node;
    this.nodeForm.patchValue({
      name: node.name,
      description: node.description || '',
    });
    this.sidebarVisible = true;
  }

  saveNodeDetails(): void {
    if (this.editingNode && this.nodeForm.valid) {
      const formValue = this.nodeForm.value;
      this.editingNode.name = formValue.name;
      this.editingNode.description = formValue.description;
      this.editingNode.updatedAt = new Date();
      this.editingNode.updatedBy = this.defaultUser;
      this.renderTree();
      this.sidebarVisible = false;
      this.editingNode = null;
    }
  }

  private addNode(parentId: string): void {
    const parentNode = this.findNode(this.treeData, parentId);
    if (parentNode) {
      const newNode: TreeNode = {
        id: `node-${this.nodeIdCounter++}`,
        name: 'New Node',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: this.defaultUser,
        updatedBy: this.defaultUser,
        widgets: [],
        children: [],
      };
      parentNode.children = parentNode.children || [];
      parentNode.children.push(newNode);
      this.renderTree();
      this.openEditPanel(newNode);
    }
  }

  private removeNode(nodeId: string): void {
    const parentNode = this.findParentNode(this.treeData, nodeId);
    if (parentNode) {
      parentNode.children = parentNode.children.filter(
        (child) => child.id !== nodeId
      );
      this.renderTree();

      if (this.highlightedNode?.id === nodeId) {
        this.highlightedNode = null;
        this.sidebarVisible = false;
      }
    }
  }

  private findNode(node: TreeNode, id: string): TreeNode | null {
    if (node.id === id) return node;
    if (!node.children) return null;

    for (const child of node.children) {
      const found = this.findNode(child, id);
      if (found) return found;
    }
    return null;
  }

  private findParentNode(node: TreeNode, id: string): TreeNode | null {
    if (!node.children) return null;

    for (const child of node.children) {
      if (child.id === id) {
        return node;
      }
      const found = this.findParentNode(child, id);
      if (found) return found;
    }
    return null;
  }
}
