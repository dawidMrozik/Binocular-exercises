import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  List,
  ListSubheader,
  withStyles,
  Button,
} from '@material-ui/core'
import { searchPatients } from '../../actions/dashboardActions'
import Patient from './Patient'
import { Link } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import history from '../../history'

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  patientList: {
    padding: theme.spacing.unit * 4,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fcfcfc',
    '&:hover': {
      backgroundColor: '#fafafa',
    },
    width: '100%',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const renderPatientsList = (props) => {
  const { classes, patients, searchPatients } = props

  const handleSearch = (e) => {
    const q = e.target.value
    searchPatients(q)
  }

  if (patients) {
    return (
      <>
        <ListSubheader>Patients</ListSubheader>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search patients"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearch}
          />
        </div>
        <List className={classes.root}>
          {patients.data.map((patient) => (
            <Patient key={patient.id} patient={patient} />
          ))}
        </List>
      </>
    )
  }
}

const Patients = (props) => {
  const { selectedInstitution } = props

  useEffect(() => {
    props.searchPatients('')
  }, [selectedInstitution])

  const ButtonLink = (props) => (
    <Link to={`institutions/1/patients/new`} {...props} />
  )

  return (
    <Paper className={props.classes.patientList}>
      {renderPatientsList(props)}
      <div className={props.classes.btnContainer}>
        <Button component={ButtonLink} variant="contained" color="primary">
          Add new patient
        </Button>
        <Button
          variant="text"
          color="secondary"
          className={props.classes.button}
          onClick={() =>
            history.push(`/institutions/${selectedInstitution.id}/patients`)
          }
        >
          Show all
        </Button>
      </div>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    patients: state.dashboard.foundPatients,
    selectedInstitution: state.dashboard.selectedInstitution,
  }
}

const PatientsWithStyles = withStyles(styles)(Patients)

export default connect(mapStateToProps, { searchPatients })(PatientsWithStyles)
