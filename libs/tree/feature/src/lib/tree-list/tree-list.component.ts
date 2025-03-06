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
import { toObservable } from '@angular/core/rxjs-interop';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'tree-list-feature',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
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
          command: () => console.log(),
        },
        {
          label: 'Last Modified',
          command: () => console.log(),
        },
      ],
    },
  ];

  constructor() {
    toObservable(this.#store.treesEntities).subscribe((trees) => {
      console.log(trees);
    });
  }

  selectNodeTree(node: Tree): void {
    this.router.navigate(['tree', 'edit', node._id]);
  }

  addNewNodeTree(): void {
    this.router.navigate(['tree', 'create']);
  }
}
