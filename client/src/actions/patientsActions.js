import {
  FETCH_PATIENT,
  FETCHING_PATIENT,
  POST_PATIENT,
  EDIT_PATIENT,
  DELETE_PATIENT,
  FETCHING_PATIENT_RESULTS,
  FETCH_PATIENT_RESULTS,
  GET_SUCCESS,
} from './types'
import api from '../api'
import history from '../history'
import { SubmissionError } from 'redux-form'
import { returnErrors } from './errorActions'

export const fetchPatient = (id) => async (dispatch) => {
  dispatch({ type: FETCHING_PATIENT })

  await api
    .get(`/patients/${id}`)
    .then((res) => {
      dispatch({
        type: FETCH_PATIENT,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const postPatient = ({
  firstname,
  lastname,
  dysfunction,
  description,
}) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const institutionId = getState().dashboard.selectedInstitution.id

  const body = {
    firstname,
    lastname,
    dysfunction,
    description,
    institution_id: institutionId,
  }

  await api
    .post('/patients', body, config)
    .then((res) => {
      dispatch({
        type: POST_PATIENT,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Patient added' },
      })

      history.push('/')
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))

      throw new SubmissionError(err.response.data.errors)
    })
}

export const fetchPatientResults = (id) => async (dispatch) => {
  dispatch({ type: FETCHING_PATIENT_RESULTS })

  await api
    .get(`/patients/${id}/results`)
    .then((res) => {
      dispatch({
        type: FETCH_PATIENT_RESULTS,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const editPatient = ({
  id,
  firstname,
  lastname,
  dysfunction,
  description,
}) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const institutionId = getState().dashboard.selectedInstitution.id

  const body = {
    firstname,
    lastname,
    dysfunction,
    description,
    institution_id: institutionId,
  }

  await api
    .put(`patients/${id}`, body, config)
    .then((res) => {
      dispatch({
        type: EDIT_PATIENT,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Patient updated' },
      })

      history.push(`/patients/${id}`)
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))

      throw new SubmissionError(err.response.data.errors)
    })
}

export const deletePatient = (id) => async (dispatch) => {
  api
    .delete(`/patients/${id}`)
    .then((res) => {
      dispatch({
        type: DELETE_PATIENT,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Patient deleted' },
      })

      history.push('/')
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}
