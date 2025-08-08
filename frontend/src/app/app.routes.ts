import { Routes } from '@angular/router'
import { HomeComponent } from './home-page/home-page.component'
import { AddCarComponent } from './add-car/add-car.component'
import { CarDetailsComponent } from './car-details/car-details.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'cars/create',
    component: AddCarComponent,
    data: { title: 'Crear Coche' },
  },
  {
    path: 'cars/:id',
    component: CarDetailsComponent,
    data: { title: 'Detalles Coche' },
  },
]
