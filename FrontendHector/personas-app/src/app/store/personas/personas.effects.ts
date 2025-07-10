import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { PersonasService } from '../../services/personas.service';
import * as PersonasActions from './personas.actions';

@Injectable()
export class PersonasEffects {
  private actions$ = inject(Actions);
  private personasService = inject(PersonasService);

  loadPersonas$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PersonasActions.loadPersonas),
      mergeMap(({ searchTerm, page, pageSize }) => {
        return this.personasService.getPersonas(searchTerm, page, pageSize).pipe(
          map((response: any) => {
            return PersonasActions.loadPersonasSuccess({ 
              personas: response.data || [], 
              total: response.total || 0 
            });
          }),
          catchError((error) => {
            return of(PersonasActions.loadPersonasFailure({ error }));
          })
        );
      })
    );
  });

  createPersona$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PersonasActions.createPersona),
      mergeMap(({ persona }) => 
        this.personasService.addPersona(persona).pipe(
          map((response: any) => PersonasActions.createPersonaSuccess({ persona: response })),
          catchError((error) => of(PersonasActions.createPersonaFailure({ error })))
        )
      )
    );
  });

  updatePersona$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PersonasActions.updatePersona),
      mergeMap(({ persona }) => 
        this.personasService.updatePersona(persona.id, persona).pipe(
          map((response: any) => PersonasActions.updatePersonaSuccess({ persona: response })),
          catchError((error) => of(PersonasActions.updatePersonaFailure({ error })))
        )
      )
    );
  });

  deletePersona$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PersonasActions.deletePersona),
      mergeMap(({ id }) => 
        this.personasService.deletePersona(id).pipe(
          map(() => PersonasActions.deletePersonaSuccess({ id })),
          catchError((error) => of(PersonasActions.deletePersonaFailure({ error })))
        )
      )
    );
  });
} 