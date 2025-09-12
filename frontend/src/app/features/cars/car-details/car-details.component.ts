import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common'
import { CarsService } from '../../../core/services/cars.service'
import { Car } from '../../../core/interfaces/car.interface'
import { MileageStatusPipe } from '../../../core/pipes/mileage-status.pipe'
import { ButtonDirective } from '../../../core/directives/button.directive'
import { NotificationService } from '../../../core/services/notification.service'
import { Dialog } from '@angular/cdk/dialog'
import { DeleteCarDialogComponent } from '../../../shared/components/delete-car-dialog/delete-car-dialog.component'

@Component({
  selector: 'app-car-details',
  imports: [
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
    MileageStatusPipe,
    ButtonDirective,
    RouterLink,
  ],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css',
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null

  dialog = inject(Dialog)
  carsService = inject(CarsService)
  route = inject(ActivatedRoute)
  router = inject(Router)
  notificationService = inject(NotificationService)

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    if (id != null) {
      this.loadData(id)
    } else {
      console.log('null ID in URL')
    }
  }
  loadData(id: string) {
    this.carsService.getCarById(id).subscribe({
      next: (response) => {
        this.car = response
      },
      error: (error) => {
        console.error('Error fetching data:', error)
      },
    })
  }

  openDeleteDialog(itemName: string, carId: string) {
    const dialogRef = this.dialog.open(DeleteCarDialogComponent, {
      data: { itemName, carId },
    })

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.deleteCar(carId)
      }
    })
  }

  deleteCar(carId: string | undefined) {
    if (!carId) {
      alert('ID no válido')
      return
    }
    // Lógica para eliminar el coche
    //console.log(`Deleting car with ID: ${carId}`);

    this.carsService.deleteCar(carId).subscribe({
      next: (response) => {
        console.log('Data deleted successfully:', response)
        this.notificationService.showSuccess(
          `El coche ${this.car?.brand} -- ${this.car?.model} ha sido eliminado con éxito`
        )
        this.router.navigate([''])
      },
      error: (error) => {
        console.error('Error deleting data:', error)
        this.notificationService.showError('El coche no se ha podido eliminar')
      },
    })
  }
}
