import { encodeMatrixString } from '../helpers'
import {
  LOAD_MATRIX_SOLVER,
  FETCH_MATRIX_SOLVER,
  SOLVE_SELECT_POINT,
  FETCHING_MATRIX_SOLVER,
  MATRIX_SOLVED,
  POST_MATRIX_RESULTS,
} from './types'
import api from '../api'
import history from '../history'
import { returnErrors } from './errorActions'

export const fetchMatrix = (id) => async (dispatch) => {
  dispatch({ type: FETCHING_MATRIX_SOLVER })

  await api
    .get(`/matrixes/${id}`)
    .then((res) => {
      dispatch({
        type: FETCH_MATRIX_SOLVER,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

// timer helpers
let solvingStarted = false
let start, end, diff

//completion tracker
let completed = false

export const loadMatrix = (matrix_id, patient_id) => (dispatch, getState) => {
  const matrixString = getState().matrixSolver.matrixString.data.matrixString
  const [
    matrix,
    pointsLeft,
    red_points,
    green_points,
    red,
    green,
  ] = encodeMatrixString(matrixString, true)

  solvingStarted = false
  start = 0
  end = 0
  diff = 0
  completed = false

  const payload = {
    matrix,
    pointsLeft,
    matrix_id,
    patient_id,
    red_points,
    green_points,
    red,
    green,
  }

  dispatch({ type: LOAD_MATRIX_SOLVER, payload })
}

export const solveSelectPoint = (row, col) => (dispatch, getState) => {
  const currentMatrix = getState().matrixSolver.matrix
  let pointsLeft = getState().matrixSolver.pointsLeft
  let green = getState().matrixSolver.green
  let red = getState().matrixSolver.red
  let pointsMissed = getState().matrixSolver.pointsMissed
  let redSolved = getState().matrixSolver.redSolved
  let greenSolved = getState().matrixSolver.greenSolved

  // start timer after first selected point
  if (!solvingStarted) {
    start = performance.now()

    solvingStarted = true
  }

  if (currentMatrix[row][col].isSelected) {
    if (currentMatrix[row][col].color === red) {
      redSolved++
    } else if (currentMatrix[row][col].color === green) {
      greenSolved++
    }

    currentMatrix[row][col] = {
      isSelected: false,
      color: '#bbb',
    }

    pointsLeft--

    if (pointsLeft === 0) {
      completed = true
    }
  } else {
    pointsMissed++
  }

  const payload = {
    matrix: currentMatrix,
    pointsLeft,
    pointsMissed,
    redSolved,
    greenSolved,
  }

  dispatch({ type: SOLVE_SELECT_POINT, payload })
}

export const matrixSolved = () => (dispatch, getState) => {
  //calculate time taken to solve matrix and format it
  end = performance.now()
  diff = end - start
  const duration = (diff / 1000).toFixed(2) + 's'

  const userId = getState().auth.user.id
  const red_points = getState().matrixSolver.redSolved
  const green_points = getState().matrixSolver.greenSolved
  const points_missed = getState().matrixSolver.pointsMissed
  const matrix_id = getState().matrixSolver.matrix_id
  const patient_id = getState().matrixSolver.patient_id
  const institution_id = getState().dashboard.selectedInstitution.id

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = {
    patient_id,
    matrix_id,
    user_id: userId,
    institution_id,
    duration,
    red_points,
    green_points,
    points_missed,
    completed,
  }

  dispatch({ type: MATRIX_SOLVED })

  api
    .post('/results', body, config)
    .then((res) => {
      dispatch({
        type: POST_MATRIX_RESULTS,
        payload: res.data,
      })
      history.push('/')
      completed = false
      start = 0
      end = 0
    })
    .catch((err) => {
      completed = false
      start = 0
      end = 0
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}
