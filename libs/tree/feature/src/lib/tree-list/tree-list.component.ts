import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Tree,
  TreePermissionLevel,
  TreeStatus,
} from '@closing/shared/interfaces';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TreeStore } from '@closing/tree/data-access';

@Component({
  selector: 'tree-list-feature',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    InputTextModule,
    FormsModule,
  ],
  standalone: true,
  templateUrl: './tree-list.component.html',
  host: {
    class: 'h-full w-full',
  },
})
export class TreeListComponent {
  private router: Router = inject(Router);
  readonly #store = inject(TreeStore);
  searchQuery: string = '';

  protected trees: Signal<Tree[]> = this.#store.treesEntities;
  protected loading: Signal<boolean> = this.#store.loading;
  protected total: Signal<number> = this.#store.total;
  protected error: Signal<string | null> = this.#store.error;

  filterMenuItems: MenuItem[] = [
    {
      label: 'Sort by',
      items: [
        {
          label: 'Name',
          command: () => this.sortByName(),
        },
        {
          label: 'Last Modified',
          command: () => this.sortByLastModified(),
        },
      ],
    },
  ];

  treeList: Tree[] = [
    {
      id: 'sales_1',
      name: 'Tree Node Default',
      description: 'A default tree node structure',
      icon: 'fa-project-diagram',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      createdBy: {
        id: '1',
        lastname: 'Doe',
        firstname: 'John',
        email: 'john.doe@example.com',
        isEmailVerified: true,
      },
      updatedBy: {
        id: '1',
        lastname: 'Doe',
        firstname: 'John',
        email: 'john.doe@example.com',
        isEmailVerified: true,
      },
      permissions: [
        {
          entityId: '1',
          entityType: 'tree',
          level: TreePermissionLevel.READ,
          grandedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          grandedBy: {
            id: '1',
            lastname: 'Doe',
            firstname: 'John',
            email: 'john.doe@example.com',
            isEmailVerified: true,
          },
        },
      ],
      status: TreeStatus.ACTIVE,
      rootNode: {
        id: '1',
        name: 'Root Node',
        description: 'A default root node structure',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        createdBy: {
          id: '1',
          lastname: 'Doe',
          firstname: 'John',
          email: 'john.doe@example.com',
          isEmailVerified: true,
        },
        updatedBy: {
          id: '1',
          lastname: 'Doe',
          firstname: 'John',
          email: 'john.doe@example.com',
          isEmailVerified: true,
        },
        children: [],
      },
    },
  ];

  get filteredTreeNodes(): Tree[] {
    return this.treeList.filter((node) =>
      node.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectNodeTree(node: Tree): void {
    this.router.navigate(['tree', 'edit', node.id]);
  }

  addNewNodeTree(): void {
    this.router.navigate(['tree', 'create']);
  }

  private sortByName(): void {
    this.treeList.sort((a, b) => a.name.localeCompare(b.name));
  }

  private sortByLastModified(): void {
    this.treeList.sort((a, b) => {
      const dateA = a.updatedAt || new Date(0);
      const dateB = b.updatedAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }
}
