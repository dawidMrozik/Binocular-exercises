import { GET_ERRORS, CLEAR_ERRORS, CLEAR_ERROR_STATUS } from '../actions/types'

const initialState = {
  msg: {},
  status: null,
  id: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id
      }
    case CLEAR_ERROR_STATUS:
      return {
        ...state, // persist rest info for keeping forms errors display
        status: null
      }
    case CLEAR_ERRORS:
      return { ...initialState }
    default:
      return state
  }
}
