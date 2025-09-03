import { Component, EventEmitter, Input, Output } from '@angular/core'

import { ButtonDirective } from '../../../core/directives/button.directive'

@Component({
  selector: 'app-modal',
  imports: [ButtonDirective],
  templateUrl: './modal.component.html',
  providers: [],
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() itemName = ''
  @Input() carId!: string
  @Output() confirmDelete = new EventEmitter<string>()

  isModalOpen = false

  closeModal() {
    this.isModalOpen = false
  }
  openModal() {
    this.isModalOpen = true
  }
  onConfirm() {
    this.confirmDelete.emit(this.carId)
    this.closeModal()
  }
}
