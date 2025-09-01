export enum Currency {
  EUR = 'EUR',
  GBP = 'GBP',
  CHF = 'CHF',
  SEK = 'SEK',
  NOK = 'NOK',
  DKK = 'DKK',
  PLN = 'PLN',
  CZK = 'CZK',
  HUF = 'HUF',
  RON = 'RON',
  BGN = 'BGN',
  HRK = 'HRK',
  ARS = 'ARS',
  BRL = 'BRL',
  CLP = 'CLP',
  COP = 'COP',
  PEN = 'PEN',
  UYU = 'UYU',
  PYG = 'PYG',
  BOB = 'BOB',
  VES = 'VES',
  USD = 'USD',
  CAD = 'CAD',
  MXN = 'MXN',
  JPY = 'JPY',
  CNY = 'CNY',
  INR = 'INR',
  KRW = 'KRW',
  SGD = 'SGD',
  HKD = 'HKD',
  MYR = 'MYR',
  IDR = 'IDR',
  THB = 'THB',
  VND = 'VND',
  PKR = 'PKR',
  AUD = 'AUD',
  NZD = 'NZD',
  ZAR = 'ZAR',
  EGP = 'EGP',
  NGN = 'NGN',
  KES = 'KES',
  GHS = 'GHS',
}

// Definición de la interfaz para los detalles del coche
export interface CarDetailsDto {
  registrationDate: string
  mileage: number
  currency: Currency
  price: number
  manufactureYear: number
  availability: boolean
  licensePlate: string
}

// Definición de la interfaz para el coche
export interface Car {
  brand: string
  model: string
  carDetails: CarDetailsDto[]
  id: string
  total: number
}

// Definición de la interfaz para crear un coche
export interface CreateCarDto {
  brand: string
  model: string
  carDetails: CarDetailsDto[]
}

// Definición de la interfaz para el resumen del coche
export interface CarSummary {
  brand: string
  model: string
  id: string
  total: number
}
