import React from 'react'
import './matrixStyles.css'
import { connect } from 'react-redux'

const PointOverview = ({ ceil }) => {
  return (
    <div
      className="point"
      style={{
        backgroundColor: ceil.color
      }}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  return { ceil: state.matrix.loadedMatrix.matrix[ownProps.row][ownProps.col] }
}

export default connect(mapStateToProps)(PointOverview)
