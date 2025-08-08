import { Component, inject, OnInit } from '@angular/core'
import {
  Validators,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { BrandsService } from '../brands.service'
import { CarsService } from '../cars.service'
import { CarDetailsDto, CreateCarDto, Currency } from '../car.interface'
import { ButtonDirective } from '../button.directive'

@Component({
  selector: 'app-add-car',
  imports: [ReactiveFormsModule, CommonModule, ButtonDirective],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css',
})
export class AddCarComponent implements OnInit {
  brands: string[] = []
  models: string[] = []

  currencies = Object.values(Currency)

  private formBuilder = inject(FormBuilder)
  private brandService = inject(BrandsService)
  private carsService = inject(CarsService)

  carForm = this.formBuilder?.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    carDetails: this.formBuilder?.array([], registrationDateValidator()), // Inicializa el FormArray
  })

  ngOnInit(): void {
    this.loadBrands()
    this.addCarDetail()
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
        this.carForm.get('model')?.reset() // Resetea el modelo al cambiar la marca
      },
      (error) => {
        console.error('Error fetching models:', error)
      }
    )
  }

  get carDetails(): FormArray {
    return this.carForm.get('carDetails') as FormArray
  }

  addCarDetail(): void {
    const carDetailGroup = this.formBuilder?.group({
      registrationDate: ['', Validators.required],
      mileage: [0, [Validators.required, Validators.min(0)]],
      currency: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      manufactureYear: [
        new Date().getFullYear(),
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      availability: [false],
      licensePlate: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{4} [A-Z]{3}$/)],
      ],
    })

    this.carDetails.push(carDetailGroup)
  }

  isFirstDetailValid(): boolean | undefined {
    const firstDetail = this.carDetails.at(0)
    return (
      firstDetail.valid &&
      this.carForm.get('brand')?.valid &&
      this.carForm.get('model')?.valid
    )
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
      console.log('Form Submitted:', carData)
    } else {
      console.log('Form is invalid')
    }
  }

  saveData(carData: CreateCarDto) {
    this.carsService.createCar(carData).subscribe(
      (response) => {
        console.log('Data sent successfully:', response)
      },
      (error) => {
        console.error('Error sending data:', error)
      }
    )
  }
}

export function registrationDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const carDetails = control.get('carDetails') as FormArray

    if (carDetails) {
      const firstDetail = carDetails.at(0) // Obtener el primer detalle
      const manufactureYear = firstDetail.get('manufactureYear')?.value
      const registrationDate = firstDetail.get('registrationDate')?.value

      if (registrationDate && manufactureYear) {
        const regDate = new Date(registrationDate)
        const minYear = new Date(manufactureYear, 0, 1) // Primer día del año de fabricación

        if (regDate < minYear) {
          return { registrationDateInvalid: true } // Devuelve un error si la fecha de registro es anterior al año de fabricación
        }
      }
    }
    return null // Si todo es válido, devuelve null
  }
}
