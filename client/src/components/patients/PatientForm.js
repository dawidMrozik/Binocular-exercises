import React, { useEffect } from 'react'
import PatientSubmit from '../../views/PatientSubmit'
import { postPatient, editPatient } from '../../actions/patientsActions'
import { connect } from 'react-redux'
import store from '../../store'
import { CLEAR_PATIENT } from '../../actions/types'

const PatientForm = props => {
  useEffect(() => {
    if (!props.edit) {
      store.dispatch({ type: CLEAR_PATIENT })
    }
  }, [])

  const PatientPostHandler = values => {
    return props.postPatient(values)
  }

  const PatientEditHandler = values => {
    return props.editPatient({ ...values, id: props.match.params.patientId })
  }

  return props.edit ? (
    <PatientSubmit onSubmit={PatientEditHandler} edit />
  ) : (
    <PatientSubmit onSubmit={PatientPostHandler} />
  )
}

export default connect(null, { postPatient, editPatient })(PatientForm)
