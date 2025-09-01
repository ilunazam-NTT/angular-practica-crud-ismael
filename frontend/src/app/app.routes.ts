import { Routes } from '@angular/router'
import { HomeComponent } from './home-page/home-page.component'
import { AddCarComponent } from './add-car/add-car.component'
import { CarDetailsComponent } from './car-details/car-details.component'
import { EditCarComponent } from './edit-car/edit-car.component'

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
  {
    path: 'cars/edit/:id',
    component: EditCarComponent,
    data: { title: 'Editar Coche', withComponentInputBinding: true },
  },
]
