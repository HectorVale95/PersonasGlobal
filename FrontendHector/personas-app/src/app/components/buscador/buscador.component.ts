import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit, OnDestroy {
  @Output() buscar = new EventEmitter<string>();
  @Output() limpiar = new EventEmitter<void>();

  searchControl = new FormControl('', [
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  ]);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(termino => {
      if (this.searchControl.valid && termino.trim()) {
        this.buscar.emit(termino.trim());
      } else if (!termino.trim()) {
        this.limpiar.emit();
      }
    });

    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.searchSubject.next(value || '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBuscar(): void {
    const value = this.searchControl.value;
    if (this.searchControl.valid && value?.trim()) {
      this.buscar.emit(value.trim());
    }
  }

  onLimpiar(): void {
    this.searchControl.setValue('');
    this.limpiar.emit();
  }

  getErrorMessage(): string {
    if (this.searchControl.hasError('required')) {
      return 'El término de búsqueda es obligatorio';
    }
    if (this.searchControl.hasError('minlength')) {
      return 'Debe ingresar al menos 2 caracteres';
    }
    if (this.searchControl.hasError('maxlength')) {
      return 'No puede exceder 50 caracteres';
    }
    if (this.searchControl.hasError('pattern')) {
      return 'Solo se permiten letras y espacios';
    }
    return '';
  }

  get isSearchValid(): boolean {
    return this.searchControl.valid && !!this.searchControl.value?.trim();
  }
} 