import { Component, inject, OnInit } from '@angular/core'
import { CarsService } from '../cars.service'
import { Car } from '../car.interface'
import { ActivatedRoute } from '@angular/router'
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common'
import { MileageStatusPipe } from '../mileage-status.pipe'
import { ButtonDirective } from '../button.directive'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-car-details',
  imports: [
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
    MileageStatusPipe,
    ButtonDirective,
    CommonModule,
  ],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css',
})
export class CarDetailsComponent implements OnInit {
  //data
  //car: CarDetailsResponse[] = [];
  car: Car | null = null

  carDetailsService = inject(CarsService)
  route = inject(ActivatedRoute)

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    if (id != null) {
      this.loadData(id)
    } else {
      console.log('null ID in URL')
    }
  }
  loadData(id: string) {
    this.carDetailsService.getCarById(id).subscribe(
      (response) => {
        this.car = response
      },
      (error) => {
        console.error('Error fetching data:', error)
      }
    )
  }
}
