import React from 'react'
import { Link } from 'react-router-dom'
import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from '@material-ui/core'

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
  },
  listItem: {
    width: '100%',
  },
  matrixLink: {
    textDecoration: 'none',
  },
})

const MatrixItem = (props) => {
  const { name, difficulty, id } = props.matrix
  const { patientId, classes } = props

  const MatrixOverviewLink = (props) => (
    <Link to={`/matrixes/${id}`} {...props} />
  )
  const MatrixSolverLink = (props) => (
    <Link to={`/patients/${patientId}/matrixes/${id}/test`} {...props} />
  )

  return (
    <Link to={`/matrixes/${id}`} className={classes.matrixLink}>
      <ListItem button component="a">
        <ListItemText
          primary={`${name}`}
          secondary={difficulty}
          className={classes.listItem}
        />
        <ListItemSecondaryAction>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            component={MatrixOverviewLink}
          >
            Overview
          </Button>

          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            component={MatrixSolverLink}
          >
            Start exercise
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  )
}

export default withStyles(styles)(MatrixItem)
