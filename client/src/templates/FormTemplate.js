import React from 'react'
import { Grid, Button } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import withStyles from '@material-ui/core/styles/withStyles'
import history from '../history'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const styles = (theme) => ({
  formContainer: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
  },
  backBtn: {
    marginBottom: theme.spacing(2),
  },
})

const FormTemplate = ({ classes, children }) => {
  const goBack = () => {
    history.goBack()
  }

  return (
    <Grid container justify="center" className={classes.formContainer}>
      <Grid item lg={4} sm={6} xs={10}>
        <Button
          variant="text"
          color="primary"
          className={classes.backBtn}
          onClick={goBack}
        >
          <ArrowBackIosIcon /> Go back
        </Button>
        <Paper className={classes.paper}>{children}</Paper>
      </Grid>
    </Grid>
  )
}

const FormTemplateWithStyles = withStyles(styles)(FormTemplate)

export default FormTemplateWithStyles
