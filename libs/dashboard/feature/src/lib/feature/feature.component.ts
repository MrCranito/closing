import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode } from '@closing/shared/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard-feature',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
  host: {
    class: 'h-full w-full',
  },
})
export class FeatureComponent {
  private router: Router = inject(Router);

  treeNodeList: TreeNode[] = [
    {
      id: 'sales_1',
      name: 'Tree Node Default',
      children: [{ id: 'secondary', name: 'child', children: [] }],
    },
    {
      id: 'sales_2',
      name: 'CSLM Tree Node',
      children: [{ id: 'secondary', name: 'child', children: [] }],
    },
    {
      id: 'sales_3',
      name: 'Sales Tree Node',
      children: [{ id: 'secondary', name: 'child', children: [] }],
    },
  ];

  selectNodeTree(node: TreeNode): void {
    this.router.navigate([
      { outlets: { 'sub-router': ['tree', 'edit', node.id] } },
    ]);
  }

  addNewNodeTree(): void {
    this.router.navigate([{ outlets: { 'sub-router': ['tree'] } }]);
  }
}
