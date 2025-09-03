import { inject, Injectable } from '@angular/core'
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { NotificationComponent } from '../../shared/components/notification/notification.component'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private overlayRef?: OverlayRef

  private overlay = inject(Overlay)
  //constructor(private overlay: Overlay) {}

  private show(
    message: string,
    type: 'success' | 'error' | 'info',
    duration = 10000
  ) {
    // Si ya hay una notificación abierta, la cerramos
    if (this.overlayRef) {
      this.overlayRef.dispose()
    }

    // Configuración del overlay
    const positionStrategy = this.overlay
      .position()
      .global()
      .top('80px') // adjust this to be below your header height
      .centerHorizontally()

    const overlayConfig = new OverlayConfig({
      hasBackdrop: false,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    })

    this.overlayRef = this.overlay.create(overlayConfig)

    // Crear el portal del componente NotificationComponent
    const notificationPortal = new ComponentPortal(NotificationComponent)

    // Adjuntar el portal al overlay
    const componentRef = this.overlayRef.attach(notificationPortal)

    // Pasar inputs al componente
    componentRef.instance.message = message
    componentRef.instance.type = type

    // Auto cerrar después de duration ms
    setTimeout(() => {
      this.overlayRef?.dispose()
      this.overlayRef = undefined
    }, duration)
  }

  showSuccess(message: string, duration?: number) {
    this.show(message, 'success', duration)
  }

  showError(message: string, duration?: number) {
    this.show(message, 'error', duration)
  }

  showInfo(message: string, duration?: number) {
    this.show(message, 'info', duration)
  }
}
