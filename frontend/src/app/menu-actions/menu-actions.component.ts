import { Component } from '@angular/core'
import { ButtonDirective } from '../button.directive'
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu'

@Component({
  selector: 'app-menu-actions',
  imports: [ButtonDirective, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './menu-actions.component.html',
  styleUrl: './menu-actions.component.css',
})
export class MenuActionsComponent {
  editar() {}
  eliminar() {}
}
