import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import DeleteIcon from '@material-ui/icons/Delete'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const DeleteDialog = (props) => {
  const [state, setState] = useState({ open: false })

  const handleClickOpen = () => {
    setState({ ...state, open: true })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Delete <DeleteIcon />
      </Button>
      <Dialog
        open={state.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Deleting</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              props.handleDelete()
              handleClose()
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteDialog
