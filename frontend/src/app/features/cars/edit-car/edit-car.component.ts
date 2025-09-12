import { Component, inject, OnInit } from '@angular/core'
import {
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { BrandsService } from '../../../core/services/brands.service'
import { CarsService } from '../../../core/services/cars.service'
import {
  Car,
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
  selector: 'app-edit-car',
  imports: [ReactiveFormsModule, ButtonDirective],
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
    this.carsService.getCarById(id).subscribe({
      next: (response) => {
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
      error: (error) => {
        console.error('Error fetching data:', error)
      },
    })
  }

  loadModelsAndSetModel(brand: string, model: string) {
    this.brandService.getModelByBrand(brand).subscribe({
      next: (models) => {
        this.models = models
        // Solo setea el modelo si está en la lista de modelos cargados
        if (models.includes(model)) {
          this.carEditForm.get('model')?.setValue(model)
        } else {
          this.carEditForm.get('model')?.reset()
        }
      },
      error: (error) => {
        console.error('Error fetching models:', error)
        this.models = []
        this.carEditForm.get('model')?.reset()
      },
    })
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
        this.carEditForm.get('model')?.setValue('') // Resetea el modelo al cambiar la marca
      },
      error: (error) => {
        console.error('Error fetching models:', error)
      },
    })
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
    this.carsService.updateCar(this.carId!, carData).subscribe({
      next: (response) => {
        console.log('Data sent successfully:', response)
        this.notificationService.showSuccess(
          'El coche ha sido editado y guardado con éxito'
        )
      },
      error: (error) => {
        console.error('Error sending data:', error)
        this.notificationService.showError('El coche no se ha podido editar')
      },
    })
  }
}
