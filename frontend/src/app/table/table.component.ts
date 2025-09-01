import { Component, OnInit, inject } from '@angular/core'
import { MenuActionsComponent } from '../menu-actions/menu-actions.component'
import { ButtonDirective } from '../button.directive'
import { RouterLink } from '@angular/router'
import { CarsService } from '../cars.service'
import { CarSummary } from '../car.interface'

@Component({
  selector: 'app-table',
  imports: [MenuActionsComponent, ButtonDirective, RouterLink],
  providers: [CarsService],
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  //data
  cars: CarSummary[] = []

  carsService = inject(CarsService)

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.carsService.getCars().subscribe(
      (response) => {
        this.cars = response
      },
      (error) => {
        console.error('Error fetching data:', error)
      }
    )
  }
}
