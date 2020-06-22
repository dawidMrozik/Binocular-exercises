import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import {
  withStyles,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import { connect } from 'react-redux'
import { List, ListItemText, ListItem } from '@material-ui/core'
import {
  fetchUsers,
  attachUserToInstitution,
} from '../../actions/dashboardActions'
import { AddBox } from '@material-ui/icons'

const styles = (theme) => ({
  root: {
    width: '300px',
  },
})

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const AttachUserToInstitutionDialog = (props) => {
  const {
    classes,
    institutionUsers,
    open,
    handleClose,
    attachUserToInstitution,
    users,
    fetchUsers,
  } = props
  const [filteredUsers, setFilteredUsers] = useState([])

  const handleAttach = async (id) => {
    await attachUserToInstitution(id)
    handleClose()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, institutionUsers])

  const filterUsers = () => {
    if (users && institutionUsers) {
      const ids = institutionUsers.map((el) => el.id)
      setFilteredUsers(users.filter((x) => ids.indexOf(x.id) === -1))
    }
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="Select institution"
      className={classes.dialog}
    >
      <DialogTitle id="alert-dialog-slide-title">Attach user</DialogTitle>
      <DialogContent>
        <List className={classes.root}>
          {filteredUsers.length === 0
            ? 'No users found'
            : filteredUsers.map((user) => (
                <ListItem>
                  <ListItemText
                    primary={`${user.firstname} ${user.lastname}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="attach"
                      onClick={() => handleAttach(user.id)}
                    >
                      <AddBox />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

const mapStateToProps = (state) => ({
  users: state.dashboard.users,
  institutionUsers: state.dashboard.institutionUsers,
})

const AttachUserToInstitutionDialogRedux = connect(mapStateToProps, {
  fetchUsers,
  attachUserToInstitution,
})(AttachUserToInstitutionDialog)

export default withStyles(styles)(AttachUserToInstitutionDialogRedux)
