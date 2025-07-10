import { Component } from '@angular/core';
import { PersonasTableComponent } from './components/tabla-personas/tabla-personas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PersonasTableComponent],
  templateUrl: './app.html',
})
export class AppComponent {
  protected title = 'personas-app';
}
