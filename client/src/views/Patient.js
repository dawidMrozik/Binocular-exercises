import React, { useEffect } from 'react'
import { Paper, Grid, withStyles, Typography, Button } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { connect } from 'react-redux'
import {
  fetchPatient,
  fetchPatientResults,
  deletePatient,
} from '../actions/patientsActions'
import { Link } from 'react-router-dom'
import ResultItem from '../components/results/ResultItem'
import DeleteDialog from '../components/utils/DeleteDialog'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MainTemplate from '../templates/MainTemplate'

const styles = (theme) => ({
  patientCard: {
    padding: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    backgroundColor: theme.palette.background.paper,
  },
})

const handleDelete = (id, deletePatient) => {
  deletePatient(id)
}

const renderPatientInfo = (patient, deletePatient) => {
  const ButtonLink = (props) => (
    <Link
      to={`/institutions/${patient.patient.data.institution_id}/patients/${patient.patient.data.id}/edit`}
      {...props}
    />
  )

  return patient.patient ? (
    <>
      <Typography variant="h6" gutterBottom>
        {patient.patient.data.firstname} {patient.patient.data.lastname}
      </Typography>
      <Typography variant="overline" gutterBottom display="block">
        Created at: {patient.patient.data.created_at}
      </Typography>
      <Typography variant="overline" gutterBottom display="block">
        Updated at: {patient.patient.data.updated_at}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {patient.patient.data.dysfunction}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {patient.patient.data.description}
      </Typography>
      <Button
        component={ButtonLink}
        variant="contained"
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Edit <EditIcon />
      </Button>
      <DeleteDialog
        handleDelete={() =>
          handleDelete(patient.patient.data.id, deletePatient)
        }
      />
    </>
  ) : (
    'Loading...'
  )
}

const renderPatientResults = (results, classes, patientId) => {
  const ButtonLink = (props) => (
    <Link to={`/patients/${patientId}/selectMatrix`} {...props} />
  )
  return results ? (
    <>
      <Typography variant="caption">Latest results</Typography>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: '650px' }} aria-label="Ostatnie wyniki">
          <TableHead>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell>Matrix</TableCell>
              <TableCell align="right">Red points</TableCell>
              <TableCell align="right">Green points</TableCell>
              <TableCell align="right">Points missed</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.data.map((result) => (
              <ResultItem key={result.id} result={result} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        component={ButtonLink}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Start new exercise
      </Button>
    </>
  ) : (
    'Laoding...'
  )
}

const Patient = (props) => {
  const { classes } = props
  const {
    match: { params },
  } = props

  useEffect(() => {
    props.fetchPatient(params.patientId)
    props.fetchPatientResults(params.patientId)
  }, [])

  return (
    <MainTemplate>
      <Grid item lg={4} xs={12}>
        <Paper className={classes.patientCard}>
          {renderPatientInfo(props.patient, props.deletePatient)}
        </Paper>
      </Grid>
      <Grid item lg={8} xs={12}>
        <Paper className={classes.patientCard}>
          {renderPatientResults(props.results, classes, params.patientId)}
        </Paper>
      </Grid>
    </MainTemplate>
  )
}

const mapStateToProps = (state) => {
  return { patient: state.patients, results: state.patients.results }
}

const PatientWithStyles = withStyles(styles)(Patient)

export default connect(mapStateToProps, {
  fetchPatient,
  fetchPatientResults,
  deletePatient,
})(PatientWithStyles)
