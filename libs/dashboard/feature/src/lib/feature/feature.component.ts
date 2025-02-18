import { Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}


@Component({
  selector: 'dashboard-feature',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
  host:  {
    class: 'h-full w-full'
  }
})
export class FeatureComponent {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;
  private treeData: TreeNode = { id: 'root', name: 'Root Node', children: [{ id: 'secondary', name: 'child', children: [] }] };
  private svg: any;
  private container: any;
  private width = 0;
  private height = 0;
  private nodeIdCounter = 1;
  private zoom: any;
  private highlightedNode: TreeNode | null = null; // To store the highlighted node
  private button: any; // To store the plus button for adding children
  private deleteButton: any; // To store the delete button for removing nodes

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
    this.zoom = d3.zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', (event) => {
        this.container.attr('transform', event.transform);
      });
  
    this.svg = d3.select(this.treeContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .call(this.zoom);
  
    this.container = this.svg.append('g')
      .attr('transform', 'translate(150,200)');
  }
  
  private initializeTree(): void {
    this.renderTree();
  }
  
  private renderTree(): void {
    const treeLayout = d3.tree<TreeNode>().nodeSize([100, 200]).separation(() => 0.5);
    const root = d3.hierarchy(this.treeData, d => d.children);
    treeLayout(root);
  
    const nodes = root.descendants();
    const links = root.links();
  
    this.container.selectAll('*').remove();
  
    // Draw links
    this.container.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', this.elbow)
      .style('stroke', '#999');
  
    // Draw nodes
    const nodeGroup = this.container.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: d3.HierarchyPointNode<TreeNode>) => `translate(${d.x},${d.y})`)
      .on('click', (_: Event, d: d3.HierarchyPointNode<TreeNode>) => this.onNodeClick(d.data));
  
    nodeGroup.append('rect')
      .attr('width', 150)
      .attr('height', 40)
      .attr('x', -75)
      .attr('y', -20)
      .style('fill', 'lightblue')
      .style('stroke', (d: d3.HierarchyPointNode<TreeNode>) => d.data === this.highlightedNode ? 'orange' : 'none'); // Highlight the clicked node
  
    nodeGroup.append('text')
      .attr('dx', -65)
      .attr('dy', 5)
      .text((d: d3.HierarchyPointNode<TreeNode>) => d.data.name);
  
    // Append plus button next to clicked node if available
    if (this.highlightedNode) {
      this.createPlusButton(this.highlightedNode);
      this.createDeleteButton(this.highlightedNode);
    }
  }
  
  private onNodeClick(node: TreeNode): void {
    console.log('Node clicked:', node);
    this.highlightedNode = node; // Set the clicked node as highlighted
    this.renderTree(); // Re-render the tree to apply highlight and button
  }
  
  private createPlusButton(node: TreeNode): void {
    const nodeGroup = this.container.selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === node);
  
    // Remove existing plus button if any
    if (this.button) {
      this.button.remove();
    }
  
    // Create new plus button
    this.button = nodeGroup.append('g')
      .attr('class', 'plus-button')
      .attr('transform', 'translate(80, -20)') // Position button next to node
      .on('click', () => this.addNode(node.id));
  
    this.button.append('circle')
      .attr('r', 15)
      .style('fill', 'green')
      .style('cursor', 'pointer');
  
    this.button.append('text')
      .attr('x', -5)
      .attr('y', 5)
      .style('fill', 'white')
      .text('+');
  }

  private createDeleteButton(node: TreeNode): void {
    const nodeGroup = this.container.selectAll('.node')
      .filter((d: d3.HierarchyPointNode<TreeNode>) => d.data === node);
  
    // Remove existing delete button if any
    if (this.deleteButton) {
      this.deleteButton.remove();
    }
  
    // Create new delete button
    this.deleteButton = nodeGroup.append('g')
      .attr('class', 'delete-button')
      .attr('transform', 'translate(80, 20)') // Position button at the bottom of the node
      .on('click', () => this.removeNode(node.id));
  
    this.deleteButton.append('circle')
      .attr('r', 15)
      .style('fill', 'red')
      .style('cursor', 'pointer');
  
    this.deleteButton.append('text')
      .attr('x', -5)
      .attr('y', 5)
      .style('fill', 'white')
      .text('🗑️');
  }
  
  addNode(parentId: string): void {
    const parentNode = this.findNode(this.treeData, parentId);
    if (parentNode) {
      const newNode: TreeNode = { id: `node-${this.nodeIdCounter++}`, name: 'New Node', children: [] };
      parentNode.children = parentNode.children || [];
      parentNode.children.push(newNode);
      this.renderTree();
    }
  }


removeNode(nodeId: string): void {
  const parentNode = this.findParentNode(this.treeData, nodeId);
  if (parentNode) {
    parentNode.children = parentNode?.children?.filter(child => child.id !== nodeId); // Remove the node and its children
    this.renderTree(); // Re-render tree after removal
  }
}
  
  private findNode(tree: TreeNode, id: string): TreeNode | null {
    if (tree.id === id) return tree;
    if (!tree.children) return null;
    for (const child of tree.children) {
      const found = this.findNode(child, id);
      if (found) return found;
    }
    return null;
  }

  // Find the parent node to remove a child
  private findParentNode(tree: TreeNode, id: string): TreeNode | null {
    if (!tree.children) return null;
    for (const child of tree.children) {
      if (child.id === id) {
        return tree; // Parent node found
      }
      const found = this.findParentNode(child, id);
      if (found) return found;
    }
    return null;
  }

  
  private elbow(d: any): string {
    return `M${d.source.x},${d.source.y} H${(d.source.x + d.target.x) / 2} V${d.target.y} H${d.target.x}`;
  }
  
}
