import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component'
import { HeaderComponent } from './layout/header/header.component'
import { LoaderComponent } from './shared/components/loader/loader.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BreadcrumbsComponent,
    HeaderComponent,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  providers: [],
  styleUrl: './app.component.css',
})
export class AppComponent {}
