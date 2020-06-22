import React from 'react'
import {
  withStyles,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
} from '@material-ui/core'
import history from '../history'
import MainTemplate from '../templates/MainTemplate'

const styles = (theme) => ({
  paperWrapper: {
    padding: theme.spacing(4),
  },
  btn: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
  divider: {
    marginBottom: theme.spacing(4),
  },
  or: {
    marginTop: theme.spacing(4),
  },
})

const NoInstitution = ({ classes }) => {
  return (
    <MainTemplate>
      <Grid item xs={12} sm={10} md={8} xl={6}>
        <Paper className={classes.paperWrapper}>
          <Typography variant="h6" gutterBottom align="center">
            You are not yet a member of any institution
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            You can now wait for an instituion invite
          </Typography>
          <Typography
            variant="caption"
            align="center"
            display="block"
            className={classes.or}
          >
            or
          </Typography>
          <Divider className={classes.divider} />
          <Button
            color="primary"
            variant="contained"
            onClick={() => history.push('/institutions/new')}
            className={classes.btn}
          >
            Create new institution
          </Button>
        </Paper>
      </Grid>
    </MainTemplate>
  )
}

export default withStyles(styles)(NoInstitution)
