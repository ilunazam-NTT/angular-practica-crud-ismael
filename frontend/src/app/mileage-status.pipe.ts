import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'mileageStatus',
})
export class MileageStatusPipe implements PipeTransform {
  transform(mileage: number): { label: string; cssClass: string } {
    if (mileage === 0) {
      return { label: 'Nuevo', cssClass: 'low-mileage' }
    } else if (mileage < 100) {
      return { label: 'Km 0', cssClass: 'medium-mileage' }
    } else {
      return { label: 'Ocasión', cssClass: 'high-mileage' }
    }
  }
}
