import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Persona } from '../../shared/persona.model';
import { PersonasService } from '../../services/personas.service';
import { PersonaFormComponent } from '../persona-form/persona-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BuscadorComponent } from '../buscador/buscador.component';
import * as PersonasActions from '../../store/personas/personas.actions';
import * as PersonasSelectors from '../../store/personas/personas.selectors';

@Component({
  selector: 'app-personas-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    BuscadorComponent
],
  templateUrl: './tabla-personas.component.html',
  styleUrl: './tabla-personas.component.css'
})
export class PersonasTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  personas$: Observable<Persona[]>;
  loading$: Observable<boolean>;
  total$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  searchTerm$: Observable<string>;

  pageIndex = 0;
  pageSize = 10;
  searchTerm = '';
  displayedColumns: string[] = ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'direccion', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<Persona>([]);
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.personas$ = this.store.select(PersonasSelectors.selectPersonas);
    this.loading$ = this.store.select(PersonasSelectors.selectPersonasLoading);
    this.total$ = this.store.select(PersonasSelectors.selectPersonasTotal);
    this.currentPage$ = this.store.select(PersonasSelectors.selectPersonasCurrentPage);
    this.pageSize$ = this.store.select(PersonasSelectors.selectPersonasPageSize);
    this.searchTerm$ = this.store.select(PersonasSelectors.selectPersonasSearchTerm);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.personas$.subscribe(personas => {
      this.dataSource.data = personas || [];
    });
    
    this.loadPersonas();
    
    this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        this.pageIndex = 0;
        this.loadPersonas();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPersonas(): void {
    const page = this.pageIndex + 1;
    const pageSize = this.pageSize;
    this.store.dispatch(PersonasActions.loadPersonas({ 
      searchTerm: this.searchTerm, 
      page, 
      pageSize 
    }));
  }

  onBuscar(termino: string): void {
    this.searchTerm = termino;
    this.searchSubject$.next(termino);
  }

  onLimpiarBusqueda(): void {
    this.searchTerm = '';
    this.searchSubject$.next('');
  }

  onSearchChange(): void {
    this.searchSubject$.next(this.searchTerm);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPersonas();
  }

  openPersonaForm(persona?: Persona): void {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '500px',
      data: persona
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.showSnackBar('Operación completada exitosamente');
        this.loadPersonas();
      }
    });
  }

  deletePersona(persona: Persona): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar a ${persona.nombres} ${persona.apellidoPaterno}?`
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.store.dispatch(PersonasActions.deletePersona({ id: persona.id }));
        this.showSnackBar('Persona eliminada exitosamente');
      }
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
