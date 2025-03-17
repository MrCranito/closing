<LM%
^$$-`^I We&É@A  q>Wimport {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as d3 from 'd3';

interface SitemapNode {

i!Even I’m ('"é@ nvame: string;
  type: 'page' | 'form' | 'image' | 'file' | 'todo';
  children?: SitemapNode[];
  x?: number;
  y?: number;
}

@Component({
  selector: 'app-sitemap-builder',
  templateUrl: './sitemap-builder.component.html',
  styleUrls: ['./sitemap-builder.component.scss'],
})
export class SitemapBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('sitemapContainer') sitemapContainer!: ElementRef;

  private svg: any;
  private width = 1200;
  private height = 800;
  private margin = { top: 20, right: 120, bottom: 20, left: 120 };
  private treeLayout: any;
  private root: any;
  private nodes: SitemapNode[] = [];
  private links: any[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeSitemap();
  }

  private initializeSitemap(): void {
    // Create SVG container
    this.svg = d3
      .select(this.sitemapContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // Create tree layout
    this.treeLayout = d3
      .tree()
      .size([
        this.height - this.margin.top - this.margin.bottom,
        this.width - this.margin.left - this.margin.right,
      ]);

    // Initialize root node
    this.root = {
      id: 'root',
      name: 'Home',
      type: 'page',
      children: [],
    };

    this.updateSitemap();
  }

  private updateSitemap(): void {
    // Clear existing nodes and links
    this.svg.selectAll('.node').remove();
    this.svg.selectAll('.link').remove();

    // Update tree layout
    const treeData = d3.hierarchy(this.root);
    const treeLayout = this.treeLayout(treeData);

    // Create links
    const links = this.svg
      .selectAll('.link')
      .data(treeLayout.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x)
      )
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', 2);

    // Create nodes
    const nodes = this.svg
      .selectAll('.node')
      .data(treeLayout.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    // Add circles for nodes
    nodes
      .append('circle')
      .attr('r', 10)
      .style('fill', (d: any) => this.getNodeColor(d.data.type));

    // Add labels
    nodes
      .append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => (d.children ? -13 : 13))
      .style('text-anchor', (d: any) => (d.children ? 'end' : 'start'))
      .text((d: any) => d.data.name);

    // Add drag behavior
    const drag = d3
      .drag()
      .on('start', this.dragStarted.bind(this))
      .on('drag', this.dragged.bind(this))
      .on('end', this.dragEnded.bind(this));

    nodes.call(drag);
  }

  private getNodeColor(type: string): string {
    switch (type) {
      case 'page':
        return '#4CAF50';
      case 'form':
        return '#2196F3';
      case 'image':
        return '#FFC107';
      case 'file':
        return '#9C27B0';
      case 'todo':
        return '#FF5722';
      default:
        return '#757575';
    }
  }

  private dragStarted(event: any): void {
    if (!event.active) this.updateSitemap();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  private dragged(event: any): void {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
    this.updateSitemap();
  }

  private dragEnded(event: any): void {
    if (!event.active) this.updateSitemap();
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // Toolbar actions
  addPage(): void {
    this.addNode('New Page', 'page');
  }

  addForm(): void {
    this.addNode('New Form', 'form');
  }

  addImage(): void {
    this.addNode('New Image', 'image');
  }

  addFile(): void {
    this.addNode('New File', 'file');
  }

  addTodo(): void {
    this.addNode('New Todo', 'todo');
  }

  private addNode(
    name: string,
    type: 'page' | 'form' | 'image' | 'file' | 'todo'
  ): void {
    const newNode: SitemapNode = {
      id: `node-${Date.now()}`,
      name: name,
      type: type,
      children: [],
    };

    if (!this.root.children) {
      this.root.children = [];
    }
    this.root.children.push(newNode);
    this.updateSitemap();
  }

  deleteNode(): void {
    // Implementation for deleting selected node
  }

  exportSitemap(): void {
    const sitemapData = JSON.stringify(this.root, null, 2);
    const blob = new Blob([sitemapData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
