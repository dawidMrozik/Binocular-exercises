import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorReducer'
import matrixReducer from './matrixReducer'
import matrixSolverReducer from './matrixSolverReducer'
import dashboardReducer from './dashboardReducer'
import patientsReducer from './patientsReducer'
import colorsReducer from './colorsReducer'
import successReducer from './successReducer'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  matrix: matrixReducer,
  matrixSolver: matrixSolverReducer,
  dashboard: dashboardReducer,
  patients: patientsReducer,
  form: formReducer,
  colors: colorsReducer,
  success: successReducer
})
