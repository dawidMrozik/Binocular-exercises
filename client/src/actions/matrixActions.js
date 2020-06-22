import {
  SELECT_POINT,
  SELECT_COLOR,
  SAVE_MATRIX,
  FETCHING_MATRIXES,
  FETCHING_MATRIX,
  FETCH_MATRIXES,
  FETCH_MATRIX,
  LOAD_MATRIX,
  POST_MATRIX,
  DELETE_MATRIX,
  SEARCHING_MATRIXES,
  SEARCH_MATRIXES,
  GET_SUCCESS,
  CLEAR_NEW_MATRIX,
} from './types'
import { generateMatrixString } from '../helpers'
import api from '../api'
import { encodeMatrixString } from '../helpers'
import history from '../history'
import { SubmissionError } from 'redux-form'
import { returnErrors } from './errorActions'

export const fetchMatrixes = (institutionId, page, perPage) => async (
  dispatch
) => {
  dispatch({ type: FETCHING_MATRIXES })

  const start = page * perPage
  const end = start + perPage

  await api
    .get(`/institutions/${institutionId}/matrixes?range=[${start},${end}]`)
    .then((res) => {
      dispatch({
        type: FETCH_MATRIXES,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const fetchMatrix = (id) => async (dispatch) => {
  dispatch({ type: FETCHING_MATRIX })

  await api
    .get(`/matrixes/${id}`)
    .then((res) => {
      dispatch({
        type: FETCH_MATRIX,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const loadMatrix = () => (dispatch, getState) => {
  const matrixString = getState().matrix.fetchedMatrix.data.matrixString
  const matrixName = getState().matrix.fetchedMatrix.data.name
  const matrixDiff = getState().matrix.fetchedMatrix.data.difficulty
  const matrix = encodeMatrixString(matrixString)

  const payload = {
    matrix,
    matrixName,
    matrixDiff,
  }

  dispatch({ type: LOAD_MATRIX, payload })
}

export const selectPoint = (row, col) => (dispatch, getState) => {
  let currentMatrix = getState().matrix.matrix
  const selectedColor = getState().matrix.pointColorToAdd

  currentMatrix[row][col] = {
    isSelected: currentMatrix[row][col].isSelected ? false : true,
    color: currentMatrix[row][col].color === '#bbb' ? selectedColor : '#bbb',
  }

  dispatch({ type: SELECT_POINT, payload: currentMatrix })
}

export const selectColor = (color) => (dispatch) => {
  dispatch({ type: SELECT_COLOR, payload: color })
}

export const saveMatrix = () => (dispatch, getState) => {
  const [matrixString, red_points, green_points] = generateMatrixString(
    getState().matrix.matrix,
    true
  )

  dispatch({
    type: SAVE_MATRIX,
    payload: { matrixString, red_points, green_points },
  })
  history.push('finalize')
}

export const postMatrix = (name, difficulty) => async (dispatch, getState) => {
  const matrixString = getState().matrix.matrixString
  const institutionId = getState().dashboard.selectedInstitution.id
  const red_points = getState().matrix.red_points
  const green_points = getState().matrix.green_points
  const userId = getState().auth.user.id

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = JSON.stringify({
    institution_id: institutionId,
    user_id: userId,
    name,
    difficulty,
    matrixString,
    red_points,
    green_points,
  })

  await api
    .post('/matrixes', body, config)
    .then((res) => {
      dispatch({
        type: POST_MATRIX,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Matrix created' },
      })

      history.push('/')
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))

      throw new SubmissionError(err.response.data.errors)
    })
}

export const deleteMatrix = (id) => async (dispatch) => {
  api
    .delete(`/matrixes/${id}`)
    .then((res) => {
      dispatch({
        type: DELETE_MATRIX,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Matrix deleted' },
      })

      history.push('/')
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const searchMatrixes = (query) => async (dispatch, getState) => {
  const institutionId = getState().dashboard.selectedInstitution.id

  dispatch({ type: SEARCHING_MATRIXES })

  await api
    .get(`/institutions/${institutionId}/matrixes/search?q=${query}`)
    .then((res) => {
      dispatch({
        type: SEARCH_MATRIXES,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const clearMatrix = () => {
  return { type: CLEAR_NEW_MATRIX }
}
