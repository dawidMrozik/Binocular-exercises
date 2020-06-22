import {
  FETCH_MATRIX_SOLVER,
  FETCHING_MATRIX_SOLVER,
  FETCH_MATRIX_SOLVER_ERRORS,
  LOAD_MATRIX_SOLVER,
  SOLVE_SELECT_POINT,
  MATRIX_SOLVED,
  POST_MATRIX_RESULTS,
  POST_MATRIX_RESULTS_ERRORS
} from '../actions/types'
import { createEmptyMatrix } from '../helpers'

const INITIAL_STATE = {
  isMatrixSolverFetching: false,
  matrixString: '',
  matrix: createEmptyMatrix(),
  matrix_id: null,
  patient_id: null,
  pointsLeft: 10,
  pointsMissed: 0,
  red_points: 0,
  green_points: 0,
  isSolved: false,
  red: '#f00',
  green: '#0f0',
  redSolved: 0,
  greenSolved: 0,
  erros: null,
  postedResults: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_MATRIX_SOLVER:
      return {
        ...state,
        isMatrixSolverFetching: true
      }
    case FETCH_MATRIX_SOLVER:
      return {
        ...state,
        isMatrixSolverFetching: false,
        matrixString: action.payload
      }
    case LOAD_MATRIX_SOLVER:
      return {
        ...state,
        matrix: action.payload.matrix,
        pointsLeft: action.payload.pointsLeft,
        matrix_id: action.payload.matrix_id,
        patient_id: action.payload.patient_id,
        red_points: action.payload.red_points,
        green_points: action.payload.green_points,
        red: action.payload.red,
        green: action.payload.green
      }
    case SOLVE_SELECT_POINT:
      return {
        ...state,
        matrix: action.payload.matrix,
        pointsLeft: action.payload.pointsLeft,
        pointsMissed: action.payload.pointsMissed,
        redSolved: action.payload.redSolved,
        greenSolved: action.payload.greenSolved
      }
    case FETCH_MATRIX_SOLVER_ERRORS:
      return {
        ...state,
        isMatrixSolverFetching: false,
        erros: action.payload
      }
    case MATRIX_SOLVED:
      return {
        ...state,
        isSolved: true
      }
    case POST_MATRIX_RESULTS:
      return {
        ...INITIAL_STATE,
        postedResults: action.payload
      }
    case POST_MATRIX_RESULTS_ERRORS:
      return {
        ...state,
        errors: action.payload
      }
    default:
      return state
  }
}
