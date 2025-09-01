import { Component, inject, Input, OnInit } from '@angular/core'
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
import { CommonModule, formatDate } from '@angular/common'
import { BrandsService } from '../brands.service'
import { CarsService } from '../cars.service'
import {
  Car,
  CarDetailsDto,
  CarDetailsDtoForm,
  CreateCarDto,
  Currency,
} from '../car.interface'
import { ButtonDirective } from '../button.directive'
import { ActivatedRoute } from '@angular/router'
import { NotificationService } from '../notification.service'

const LICENSE_PLATE_REGEX = /^[0-9]{4}\s?[A-Z]{3}$/
const MAX_MANUFACTURE_DATE = new Date().getFullYear()
const MIN_MANUFACTURE_DATE = 1900
const MAX_REGISTRATION_DATE = new Date()
const MIN_PRICE = 1
const MIN_MILEAGE = 0
const MAX_STRING_LENGTH = 50

@Component({
  selector: 'app-edit-car',
  imports: [ReactiveFormsModule, CommonModule, ButtonDirective],
  templateUrl: './edit-car.component.html',
  styleUrl: './edit-car.component.css',
})
export class EditCarComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder)
  private brandService = inject(BrandsService)
  private carsService = inject(CarsService)
  private route = inject(ActivatedRoute)
  private notificationService = inject(NotificationService)

  today = MAX_REGISTRATION_DATE
  brands: string[] = []
  models: string[] = []
  carId: string | null = null
  car: Car | null = null

  carEditForm = this.formBuilder.group({
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
    //this.addCarDetail()

    this.carId = this.route.snapshot.paramMap.get('id')!
    this.loadData(this.carId)
  }

  loadData(id: string) {
    this.carsService.getCarById(id).subscribe(
      (response) => {
        this.car = response

        this.carEditForm.patchValue({
          brand: this.car.brand,
          //model: this.car.model,

          carDetails: [],
        })
        this.loadModelsAndSetModel(this.car.brand, this.car.model)

        // Luego, limpia el FormArray y añade los grupos
        const carDetailsArray = this.carEditForm.get('carDetails') as FormArray
        carDetailsArray.clear() // Limpia cualquier grupo anterior

        this.car.carDetails.forEach((detail) => {
          carDetailsArray.push(this.createCarDetailGroup(detail))
        })
      },
      (error) => {
        console.error('Error fetching data:', error)
      }
    )
  }

  loadModelsAndSetModel(brand: string, model: string) {
    this.brandService.getModelByBrand(brand).subscribe(
      (models) => {
        this.models = models
        // Solo setea el modelo si está en la lista de modelos cargados
        if (models.includes(model)) {
          this.carEditForm.get('model')?.setValue(model)
        } else {
          this.carEditForm.get('model')?.reset()
        }
      },
      (error) => {
        console.error('Error fetching models:', error)
        this.models = []
        this.carEditForm.get('model')?.reset()
      }
    )
  }

  createCarDetailGroup(detail: CarDetailsDto): FormGroup {
    return this.formBuilder.group<CarDetailsDtoForm>({
      registrationDate: this.formBuilder.control(
        detail.registrationDate.substring(0, 10),
        { validators: [Validators.required, maxDateValidator()] }
      ),
      mileage: this.formBuilder.control(detail.mileage, [
        Validators.required,
        Validators.min(MIN_MILEAGE),
      ]),
      currency: this.formBuilder.control(detail.currency, [
        Validators.required,
        currencyValidator(),
      ]),
      price: this.formBuilder.control(detail.price, [
        Validators.required,
        Validators.min(MIN_PRICE),
      ]),
      manufactureYear: this.formBuilder.control(detail.manufactureYear, [
        Validators.required,
        Validators.min(MIN_MANUFACTURE_DATE),
        Validators.max(MAX_MANUFACTURE_DATE),
      ]),
      availability: this.formBuilder.control(detail.availability),
      licensePlate: this.formBuilder.control(detail.licensePlate, [
        Validators.required,
        Validators.pattern(LICENSE_PLATE_REGEX),
      ]),
    })
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe(
      (data) => {
        this.brands = data
      },
      (error) => {
        console.error('Error fetching brands:', error)
      }
    )
  }

  onBrandChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    const brandId = target.value // Ahora TypeScript sabe que target tiene una propiedad value
    // Lógica para manejar el cambio de marca
    this.brandService.getModelByBrand(brandId).subscribe(
      (data) => {
        this.models = data
        //this.carEditForm.get('model')?.reset()
        this.carEditForm.get('model')?.setValue('') // Resetea el modelo al cambiar la marca
      },
      (error) => {
        console.error('Error fetching models:', error)
      }
    )
  }

  get carDetails() {
    return this.carEditForm.controls.carDetails //get('carDetails') as FormArray
  }

  get brand() {
    return this.carEditForm.controls.brand
  }

  get model() {
    return this.carEditForm.controls.model
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
    if (this.carEditForm.valid) {
      const carDetailsArray = this.carEditForm.get('carDetails')
        ?.value as CarDetailsDto[]

      // Formatear la fecha de cada detalle del coche
      const formattedCarDetails = carDetailsArray.map((detail) => ({
        ...detail,
        registrationDate: new Date(detail.registrationDate).toISOString(), // Formato ISO
      }))

      const carData: CreateCarDto = {
        brand: this.carEditForm.get('brand')?.value || '', // Proporciona un valor predeterminado
        model: this.carEditForm.get('model')?.value || '',
        carDetails: formattedCarDetails,
      }

      this.saveData(carData)
    } else {
      console.log('Form is invalid')
    }
  }

  saveData(carData: CreateCarDto) {
    this.carsService.updateCar(this.carId!, carData).subscribe(
      (response) => {
        console.log('Data sent successfully:', response)
        this.notificationService.showSuccess(
          'El coche ha sido editado y guardado con éxito'
        )
      },
      (error) => {
        console.error('Error sending data:', error)
        this.notificationService.showError('El coche no se ha podido editar')
      }
    )
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

    console.log(raw)
    console.log(max)
    // comparar fechas (solo año/mes/día)
    if (raw > max) {
      const maxFormatted = formatDate(max, 'dd/MM/yyyy', 'es-ES')
      return { maxDateExceeded: { value: raw, max: maxFormatted } }
    }

    return null
  }
}
