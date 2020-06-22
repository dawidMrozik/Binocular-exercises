import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import {
  Paper,
  withStyles,
  Button,
  List,
  ListSubheader,
} from '@material-ui/core'
import { fetchInstitutionUsers } from '../../actions/dashboardActions'
import InstitutionUser from './InstitutionUser'
import AttachUserToInstitutionDialog from '../utils/AttachUserToInstitutionDialog'

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  paperWrapper: {
    padding: theme.spacing(4),
  },
  address: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
})

const InstitutionUsersList = ({
  classes,
  fetchInstitutionUsers,
  institutionUsers,
}) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    fetchInstitutionUsers()
  }, [institutionUsers])

  return (
    <>
      {institutionUsers && (
        <Paper className={classes.paperWrapper}>
          <ListSubheader>Institution users</ListSubheader>
          <List className={classes.root}>
            {institutionUsers.map((user) => (
              <InstitutionUser user={user} />
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Attach user
          </Button>
        </Paper>
      )}
      <AttachUserToInstitutionDialog open={open} handleClose={handleClose} />
    </>
  )
}

const mamStateToProps = (state) => ({
  institution: state.dashboard.selectedInstitution,
  institutionUsers: state.dashboard.institutionUsers,
})

const InstitutionUsersListWithStyles = withStyles(styles)(InstitutionUsersList)

export default connect(mamStateToProps, { fetchInstitutionUsers })(
  InstitutionUsersListWithStyles
)
