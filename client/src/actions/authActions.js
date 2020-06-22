import {
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  GET_SUCCESS,
} from './types'
import { returnErrors } from './errorActions'
import api from '../api'
import history from '../history'

// Register user
export const register = ({ firstname, lastname, email, password }) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Request body
  const body = JSON.stringify({ firstname, lastname, email, password })

  await api
    .post('/users/register', body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Successfully signed up' },
      })

      history.push('/')
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data.errors,
          err.response.status,
          'REGISTER_FAIL'
        )
      )
      dispatch({
        type: REGISTER_FAIL,
      })
    })
}

export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Request body
  const body = JSON.stringify({ email, password })

  await api
    .post('/users/login', body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Successfully logged in' },
      })

      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${res.data.data.token}`

      history.push('/')
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data.errors,
          err.response.status,
          'LOGIN_FAIL'
        )
      )
      dispatch({
        type: LOGIN_FAIL,
      })
    })
}

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT_SUCCESS })

  dispatch({
    type: GET_SUCCESS,
    payload: { msg: 'Successfully logged out' },
  })
}

// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from store
  const token = getState().auth.token

  // Headers
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
}
