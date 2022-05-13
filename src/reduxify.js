import React from 'react';
import {
  render,
  screen,
  fireEvent,
  RenderResult,
} from '@testing-library/react';
import { Provider } from 'react-redux';

import { store } from './redux/store';

import App from "./App";
import { store } from "./redux/store";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider >

  </StrictMode>,
  rootElement
);

