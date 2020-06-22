import React, { useEffect } from 'react'
import MatrixSubmit from '../../views/MatrixSubmit'
import { postMatrix } from '../../actions/matrixActions'
import { connect } from 'react-redux'
import store from '../../store'
import { CLEAR_MATRIX } from '../../actions/types'

const MatrixForm = props => {
  useEffect(() => {
    store.dispatch({ type: CLEAR_MATRIX })
  }, [])

  const matrixSubmitHandler = values => {
    return props.postMatrix(values.name, values.difficulty)
  }

  return <MatrixSubmit onSubmit={matrixSubmitHandler} />
}

export default connect(null, { postMatrix })(MatrixForm)
