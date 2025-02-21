import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  imports: [RouterModule, NavBarComponent, SideNavComponent],
  selector: 'lib-ui-feature-base-layout',
  templateUrl: './base-layout.component.html',
})
export class BaseLayoutComponent {
  title = 'frontend';
}
