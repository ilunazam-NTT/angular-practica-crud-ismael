import { Component, inject, OnInit } from '@angular/core'
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router'
import { CommonModule } from '@angular/common'
import { filter } from 'rxjs'

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs: { label: string; url: string }[] = []

  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root)
      })
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: { label: string; url: string }[] = []
  ): { label: string; url: string }[] {
    const children: ActivatedRoute[] = route.children
    //console.log('Current URL:', url)
    //console.log('Breadcrumbs:', breadcrumbs)
    //console.log('Children:', children)

    // Always add the Home breadcrumb if we are at the root level
    if (url === '') {
      breadcrumbs.push({ label: 'Home', url: '/' })
      //return breadcrumbs;
    }

    if (children.length === 0) {
      return breadcrumbs
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/')
      const routeTitle: string = child.snapshot.data['title'] || routeURL

      if (routeURL !== '') {
        url += `/${routeURL}`
        breadcrumbs.push({ label: routeTitle, url })
      }

      // Recursively process child routes
      this.createBreadcrumbs(child, url, breadcrumbs)
    }

    return breadcrumbs // Return the breadcrumbs after processing all children
  }
}
