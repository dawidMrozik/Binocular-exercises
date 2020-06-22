import React from 'react'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'
import { RemoveCircle } from '@material-ui/icons'
import { connect } from 'react-redux'
import { dettachUserToInstitution } from '../../actions/dashboardActions'

const InstitutionUser = ({ user, currentUserId, dettachUserToInstitution }) => {
  const handleDettach = id => {
    dettachUserToInstitution(id)
  }

  return (
    <ListItem button>
      <ListItemText primary={`${user.firstname} ${user.lastname}`} />
      {currentUserId !== user.id && (
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="dettach"
            onClick={() => handleDettach(user.id)}
          >
            <RemoveCircle />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
}

const mapStateToProps = state => ({
  currentUserId: state.auth.user.id
})

export default connect(mapStateToProps, { dettachUserToInstitution })(
  InstitutionUser
)
