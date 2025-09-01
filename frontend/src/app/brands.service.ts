import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private apiUrl = 'http://localhost:3000' // Replace with your backend API URL

  private http = inject(HttpClient)
  // Get all brands
  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`)
  }

  // Get models by brand ID
  getModelByBrand(brandId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands/${brandId}/models`)
  }
}
