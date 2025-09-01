import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component'
import { HeaderComponent } from './header/header.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BreadcrumbsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  providers: [],
  styleUrl: './app.component.css',
})
export class AppComponent {}
