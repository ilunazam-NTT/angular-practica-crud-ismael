import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Car, CarSummary, CreateCarDto } from './car.interface'
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  private http = inject(HttpClient)
  
  private apiUrl = environment.apiUrl

  // Get all cars
  getCars(): Observable<CarSummary[]> {
    return this.http.get<CarSummary[]>(`${this.apiUrl}/cars`)
  }

  // Get a car by ID
  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/cars/${id}`)
  }

  // Create a new car
  createCar(car: CreateCarDto): Observable<CreateCarDto> {
    return this.http.post<CreateCarDto>(`${this.apiUrl}/cars`, car)
  }

  // Update a car by ID
  updateCar(id: string, car: CreateCarDto): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/cars/${id}`, car)
  }

  // Delete a car by ID
  deleteCar(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/cars/${id}`)
  }
}
