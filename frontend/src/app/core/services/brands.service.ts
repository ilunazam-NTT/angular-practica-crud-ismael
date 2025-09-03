import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private apiUrl = environment.apiUrl // Replace with your backend API URL

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
