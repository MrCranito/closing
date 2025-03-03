import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { inject } from '@angular/core';
import { UsersStore } from '@closing/users/data-access';
import { User } from '@closing/shared/interfaces';
import { Signal } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Column } from '@closing/shared/interfaces';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'lib-users-list',
  templateUrl: './users-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  host: {
    class: 'w-full',
  },
})
export class UsersListComponent {
  readonly #store = inject(UsersStore);
  private formBuilder = inject(FormBuilder);

  protected form = this.formBuilder.group({
    search: [''],
  });

  protected users: Signal<User[]> = this.#store.usersEntities;
  protected loading: Signal<boolean> = this.#store.loading;
  protected total: Signal<number> = this.#store.total;
  protected error: Signal<string | null> = this.#store.error;

  protected columns: Column[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: false },
    { field: 'email', header: 'Email', sortable: true, filterable: false },
    { field: 'phone', header: 'Phone', sortable: true, filterable: false },
    { field: 'address', header: 'Address', sortable: true, filterable: false },
  ];
  onLazyLoad(event: TableLazyLoadEvent) {}
}
