import { Component } from '@angular/core'
import { TableComponent } from '../table/table.component'

@Component({
  imports: [TableComponent],
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomeComponent {}
