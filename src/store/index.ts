import { createStore, applyMiddleware, Store } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { rootReducer } from '../reducers'
import { EnvironmentDelegate } from 'src/delegates'

const loggerMiddleware = createLogger({})

// Build collection of middleware to include, based on current environment
const middleware: any[] = [thunkMiddleware]
if (EnvironmentDelegate.ReduxLoggerEnabled) {
  middleware.push(loggerMiddleware)
}

const store: Store = createStore(rootReducer, applyMiddleware(...middleware))
export { store }
