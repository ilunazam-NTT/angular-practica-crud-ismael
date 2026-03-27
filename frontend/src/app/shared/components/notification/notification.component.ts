import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  @Input() message = ''
  @Input() type: 'success' | 'error' | 'info' = 'info'

  isVisible = true
  get icon() {
    switch (this.type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'info':
        return 'ℹ'

      default:
        return ''
    }
  }

  close() {
    this.isVisible = false
  }
}
