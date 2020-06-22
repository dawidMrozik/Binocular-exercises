import React from 'react'
import './matrixStyles.css'
import { selectPoint } from '../../actions/matrixActions'
import { connect } from 'react-redux'

const Point = ({ selectPoint, ceil, row, col }) => {
  return (
    <div
      className="point"
      onClick={() => selectPoint(row, col)}
      style={{
        backgroundColor: ceil.color
      }}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  return { ceil: state.matrix.matrix[ownProps.row][ownProps.col] }
}

export default connect(mapStateToProps, { selectPoint })(Point)
