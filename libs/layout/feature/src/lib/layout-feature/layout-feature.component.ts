import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent, SideNavComponent } from '@closing/shared/ui-feature';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-layout-feature',
  imports: [CommonModule, RouterModule, NavBarComponent, SideNavComponent],
  templateUrl: './layout-feature.component.html',
  styleUrl: './layout-feature.component.css',
})
export class LayoutFeatureComponent {}
