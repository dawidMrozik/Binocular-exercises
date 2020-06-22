import React from 'react'
import { withStyles } from '@material-ui/core'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

const styles = theme => ({
  item: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit,
    display: 'inline-block'
  },
  matrixId: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '7.5%'
  },
  red: {
    border: `1px solid ${red[600]}`
  },
  green: {
    border: `1px solid ${green[600]}`
  },
  missed: {
    border: `1px solid ${grey[600]}`
  },
  duration: {
    color: grey[700],
    fontStyle: 'italic'
  },
  patient: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: '7.5%'
  },
  date: {
    fontSize: '0.6rem'
  }
})

const ResultItem = ({ result, withPatient }) => {
  return (
    <TableRow key={result.id}>
      <TableCell component="th" scope="row">
        {result.completed ? (
          <CheckCircleIcon style={{ marginTop: '5px' }} htmlColor="#14662a" />
        ) : (
          <HighlightOffIcon style={{ marginTop: '5px' }} htmlColor="#8c1c1c" />
        )}
      </TableCell>
      <TableCell component="th" scope="row">
        {result.matrix.name} ({result.matrix.difficulty})
      </TableCell>
      {withPatient && (
        <TableCell align="right">
          {result.patient.firstname} {result.patient.lastname}
        </TableCell>
      )}
      <TableCell align="right">
        {result.red_points} / {result.matrix.red_points}
      </TableCell>
      <TableCell align="right">
        {result.green_points} / {result.matrix.green_points}
      </TableCell>
      <TableCell align="right">{result.points_missed}</TableCell>
      <TableCell align="right">{result.duration}</TableCell>
      <TableCell align="right">{result.updated_at}</TableCell>
    </TableRow>
  )
}

export default withStyles(styles)(ResultItem)
