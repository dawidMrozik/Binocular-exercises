import React from 'react'
import { connect } from 'react-redux'

import { Paper, Typography, Grid, withStyles, Button } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import history from '../history'
import InstitutionUsersList from '../components/institution/InstitutionUsersList'
import MainTemplate from '../templates/MainTemplate'

const styles = (theme) => ({
  main: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 1200,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paperWrapper: {
    padding: theme.spacing(4),
  },
  address: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
})

const InstitutionOverview = ({ institution, userId, classes }) => {
  return (
    <MainTemplate>
      <Grid item xs={6}>
        <Paper className={classes.paperWrapper}>
          <Typography variant="h2" gutterBottom>
            {institution.name}
          </Typography>
          <Typography variant="caption" gutterBottom>
            Added at: {institution.created_at}
          </Typography>
          <div className={classes.address}>
            <Typography variant="h6" gutterBottom>
              Address
            </Typography>
            <Typography variant="body1">{institution.city}</Typography>
            <Typography variant="body1">{institution.address}</Typography>
            <Typography variant="body1">{institution.postal_code}</Typography>
          </div>
          <Typography variant="body2" gutterBottom>
            {institution.description}
          </Typography>
          {institution.pivot.user_id === userId && (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                history.push(`/institutions/${institution.id}/edit`)
              }
            >
              Edit <EditIcon />
            </Button>
          )}
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <InstitutionUsersList />
      </Grid>
    </MainTemplate>
  )
}

const mamStateToProps = (state) => ({
  institution: state.dashboard.selectedInstitution,
  userId: state.auth.user.id,
})

const InstitutionOverviewWithStyles = withStyles(styles)(InstitutionOverview)

export default connect(mamStateToProps)(InstitutionOverviewWithStyles)
