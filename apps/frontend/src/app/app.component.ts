import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  imports: [RouterModule, ToastModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'frontend';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    // if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    //   this.document.querySelector('html')?.classList.remove('dark-theme'); // dark-theme class
    // } else {
    //   this.document.querySelector('html')?.classList.add('dark-theme'); // dark-theme class
    // }
  }
}
