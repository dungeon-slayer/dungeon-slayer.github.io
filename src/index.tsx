import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import '@atlaskit/css-reset'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { store } from './store'
import './common/global-styles'

// -- Bootstrap React App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')!
)

// -- Service Worker config
registerServiceWorker()
