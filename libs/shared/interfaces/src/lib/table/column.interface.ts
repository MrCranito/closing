import { TemplateRef } from '@angular/core';

export interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  template?: TemplateRef<any>;
  subField?: string;
}
