import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PersonasState } from './personas.reducer';

export const selectPersonasState = createFeatureSelector<PersonasState>('personas');

export const selectPersonas = createSelector(
  selectPersonasState,
  (state) => state.personas
);

export const selectPersonasLoading = createSelector(
  selectPersonasState,
  (state) => state.loading
);

export const selectPersonasError = createSelector(
  selectPersonasState,
  (state) => state.error
);

export const selectPersonasTotal = createSelector(
  selectPersonasState,
  (state) => state.total
);

export const selectPersonasCurrentPage = createSelector(
  selectPersonasState,
  (state) => state.currentPage
);

export const selectPersonasPageSize = createSelector(
  selectPersonasState,
  (state) => state.pageSize
);

export const selectPersonasSearchTerm = createSelector(
  selectPersonasState,
  (state) => state.searchTerm
);

export const selectPersonasPagination = createSelector(
  selectPersonasState,
  (state) => ({
    total: state.total,
    currentPage: state.currentPage,
    pageSize: state.pageSize
  })
); 