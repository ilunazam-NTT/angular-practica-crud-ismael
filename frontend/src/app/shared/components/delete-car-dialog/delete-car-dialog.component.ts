import { Component, inject } from '@angular/core'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog'
import { ButtonDirective } from '../../../core/directives/button.directive'

export interface DialogData {
  itemName: string
  carId: string
}

@Component({
  selector: 'app-delete-car-dialog',
  imports: [ButtonDirective],
  templateUrl: './delete-car-dialog.component.html',
  styleUrl: './delete-car-dialog.component.css',
})
export class DeleteCarDialogComponent {
  dialogRef = inject(DialogRef<boolean>)
  data = inject<DialogData>(DIALOG_DATA)

  onConfirm() {
    this.dialogRef.close(true)
  }

  onCancel() {
    this.dialogRef.close(false)
  }
}
