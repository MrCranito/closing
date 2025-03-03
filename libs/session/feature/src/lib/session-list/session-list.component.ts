import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SessionStore, Session } from '@closing/session/data-access';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';
import { Column } from '@closing/shared/interfaces';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'lib-session-list-feature',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './session-list.component.html',
  host: {
    class: 'w-full',
  },
})
export class SessionListComponent {
  readonly #store = inject(SessionStore);
  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    search: [''],
  });

  protected sessions: Signal<Session[]> = this.#store.sessions;
  protected loading: Signal<boolean> = this.#store.loading;
  protected total: Signal<number> = this.#store.total;
  protected error: Signal<string | null> = this.#store.error;

  protected columns: Column[] = [
    {
      field: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      field: 'tree',
      header: 'Tree',
    },
    {
      field: 'user',
      header: 'User',
    },
    {
      field: 'status',
      header: 'Status',
    },
    {
      field: 'createdAt',
      header: 'Date',
    },
  ];

  constructor() {
    console.log('coucou');
  }

  onLazyLoad(event: TableLazyLoadEvent) {}

  search(event: Event) {}
}
