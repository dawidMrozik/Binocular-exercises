import React, { useEffect } from 'react'
import { Paper } from '@material-ui/core'
import Point from '../components/matrixes/Point'
import { connect } from 'react-redux'
import Fab from '@material-ui/core/Fab'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { selectColor, saveMatrix, clearMatrix } from '../actions/matrixActions'
import { Save } from '@material-ui/icons'
import MainTemplate from '../templates/MainTemplate'

import '../components/matrixes/matrixStyles.css'

import yellow from '@material-ui/core/colors/yellow'

const styles = theme => ({
  fabFirst: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: '20px',
    right: '20px'
  },
  fabSecond: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: '80px',
    right: '20px'
  },
  fabSave: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: '140px',
    right: '20px',
    backgroundColor: yellow[800],
    '&:hover': {
      backgroundColor: yellow[900]
    }
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
})

const NewMatrix = ({
  clearMatrix,
  selectColor,
  colors,
  matrix,
  saveMatrix,
  classes
}) => {
  useEffect(() => {
    clearMatrix()
    selectColor(colors.first)
  }, [])

  const renderMatrix = () => {
    const matrixToRender = matrix.map((row, rowIndex) => {
      return row.map((column, columnIndex) => (
        <Point
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
        <Paper className="grid-container">{renderMatrix()}</Paper>
        <Fab
          onClick={() => selectColor(colors.first)}
          aria-label="first"
          className={classes.fabFirst}
          style={{ backgroundColor: colors.first }}
        />
        <Fab
          onClick={() => selectColor(colors.second)}
          aria-label="second"
          className={classes.fabSecond}
          style={{ backgroundColor: colors.second }}
        />
        <Fab
          onClick={saveMatrix}
          aria-label="yellow"
          className={classes.fabSave}
        >
          <Save />
        </Fab>
      </Grid>
    </MainTemplate>
  )
}

const mapStateToProps = state => ({
  matrix: state.matrix.matrix,
  colors: state.colors
})

const NewMatrixWithStyles = withStyles(styles)(NewMatrix)

export default connect(mapStateToProps, {
  selectColor,
  saveMatrix,
  clearMatrix
})(NewMatrixWithStyles)
