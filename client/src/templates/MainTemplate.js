import React from 'react'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Navbar from '../components/Navbar'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  main: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    width: 380,
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: '95vw',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  lastResults: {
    marginLeft: theme.spacing(3),
    padding: theme.spacing(2)
  },
  institution: {
    cursor: 'pointer',
    '&:hover': {
      color: '#555'
    }
  }
})

const MainTemplate = ({ classes, children }) => {
  return (
    <>
      <Navbar />
      <div className={classes.root}>
        <Grid
          container
          className={classes.main}
          justify="space-around"
          spacing={2}
        >
          {children}
        </Grid>
      </div>
    </>
  )
}

const MainTemplateWithStyles = withStyles(styles)(MainTemplate)

export default MainTemplateWithStyles
