import {
  Component,
  viewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { UsersStore } from '@closing/users/data-access';
import { User, UserRoleEnum } from '@closing/shared/interfaces';
import { Signal } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Column } from '@closing/shared/interfaces';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Validators } from '@angular/forms';
@Component({
  selector: 'lib-users-list',
  templateUrl: './users-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    TagModule,
    TooltipModule,
    AvatarModule,
    ButtonModule,
    DialogModule,
  ],
  host: {
    class: 'w-full',
  },
})
export class UsersListComponent implements AfterViewInit {
  readonly #store = inject(UsersStore);
  private formBuilder = inject(FormBuilder);

  protected roleTemplate = viewChild<TemplateRef<any>>('roleTemplate');
  protected teamTemplate = viewChild<TemplateRef<any>>('teamTemplate');

  protected form = this.formBuilder.group({
    search: ['', Validators.required],
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    email: ['', Validators.required, Validators.email],
    role: ['', Validators.required],
  });

  protected users: Signal<User[]> = this.#store.usersEntities;
  protected loading: Signal<boolean> = this.#store.loading;
  protected total: Signal<number> = this.#store.total;
  protected error: Signal<string | null> = this.#store.error;

  protected rolesEnum = UserRoleEnum;

  protected roles: SelectItem[] = [
    {
      label: 'Administrator',
      value: UserRoleEnum.Admin,
      icon: 'pi pi-lock',
    },
    {
      label: 'Moderator',
      value: UserRoleEnum.Moderator,
      icon: 'pi pi-pencil',
    },
    {
      label: 'Viewer',
      value: UserRoleEnum.Viewer,
      icon: 'pi pi-eye',
    },
  ];
  protected columns: Column[] = [];
  protected showAddUserDialog = false;

  ngAfterViewInit() {
    this.columns = [
      {
        field: 'lastname',
        header: 'Lastname',
        sortable: true,
        filterable: false,
      },
      {
        field: 'firstname',
        header: 'Firstname',
        sortable: true,
        filterable: false,
      },
      { field: 'email', header: 'Email', sortable: true, filterable: false },
      { field: 'phone', header: 'Phone', sortable: true, filterable: false },
      {
        field: 'address',
        header: 'Address',
        sortable: true,
        filterable: false,
      },
      {
        field: 'team',
        header: 'Team',
        sortable: true,
        filterable: false,
        template: this.teamTemplate(),
      },
      {
        field: 'role',
        header: 'Role',
        sortable: true,
        filterable: false,
        template: this.roleTemplate(),
      },
    ];
  }

  addUser(): void {
    this.showAddUserDialog = true;
  }

  saveUser(): void {
    this.showAddUserDialog = false;
  }

  importUsers(): void {}

  onLazyLoad(event: TableLazyLoadEvent) {}
}
