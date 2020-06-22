import React from 'react'
import ReactDOM from 'react-dom'
import 'typeface-roboto'
import App from './components/App'
import store from './store'
import './styles.css'
import { SnackbarProvider } from 'notistack'

import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={5}>
      <App />
    </SnackbarProvider>
  </Provider>,
  document.querySelector('#root')
)
