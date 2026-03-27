import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormArray,
  FormGroup,
} from '@angular/forms'
import { formatDate } from '@angular/common'
import { Currency } from '../interfaces/car.interface'

const LICENSE_PLATE_REGEX = /^[0-9]{4}\s?[A-Z]{3}$/
const MAX_MANUFACTURE_DATE = new Date().getFullYear()
const MIN_MANUFACTURE_DATE = 1900
const MAX_REGISTRATION_DATE = new Date()
const MIN_PRICE = 1
const MIN_MILEAGE = 0
const MAX_STRING_LENGTH = 50

export {
  LICENSE_PLATE_REGEX,
  MAX_MANUFACTURE_DATE,
  MIN_MANUFACTURE_DATE,
  MAX_REGISTRATION_DATE,
  MIN_PRICE,
  MIN_MILEAGE,
  MAX_STRING_LENGTH,
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
export function maxDateValidator(maxDate?: string): ValidatorFn {
  // si no se pasa maxDate, usamos "hoy" (hora local, sin tiempo)
  const max = maxDate ? maxDate : new Date().toISOString().substring(0, 10) //today

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
