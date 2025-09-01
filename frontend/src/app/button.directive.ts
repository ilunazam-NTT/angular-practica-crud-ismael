import { Directive, Input, Renderer2, ElementRef, inject } from '@angular/core'

@Directive({
  selector: '[appButtonType]',
})
export class ButtonDirective {
  @Input() set appButtonType(type: string) {
    this.setButtonType(type)
  }
  /*
  @Input() set appDisabled(isDisabled: boolean) {
    this.setDisabledStyles(isDisabled);
  }
*/
  private el = inject(ElementRef)
  private renderer = inject(Renderer2)

  constructor() {
    // Estilos predeterminados para todos los botones
    this.renderer.setStyle(this.el.nativeElement, 'padding', '8px 20px')
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px')
    this.renderer.setStyle(this.el.nativeElement, 'text-align', 'center')
    this.renderer.setStyle(this.el.nativeElement, 'text-decoration', 'none')
    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-block')
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '14px')
    this.renderer.setStyle(this.el.nativeElement, 'margin', '10px 2px')
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer')
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'background-color 0.3s, border-color 0.3s'
    )
  }

  private setButtonType(type: string) {
    // Remover clases anteriores
    this.renderer.removeClass(this.el.nativeElement, 'btn-primary')
    this.renderer.removeClass(this.el.nativeElement, 'btn-secondary')
    this.renderer.removeClass(this.el.nativeElement, 'btn-default')

    // Aplicar estilos según el tipo
    switch (type) {
      case 'primary':
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          '#008cba'
        )
        this.renderer.setStyle(
          this.el.nativeElement,
          'border',
          '2px solid #008cba'
        )
        this.renderer.setStyle(this.el.nativeElement, 'color', 'white')
        this.renderer.addClass(this.el.nativeElement, 'btn-primary')
        break
      case 'secondary':
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          'white'
        )
        this.renderer.setStyle(this.el.nativeElement, 'color', '#008cba')
        this.renderer.setStyle(
          this.el.nativeElement,
          'border',
          '2px solid #008cba'
        )
        this.renderer.addClass(this.el.nativeElement, 'btn-secondary')
        break
      default:
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          'lightgrey'
        )
        this.renderer.setStyle(this.el.nativeElement, 'color', 'black')
        this.renderer.setStyle(this.el.nativeElement, 'border', 'none')
        this.renderer.addClass(this.el.nativeElement, 'btn-default')
    }

    // Estilos para hover
    this.renderer.listen(this.el.nativeElement, 'mouseenter', () => {
      if (type === 'primary') {
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          '#007bb5'
        )
      } else if (type === 'secondary') {
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          '#f0f0f0'
        )
      } else {
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          'lightgrey'
        )
      }
    })

    this.renderer.listen(this.el.nativeElement, 'mouseleave', () => {
      if (type === 'primary') {
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          '#008cba'
        )
      } else if (type === 'secondary') {
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          'white'
        )
      } else if (type === 'default') {
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          'grey'
        )
      }
    })

    // Estilos para el estado deshabilitado
    this.renderer.listen(this.el.nativeElement, 'disabled', () => {
      if (type === 'primary') {
        this.renderer.setStyle(
          this.el.nativeElement,
          'background-color',
          '#008cba54'
        )
        this.renderer.setStyle(
          this.el.nativeElement,
          'border-color',
          '#008cba00'
        )
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed')
      } else if (type === 'secondary') {
        this.renderer.setStyle(this.el.nativeElement, 'color', '#008cba54')
        this.renderer.setStyle(
          this.el.nativeElement,
          'border-color',
          '#008cba54'
        )
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed')
      }
    })
  }
  /*
  private setDisabledStyles(isDisabled: boolean) {
    if (isDisabled) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#bebebe54');
      this.renderer.setStyle(this.el.nativeElement, 'border-color', '#bebebe54');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
    } 
  }
    */
}
