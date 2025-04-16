import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Tree as Diagram,
  TreePermissionLevel as DiagramPermissionLevel,
  TreeStatus as DiagramStatus,
} from '@closing/shared/interfaces';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DiagramStore } from '@closing/diagram/data-access';
import { toObservable } from '@angular/core/rxjs-interop';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'diagram-list-feature',
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
  templateUrl: './diagram-list.component.html',
  host: {
    class: 'h-full w-full',
  },
})
export class DiagramListComponent {
  private router: Router = inject(Router);
  readonly #store = inject(DiagramStore);
  searchQuery: string = '';

  protected diagrams: Signal<Diagram[]> = this.#store.diagramsEntities;
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
    toObservable(this.#store.diagramsEntities).subscribe((diagrams) => {
      console.log(diagrams);
    });
  }

  selectDiagram(diagram: Diagram): void {
    this.router.navigate(['diagram', 'edit', diagram._id]);
  }

  addNewDiagram(): void {
    this.router.navigate(['diagram', 'create']);
  }
}
