import { AfterViewInit, Component, Signal, viewChild } from '@angular/core';
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
import { TemplateRef } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
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
    AvatarModule,
    TagModule,
    TooltipModule,
    ButtonModule,
  ],
  templateUrl: './session-list.component.html',
  host: {
    class: 'w-full',
  },
})
export class SessionListComponent implements AfterViewInit {
  readonly #store = inject(SessionStore);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  protected dateTemplate = viewChild<TemplateRef<Session>>('dateTemplate');
  protected avatarTemplate = viewChild<TemplateRef<Session>>('avatarTemplate');
  protected statusTemplate = viewChild<TemplateRef<Session>>('statusTemplate');
  protected treeTemplate = viewChild<TemplateRef<Session>>('treeTemplate');
  protected customerTemplate =
    viewChild<TemplateRef<Session>>('customerTemplate');

  protected form = this.formBuilder.group({
    search: [''],
  });

  protected sessions: Signal<Session[]> = this.#store.sessionsEntities;
  protected loading: Signal<boolean> = this.#store.loading;
  protected total: Signal<number> = this.#store.total;
  protected error: Signal<string | null> = this.#store.error;

  protected columns: Column[] = [];

  ngAfterViewInit(): void {
    this.columns = [
      {
        field: 'customer',
        header: 'Client Name',
        sortable: true,
        template: this.customerTemplate(),
        subField: 'name',
      },
      {
        field: 'tree_name',
        header: 'Tree',
        template: this.treeTemplate(),
      },
      {
        field: 'user',
        header: 'User',
        template: this.avatarTemplate(),
      },
      {
        field: 'status',
        header: 'Status',
        template: this.statusTemplate(),
      },
      {
        field: 'createdAt',
        header: 'Date',
        template: this.dateTemplate(),
      },
    ];
  }

  goToTree(id: string) {
    this.router.navigate(['tree', 'edit', id]);
  }

  onLazyLoad(event: TableLazyLoadEvent) {}

  startNewSession(): void {
    this.router.navigate(['session', 'new']);
  }

  search(event: Event) {}
}
