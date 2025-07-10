import { createAction, props } from '@ngrx/store';
import { Persona } from '../../shared/persona.model';

export const loadPersonas = createAction(
  '[Personas] Load Personas',
  props<{ searchTerm?: string; page: number; pageSize: number }>()
);

export const loadPersonasSuccess = createAction(
  '[Personas] Load Personas Success',
  props<{ personas: Persona[]; total: number }>()
);

export const loadPersonasFailure = createAction(
  '[Personas] Load Personas Failure',
  props<{ error: any }>()
);

export const createPersona = createAction(
  '[Personas] Create Persona',
  props<{ persona: Omit<Persona, 'id'> }>()
);

export const createPersonaSuccess = createAction(
  '[Personas] Create Persona Success',
  props<{ persona: Persona }>()
);

export const createPersonaFailure = createAction(
  '[Personas] Create Persona Failure',
  props<{ error: any }>()
);

export const updatePersona = createAction(
  '[Personas] Update Persona',
  props<{ persona: Persona }>()
);

export const updatePersonaSuccess = createAction(
  '[Personas] Update Persona Success',
  props<{ persona: Persona }>()
);

export const updatePersonaFailure = createAction(
  '[Personas] Update Persona Failure',
  props<{ error: any }>()
);

export const deletePersona = createAction(
  '[Personas] Delete Persona',
  props<{ id: number }>()
);

export const deletePersonaSuccess = createAction(
  '[Personas] Delete Persona Success',
  props<{ id: number }>()
);

export const deletePersonaFailure = createAction(
  '[Personas] Delete Persona Failure',
  props<{ error: any }>()
);

export const clearPersonas = createAction('[Personas] Clear Personas'); 