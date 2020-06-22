import React from 'react'
import './matrixStyles.css'
import { solveSelectPoint } from '../../actions/matrixSolverActions'
import { connect } from 'react-redux'

const Point = ({ solveSelectPoint, row, col, ceil }) => {
  return (
    <div
      className="point"
      onClick={() => solveSelectPoint(row, col)}
      style={{
        backgroundColor: ceil.color
      }}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  return { ceil: state.matrixSolver.matrix[ownProps.row][ownProps.col] }
}

export default connect(mapStateToProps, { solveSelectPoint })(Point)
