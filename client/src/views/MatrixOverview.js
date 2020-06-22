import React, { useEffect } from 'react'
import { Paper } from '@material-ui/core'
import PointOverview from '../components/matrixes/PointOverview'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { fetchMatrix, loadMatrix } from '../actions/matrixActions'
import { deleteMatrix } from '../actions/matrixActions'
import DeleteDialog from '../components/utils/DeleteDialog'
import MainTemplate from '../templates/MainTemplate'

import green from '@material-ui/core/colors/green'

const styles = (theme) => ({
  matrixDiff: {
    fontSize: 18,
    marginLeft: theme.spacing.unit,
    backgroundColor: green[800],
    color: 'white',
    padding: theme.spacing.unit,
    borderRadius: '5%',
    '&:hover': {
      backgroundColor: green[900],
    },
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit,
  },
})

const handleDelete = (id, deleteMatrix) => {
  deleteMatrix(id)
}

const renderMatrix = (props) => {
  if (props.matrix) {
    if (props.matrix.matrix) {
      const matrix = props.matrix.matrix.map((row, rowIndex) => {
        return row.map((column, columnIndex) => (
          <PointOverview
            key={`${rowIndex}|${columnIndex}`}
            row={rowIndex}
            col={columnIndex}
          />
        ))
      })

      return matrix
    }
  }
}

const renderMatrixOverviewHeader = (props) => {
  if (props.matrix) {
    return (
      <div className={props.classes.headerWrapper}>
        <Typography variant="h6" gutterBottom>
          {props.matrix.matrixName}
          <span className={props.classes.matrixDiff}>
            {props.matrix.matrixDiff}
          </span>
        </Typography>
        <DeleteDialog
          handleDelete={() =>
            handleDelete(props.match.params.matrixId, props.deleteMatrix)
          }
        />
      </div>
    )
  }
}

const MatrixOverview = (props) => {
  const {
    match: { params },
  } = props
  useEffect(() => {
    const fetchData = async () => {
      await props.fetchMatrix(params.matrixId)
      await props.loadMatrix()
    }
    fetchData()
  }, [])

  return (
    <MainTemplate>
      <Grid item xs={10}>
        {renderMatrixOverviewHeader(props)}
        <Paper className="grid-container">{renderMatrix(props)}</Paper>
      </Grid>
    </MainTemplate>
  )
}

const mapStateToProps = (state) => {
  return { matrix: state.matrix.loadedMatrix }
}

const MatrixOverviewWithStyles = withStyles(styles)(MatrixOverview)

export default connect(mapStateToProps, {
  fetchMatrix,
  loadMatrix,
  deleteMatrix,
})(MatrixOverviewWithStyles)
