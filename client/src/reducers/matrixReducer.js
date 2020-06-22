import {
  SELECT_POINT,
  SELECT_COLOR,
  SAVE_MATRIX,
  FETCHING_MATRIXES,
  FETCH_MATRIXES_ERRORS,
  FETCH_MATRIXES,
  FETCH_MATRIX_ERRORS,
  FETCHING_MATRIX,
  FETCH_MATRIX,
  LOAD_MATRIX,
  POST_MATRIX_ERRORS,
  POST_MATRIX,
  DELETE_MATRIX,
  SEARCH_MATRIXES,
  SEARCHING_MATRIXES,
  SEARCH_MATRIXES_ERRORS,
  CLEAR_MATRIX,
  CLEAR_NEW_MATRIX
} from '../actions/types'
import { createEmptyMatrix } from '../helpers'

const INITIAL_STATE = {
  matrix: createEmptyMatrix(),
  pointColorToAdd: '#c62828',
  isMatrixesFetching: false,
  isMatrixFetching: false,
  matrixListErrors: null,
  fetchedMatrix: null,
  loadedMatrix: null,
  matrixString: null,
  postedMatrix: null,
  postedMatrixErrors: null,
  isMatrixesSearching: false,
  foundMatrixes: null,
  red_points: 0,
  green_points: 0,
  matrixList: {
    data: [],
    count: 0
  }
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_POINT:
      return {
        ...state,
        matrix: action.payload
      }
    case FETCHING_MATRIXES:
      return {
        ...state,
        isMatrixesFetching: true
      }
    case FETCH_MATRIXES:
      return {
        ...state,
        isMatrixesFetching: false,
        matrixList: action.payload
      }
    case FETCH_MATRIXES_ERRORS:
      return {
        ...state,
        isMatrixesFetching: false,
        matrixListErrors: action.payload
      }
    case FETCHING_MATRIX:
      return {
        ...state,
        isMatrixFetching: true
      }
    case FETCH_MATRIX:
      return {
        ...state,
        isMatrixFetching: false,
        fetchedMatrix: action.payload
      }
    case FETCH_MATRIX_ERRORS:
      return {
        ...state,
        isMatrixFetching: false,
        matrixListErrors: action.payload
      }
    case LOAD_MATRIX:
      return {
        ...state,
        loadedMatrix: action.payload
      }
    case SELECT_COLOR:
      return {
        ...state,
        pointColorToAdd: action.payload
      }
    case SAVE_MATRIX:
      return {
        ...state,
        matrixString: action.payload.matrixString,
        red_points: action.payload.red_points,
        green_points: action.payload.green_points
      }
    case POST_MATRIX:
      return {
        ...state,
        postedMatrix: action.payload
      }
    case POST_MATRIX_ERRORS:
      return {
        ...state,
        postedMatrixErrors: action.payload
      }
    case DELETE_MATRIX:
      return {
        ...state
      }
    case SEARCH_MATRIXES:
      return {
        ...state,
        isMatrixesSearching: false,
        foundMatrixes: action.payload
      }
    case SEARCHING_MATRIXES:
      return {
        ...state,
        isMatrixesSearching: true
      }
    case SEARCH_MATRIXES_ERRORS:
      return {
        ...state,
        isMatrixesSearching: false,
        MatrixesSearchError: action.payload
      }
    case CLEAR_MATRIX:
      return {
        ...state,
        fetchedMatrix: null,
        loadedMatrix: null
      }
    case CLEAR_NEW_MATRIX:
      return {
        ...state,
        matrix: createEmptyMatrix(),
        fetchedMatrix: null,
        loadedMatrix: null
      }
    default:
      return state
  }
}
