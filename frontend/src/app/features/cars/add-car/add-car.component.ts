import { Component, inject, OnInit } from '@angular/core'
import {
  Validators,
  FormArray,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms'
import { formatDate } from '@angular/common'
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

const LICENSE_PLATE_REGEX = /^[0-9]{4}\s?[A-Z]{3}$/
const MAX_MANUFACTURE_DATE = new Date().getFullYear()
const MIN_MANUFACTURE_DATE = 1900
const MAX_REGISTRATION_DATE = new Date()
const MIN_PRICE = 1
const MIN_MILEAGE = 0
const MAX_STRING_LENGTH = 50

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
        validators: [Validators.required, maxDateValidator()],
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

export function registrationDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const carDetails = control as FormArray

    if (!carDetails || carDetails.length === 0) {
      return null
    }

    for (let i = 0; i < carDetails.length; i++) {
      const detail = carDetails.at(i) as FormGroup
      const manufactureYear = detail.get('manufactureYear')?.value
      const registrationDate = detail.get('registrationDate')?.value

      if (registrationDate && manufactureYear) {
        const regDate = new Date(registrationDate)
        const minYear = new Date(manufactureYear, 0, 1)

        if (regDate < minYear) {
          return { registrationDateInvalid: true }
        }
      }
    }

    return null
  }
}

export function currencyValidator(allowed?: string[]): ValidatorFn {
  const allowedValues = allowed ?? Object.values(Currency)
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
    if (value === null || value === undefined || value === '') {
      return null // deja que Validators.required gestione el campo vacío
    }

    return allowedValues.includes(value)
      ? null
      : { invalidCurrency: { value: control.value, allowed: allowedValues } }
  }
}
export function maxDateValidator(maxDate?: Date): ValidatorFn {
  // si no se pasa maxDate, usamos "hoy" (hora local, sin tiempo)
  const max = maxDate
    ? maxDate
    : MAX_REGISTRATION_DATE.toISOString().substring(0, 10)

  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value

    // permitir que Validators.required gestione valores vacíos
    if (raw === null || raw === undefined || raw === '') {
      return null
    }

    //console.log("raw", raw)
    //console.log("max", max)
    // comparar fechas (solo año/mes/día)
    if (raw > max) {
      const maxFormatted = formatDate(max, 'dd/MM/yyyy', 'es-ES')
      return { maxDateExceeded: { value: raw, max: maxFormatted } }
    }

    return null
  }
}
