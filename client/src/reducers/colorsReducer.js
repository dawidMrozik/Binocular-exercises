import { INIT_COLORS, CHANGE_COLORS } from '../actions/types'

export default (state = { first: null, second: null }, action) => {
  switch (action.type) {
    case INIT_COLORS:
      return {
        ...state,
        first: action.payload.first,
        second: action.payload.second
      }
    case CHANGE_COLORS:
      return {
        ...state,
        first: action.payload.first,
        second: action.payload.second
      }
    default:
      return state
  }
}
