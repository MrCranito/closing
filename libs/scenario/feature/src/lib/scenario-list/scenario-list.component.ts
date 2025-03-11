import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioStore, Scenario } from '@closing/scenario/data-access';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-scenario-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    AvatarModule,
  ],
  templateUrl: './scenario-list.component.html',
  providers: [ScenarioStore],
})
export class ScenarioListComponent {
  private router = inject(Router);
  store = inject(ScenarioStore);

  scenarios = this.store.scenariosEntities;
  loading: Signal<boolean> = this.store.loading;

  @ViewChild('treeTemplate') treeTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<any>;
  @ViewChild('avatarTemplate') avatarTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('defaultTemplate') defaultTemplate!: TemplateRef<any>;

  columns = [
    {
      field: 'user',
      header: 'User',
      subField: 'firstname',
      template: 'avatar',
    },
    {
      field: 'treeName',
      header: 'Tree',
      template: 'tree',
    },
    {
      field: 'customer',
      header: 'Customer',
      subField: 'name',
    },
    {
      field: 'status',
      header: 'Status',
      template: 'status',
    },
    {
      field: 'createdAt',
      header: 'Created At',
      template: 'date',
    },
  ];

  getTemplate(templateName: string): TemplateRef<any> {
    switch (templateName) {
      case 'tree':
        return this.treeTemplate;
      case 'date':
        return this.dateTemplate;
      case 'avatar':
        return this.avatarTemplate;
      case 'status':
        return this.statusTemplate;
      default:
        return this.defaultTemplate;
    }
  }

  startNewScenario() {
    this.router.navigate(['/scenarios/create']);
  }

  goToTree(treeId: string) {
    this.router.navigate(['/trees', treeId]);
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = Math.floor(first / rows) + 1;
    const size = rows;

    let sorts = '';
    if (event.sortField) {
      sorts = `${event.sortField}:${event.sortOrder === 1 ? 'ASC' : 'DESC'}`;
    }

    this.store.getScenarios({
      page,
      size,
      sorts,
      filters: JSON.stringify(event.filters ?? {}),
    });
  }
}
