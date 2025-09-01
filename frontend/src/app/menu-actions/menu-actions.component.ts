import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { ButtonDirective } from '../button.directive'
import { CdkMenuModule } from '@angular/cdk/menu'
import { Router } from '@angular/router'
import { CarsService } from '../cars.service'
import { ModalComponent } from '../modal/modal.component'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-menu-actions',
  imports: [ButtonDirective, CdkMenuModule, ModalComponent],
  templateUrl: './menu-actions.component.html',
  styleUrl: './menu-actions.component.css',
})
export class MenuActionsComponent {
  @Input() carId!: string
  @Input() carBrand!: string
  @Input() carModel!: string

  @Output() carDeleted = new EventEmitter<string>() //event to reload table

  private router = inject(Router)
  private carsService = inject(CarsService)
  private notificationService = inject(NotificationService)

  editCar(carId: string) {
    // Lógica para editar el coche
    if (carId) {
      //Ir a edit-car
      this.router.navigate(['/cars/edit', carId])

      console.log(`Editing car with ID: ${carId}`)
    } else {
      console.error('Car ID is undefined or invalid')
    }
  }

  deleteCar(carId: string | undefined) {
    if (!carId) {
      alert('ID no válido')
      return
    }
    // Lógica para eliminar el coche
    console.log(`Deleting car with ID: ${carId}`)

    this.carsService.deleteCar(carId).subscribe(
      (response) => {
        console.log('Data deleted successfully:', response)
        this.notificationService.showSuccess(
          `El coche ${this.carBrand} -- ${this.carModel} ha sido eliminado con éxito`
        )
        //window.location.reload();
        this.carDeleted.emit(carId) //send event to load table when car is deleted
      },
      (error) => {
        console.error('Error deleting data:', error)
        this.notificationService.showError('El coche no se ha podido eliminar')
      }
    )
  }
}
