import { INIT_COLORS, CHANGE_COLORS } from './types'

export const initColors = () => dispatch => {
  const colors = localStorage.getItem('colors')

  if (!colors) {
    const tmp = {
      first: '#c62828',
      second: '#2e7d32'
    }

    dispatch({ type: INIT_COLORS, payload: tmp })
  } else {
    const tmp = JSON.parse(colors)
    dispatch({ type: INIT_COLORS, payload: tmp })
  }
}

export const changeColors = (first, second) => dispatch => {
  const tmp = { first, second }
  localStorage.setItem('colors', JSON.stringify(tmp))
  dispatch({ type: CHANGE_COLORS, payload: tmp })
}
