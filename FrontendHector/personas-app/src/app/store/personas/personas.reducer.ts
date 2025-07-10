import { createReducer, on } from '@ngrx/store';
import { Persona } from '../../shared/persona.model';
import * as PersonasActions from './personas.actions';

export interface PersonasState {
  personas: Persona[];
  loading: boolean;
  error: any;
  total: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
}

export const initialState: PersonasState = {
  personas: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  searchTerm: ''
};

export const personasReducer = createReducer(
  initialState,
  
  on(PersonasActions.loadPersonas, (state, { searchTerm, page, pageSize }) => ({
    ...state,
    loading: true,
    error: null,
    searchTerm: searchTerm || '',
    currentPage: page,
    pageSize
  })),
  
  on(PersonasActions.loadPersonasSuccess, (state, { personas, total }) => ({
    ...state,
    personas,
    total,
    loading: false,
    error: null
  })),
  
  on(PersonasActions.loadPersonasFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(PersonasActions.createPersona, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(PersonasActions.createPersonaSuccess, (state, { persona }) => ({
    ...state,
    personas: [...state.personas, persona],
    loading: false,
    error: null
  })),
  
  on(PersonasActions.createPersonaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(PersonasActions.updatePersona, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(PersonasActions.updatePersonaSuccess, (state, { persona }) => ({
    ...state,
    personas: state.personas.map(p => p.id === persona.id ? persona : p),
    loading: false,
    error: null
  })),
  
  on(PersonasActions.updatePersonaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(PersonasActions.deletePersona, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(PersonasActions.deletePersonaSuccess, (state, { id }) => ({
    ...state,
    personas: state.personas.filter(p => p.id !== id),
    total: state.total - 1,
    loading: false,
    error: null
  })),
  
  on(PersonasActions.deletePersonaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(PersonasActions.clearPersonas, () => initialState)
); 