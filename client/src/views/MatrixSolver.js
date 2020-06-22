import React, { useEffect } from 'react'
import { Paper, Typography, Button } from '@material-ui/core'
import SolverPoint from '../components/matrixes/SolverPoint'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { selectColor } from '../actions/matrixActions'
import {
  loadMatrix,
  fetchMatrix,
  solveSelectPoint,
  matrixSolved,
} from '../actions/matrixSolverActions'
import { Grid } from '@material-ui/core'
import MainTemplate from '../templates/MainTemplate'

const styles = (theme) => ({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit,
  },
})

const MatrixSolver = ({
  fetchMatrix,
  loadMatrix,
  match,
  matrix,
  matrixSolved,
  classes,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      await fetchMatrix(match.params.matrixId)
      await loadMatrix(match.params.matrixId, match.params.patientId)
    }
    fetchData()
  }, [])

  const renderMatrix = () => {
    const matrixToRender = matrix.map((row, rowIndex) => {
      return row.map((column, columnIndex) => (
        <SolverPoint
          key={`${rowIndex}|${columnIndex}`}
          row={rowIndex}
          col={columnIndex}
        />
      ))
    })

    return matrixToRender
  }

  return (
    <MainTemplate>
      <Grid item xs={10}>
        <div className={classes.headerContainer}>
          <Typography variant="h5" gutterBottom>
            Solving matrix
          </Typography>
          <Button variant="contained" color="primary" onClick={matrixSolved}>
            FINISH
          </Button>
        </div>
        <Paper className="grid-container">{renderMatrix()}</Paper>
      </Grid>
    </MainTemplate>
  )
}

const mapStateToProps = (state) => {
  return { matrix: state.matrixSolver.matrix }
}

const MatrixSolverWithStyles = withStyles(styles)(MatrixSolver)

export default connect(mapStateToProps, {
  selectColor,
  loadMatrix,
  fetchMatrix,
  solveSelectPoint,
  matrixSolved,
})(MatrixSolverWithStyles)
