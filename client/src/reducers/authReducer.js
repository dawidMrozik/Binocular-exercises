import {
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL
} from '../actions/types'

import api from '../api'

const token = localStorage.getItem('token')
let user = localStorage.getItem('user')

if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
if (user) user = JSON.parse(user)

const INITIAL_STATE =
  user && token
    ? {
        token,
        isAuthenticated: true,
        isLoading: false,
        user
      }
    : { isAuthenticated: false }

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      }
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false
      }
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('institution')
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      }
    default:
      return state
  }
}
