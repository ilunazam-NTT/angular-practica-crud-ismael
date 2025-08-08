import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'mileageStatus',
})
export class MileageStatusPipe implements PipeTransform {
  transform(mileage: number): string {
    let mileageStatus = ''
    if (mileage == 0) {
      mileageStatus = 'Nuevo'
    } else if (mileage < 100) {
      mileageStatus = 'Km 0'
    } else {
      mileageStatus = 'Ocasión'
    }
    return mileageStatus
  }
}
