import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'

import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { selectInstituiton } from '../../actions/dashboardActions'
import Divider from '@material-ui/core/Divider'
import history from '../../history'

const styles = (theme) => ({
  divider: {
    marginTop: 25,
  },
  dividerText: {
    margin: '15px',
    textAlign: 'center',
    color: '#999',
  },
  addBtn: {
    width: '100%',
  },
})

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const SelectInstitutionDialog = (props) => {
  const { classes, institutions, open, handleClose, selectInstituiton } = props

  const [institution, setInstitution] = useState(null)

  const handleIntitutionSelect = (e, v) => {
    setInstitution(v)
  }

  const handleSelect = () => {
    if (institution) {
      selectInstituiton(institution)
      handleClose()
    }
  }

  const handleAdd = () => {
    handleClose()
    history.push('/institutions/new')
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="Select institution"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Select institution
      </DialogTitle>
      <DialogContent>
        <Autocomplete
          id="inst-select"
          options={institutions}
          onChange={handleIntitutionSelect}
          getOptionLabel={(institution) => institution.name}
          style={{ width: 400 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Institutions"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Divider variant="middle" className={classes.divider} />
        <p className={classes.dividerText}>or</p>
        <Button
          onClick={handleAdd}
          variant="contained"
          className={classes.addBtn}
          color="primary"
        >
          Add new institution
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button color="primary" onClick={handleSelect}>
          Select
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (state) => ({
  institutions: state.dashboard.institutions,
  selectedInstitution: state.dashboard.selectedInstitution,
})

const SelectInstitutionDialogRedux = connect(mapStateToProps, {
  selectInstituiton,
})(SelectInstitutionDialog)

export default withStyles(styles)(SelectInstitutionDialogRedux)
