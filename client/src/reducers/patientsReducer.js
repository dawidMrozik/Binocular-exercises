import {
  FETCHING_PATIENT,
  FETCH_PATIENT,
  FETCH_PATIENT_ERRORS,
  POST_PATIENT,
  POST_PATIENT_ERRORS,
  FETCHING_PATIENT_RESULTS,
  FETCH_PATIENT_RESULTS,
  FETCH_PATIENT_RESULTS_ERRORS,
  CLEAR_PATIENT,
  EDIT_PATIENT
} from '../actions/types'

const INITIAL_STATE = {
  isPatientFetching: false,
  patient: null,
  patientError: null,
  postedPatient: null,
  errors: null,
  isFetchingPatientResults: false,
  results: null,
  resultsErrors: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_PATIENT:
      return {
        ...state,
        isPatientFetching: true
      }
    case FETCH_PATIENT:
      return {
        ...state,
        isPatientFetching: false,
        patient: action.payload
      }
    case FETCH_PATIENT_ERRORS:
      return {
        ...state,
        isPatientFetching: false,
        patientError: action.payload
      }
    case POST_PATIENT:
      return {
        ...state,
        postedPatient: action.payload
      }
    case EDIT_PATIENT:
      return {
        ...state,
        postedPatient: action.payload
      }
    case POST_PATIENT_ERRORS:
      return {
        ...state,
        errors: action.payload
      }
    case FETCHING_PATIENT_RESULTS:
      return {
        ...state,
        isFetchingPatientResults: true
      }
    case FETCH_PATIENT_RESULTS:
      return {
        ...state,
        results: action.payload
      }
    case FETCH_PATIENT_RESULTS_ERRORS:
      return {
        ...state,
        resultsErrors: action.payload
      }
    case CLEAR_PATIENT:
      return {
        ...state,
        patient: null
      }
    default:
      return state
  }
}
