import React from 'react'
import { ListItem, ListItemText, withStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  listItem: {
    width: '100%'
  },
  patientLink: {
    textDecoration: 'none'
  }
})

const Patient = props => {
  const { firstname, lastname, dysfunction, id } = props.patient
  const { classes } = props
  return (
    <Link to={`/patients/${id}`} className={classes.patientLink}>
      <ListItem button component="a">
        <ListItemText
          primary={`${firstname} ${lastname}`}
          secondary={dysfunction}
          className={classes.listItem}
        />
      </ListItem>
    </Link>
  )
}

export default withStyles(styles)(Patient)
