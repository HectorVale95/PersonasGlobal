import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Persona } from '../../shared/persona.model';
import { PersonasService } from '../../services/personas.service';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
],
  templateUrl: './persona-form.component.html',
  styleUrl: './persona-form.component.css'
})
export class PersonaFormComponent implements OnInit {
  personaForm: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PersonaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Persona | null,
    private personasService: PersonasService,
    private snackBar: MatSnackBar
  ) {
    this.personaForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [
        Validators.required, 
        Validators.pattern(/^\d{10}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.personaForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.personaForm.valid) {
      this.loading = true;
      const formValue = this.personaForm.value;

      if (this.isEditMode && this.data) {
        this.personasService.updatePersona(this.data.id, formValue).subscribe({
          next: () => {
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.showSnackBar('Error al actualizar la persona');
          }
        });
      } else {
        this.personasService.addPersona(formValue).subscribe({
          next: () => {
            this.loading = false;
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.showSnackBar('Error al agregar la persona');
          }
        });
      }
    } else {
      this.markFormGroupTouched();
      this.showSnackBar('Por favor, complete todos los campos requeridos');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.personaForm.controls).forEach(key => {
      const control = this.personaForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.personaForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'telefono') {
        return 'El teléfono debe tener exactamente 10 dígitos';
      }
      return 'Formato inválido';
    }
    return '';
  }
}
