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

const Matrix = (props) => {
  const { name, difficulty, id } = props.matrix
  const { classes } = props

  const MatrixOverviewLink = (props) => (
    <Link to={`/matrixes/${id}`} {...props} />
  )

  return (
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
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const MatrixWithStyles = withStyles(styles)(Matrix)

export default MatrixWithStyles
