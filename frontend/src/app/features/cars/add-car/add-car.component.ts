import { Component, inject, OnInit } from '@angular/core'
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms'
import { Router } from '@angular/router'
import { BrandsService } from '../../../core/services/brands.service'
import { CarsService } from '../../../core/services/cars.service'
import {
  CarDetailsDto,
  CarDetailsDtoForm,
  CreateCarDto,
  Currency,
} from '../../../core/interfaces/car.interface'
import { ButtonDirective } from '../../../core/directives/button.directive'
import { NotificationService } from '../../../core/services/notification.service'
import {
  registrationDateValidator,
  currencyValidator,
  maxDateValidator,
} from '../../../core/validators/car-validators'
import {
  LICENSE_PLATE_REGEX,
  MAX_MANUFACTURE_DATE,
  MIN_MANUFACTURE_DATE,
  MAX_REGISTRATION_DATE,
  MIN_PRICE,
  MIN_MILEAGE,
  MAX_STRING_LENGTH,
} from '../../../core/validators/car-validators'

@Component({
  selector: 'app-add-car',
  imports: [ReactiveFormsModule, ButtonDirective],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css',
})
export class AddCarComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder)
  private brandService = inject(BrandsService)
  private carsService = inject(CarsService)
  private notificationService = inject(NotificationService)
  private router = inject(Router)

  today = MAX_REGISTRATION_DATE
  brands: string[] = []
  models: string[] = []
  carForm = this.formBuilder.group({
    brand: ['', [Validators.required, Validators.maxLength(MAX_STRING_LENGTH)]],
    model: ['', [Validators.required, Validators.maxLength(MAX_STRING_LENGTH)]],
    carDetails: this.formBuilder.array<FormGroup<CarDetailsDtoForm>>(
      [],
      registrationDateValidator()
    ), // Inicializa el FormArray
  })

  currencies = Object.values(Currency)

  ngOnInit(): void {
    this.loadBrands()
    this.addCarDetail()
    //this.carDetails.controls.at(0)?.controls.
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (data) => {
        this.brands = data
      },
      error: (error) => {
        console.error('Error fetching brands:', error)
      },
    })
  }

  onBrandChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    const brandId = target.value // Ahora TypeScript sabe que target tiene una propiedad value
    // Lógica para manejar el cambio de marca
    this.brandService.getModelByBrand(brandId).subscribe({
      next: (data) => {
        this.models = data
        //this.carEditForm.get('model')?.reset()
        this.carForm.get('model')?.setValue('') // Resetea el modelo al cambiar la marca
      },
      error: (error) => {
        console.error('Error fetching models:', error)
      },
    })
  }

  get carDetails() {
    return this.carForm.controls.carDetails
  }

  get brand() {
    return this.carForm.controls.brand
  }

  get model() {
    return this.carForm.controls.model
  }

  addCarDetail(): void {
    const carDetailGroup = this.formBuilder.group<CarDetailsDtoForm>({
      registrationDate: this.formBuilder.control('', {
        validators: [
          Validators.required,
          maxDateValidator(
            MAX_REGISTRATION_DATE.toISOString().substring(0, 10)
          ),
        ],
      }),
      mileage: this.formBuilder.control(0, [
        Validators.required,
        Validators.min(MIN_MILEAGE),
      ]),
      currency: this.formBuilder.control('', [
        Validators.required,
        currencyValidator(),
      ]),
      price: this.formBuilder.control(0, [
        Validators.required,
        Validators.min(MIN_PRICE),
      ]),
      manufactureYear: this.formBuilder.control(new Date().getFullYear(), [
        Validators.required,
        Validators.min(MIN_MANUFACTURE_DATE),
        Validators.max(MAX_MANUFACTURE_DATE),
      ]),
      availability: this.formBuilder.control(false),
      licensePlate: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(LICENSE_PLATE_REGEX),
      ]),
    })

    this.carDetails.push(carDetailGroup)
  }

  removeCarDetail(detailId: number): void {
    if (detailId > 0) {
      if (confirm('¿Eliminar este detalle?')) {
        this.carDetails.removeAt(detailId)
      }
    }
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const carDetailsArray = this.carForm.get('carDetails')
        ?.value as CarDetailsDto[]

      // Formatear la fecha de cada detalle del coche
      const formattedCarDetails = carDetailsArray.map((detail) => ({
        ...detail,
        registrationDate: new Date(detail.registrationDate).toISOString(), // Formato ISO
      }))

      const carData: CreateCarDto = {
        brand: this.carForm.get('brand')?.value || '', // Proporciona un valor predeterminado
        model: this.carForm.get('model')?.value || '',
        carDetails: formattedCarDetails,
      }

      this.saveData(carData)
    } else {
      console.log('Form is invalid')
    }
  }

  saveData(carData: CreateCarDto) {
    this.carsService.createCar(carData).subscribe({
      next: (response) => {
        console.log('Data sent successfully:', response)
        this.notificationService.showSuccess(
          'El coche ha sido creado y guardado con éxito'
        )
        this.router.navigate([''])
      },
      error: (error) => {
        console.error('Error sending data:', error)
        this.notificationService.showError('El coche no se ha podido crear')
      },
    })
  }
}
