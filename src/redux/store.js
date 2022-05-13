import { configureStore } from '@reduxjs/toolkit';
import populationReducer from './populationSlice';
export const store = configureStore({
  reducer: {
    population: populationReducer,
  },
});
