import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenarioStore, Scenario } from '@closing/scenario/data-access';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { Signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { viewChild } from '@angular/core';
import { Column } from '@closing/shared/interfaces';

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
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './scenario-list.component.html',
  providers: [ScenarioStore],
  host: {
    class: 'w-full',
  },
})
export class ScenarioListComponent implements AfterViewInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  readonly #store = inject(ScenarioStore);

  protected scenarios: Signal<Scenario[]> = this.#store.scenariosEntities;
  protected loading: Signal<boolean> = this.#store.loading;
  protected total: Signal<number> = this.#store.total;

  protected form = this.formBuilder.group({
    search: ['', Validators.required],
  });

  private treeTemplate = viewChild<TemplateRef<unknown>>('treeTemplate');
  private dateTemplate = viewChild<TemplateRef<unknown>>('dateTemplate');
  private avatarTemplate = viewChild<TemplateRef<unknown>>('avatarTemplate');
  private statusTemplate = viewChild<TemplateRef<unknown>>('statusTemplate');
  private defaultTemplate = viewChild<TemplateRef<unknown>>('defaultTemplate');
  private diagramTemplate = viewChild<TemplateRef<unknown>>('diagramTemplate');

  protected columns: Column[] = [];

  ngAfterViewInit(): void {
    this.columns = [
      {
        field: 'user',
        header: 'User',
        sortable: true,
        filterable: true,
        template: this.avatarTemplate(),
      },
      {
        field: 'treeName',
        header: 'Tree',
        template: this.treeTemplate(),
        sortable: true,
        filterable: true,
      },
      {
        field: 'customer',
        header: 'Customer',
        sortable: true,
        filterable: true,
      },
      {
        field: 'status',
        header: 'Status',
        template: this.statusTemplate(),
        sortable: true,
        filterable: true,
      },
      {
        field: 'createdAt',
        header: 'Created At',
        template: this.dateTemplate(),
        sortable: true,
        filterable: true,
      },
      {
        field: 'diagramName',
        header: 'Diagram',
        template: this.diagramTemplate(),
      },
    ];
  }

  startNewScenario() {
    this.router.navigate(['/scenarios/create']);
  }

  goToDiagram(diagramId: string) {
    this.router.navigate(['/diagrams', diagramId]);
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

    this.#store.getScenarios({
      page,
      size,
      sorts,
      filters: JSON.stringify(event.filters ?? {}),
    });
  }
}
