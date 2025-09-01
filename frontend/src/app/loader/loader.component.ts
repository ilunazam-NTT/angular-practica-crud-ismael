import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs'
import { LoaderService } from '../loader.service'

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent implements OnInit, OnDestroy {
  visible = false
  private subscription?: Subscription

  private loaderService = inject(LoaderService)

  ngOnInit() {
    this.subscription = this.loaderService.loading$.subscribe(
      (isLoading) => (this.visible = isLoading)
    )
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
