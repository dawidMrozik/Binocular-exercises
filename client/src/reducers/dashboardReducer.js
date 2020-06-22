import {
  FETCHING_INSTITUTIONS,
  FETCHING_PATIENTS,
  FETCH_INSTITUTIONS,
  FETCH_PATIENTS,
  FETCH_PATIENTS_ERRORS,
  FETCH_USERS_RESULTS,
  FETCH_USERS_RESULTS_ERRORS,
  FETCHING_USERS_RESULTS,
  EDIT_PATIENT,
  SEARCH_PATIENTS,
  SEARCHING_PATIENTS,
  SEARCH_PATIENTS_ERRORS,
  SELECT_INSTITUTION,
  CLEAR_INSTITUTION,
  POST_INSTITUTION,
  EDIT_INSTITUTION,
  FETCHING_INSTITUTION_USERS,
  FETCH_INSTITUTION_USERS,
  FETCHING_USERS,
  FETCH_USERS,
  ATTACH_INSTITUTION_USERS,
  DETTACH_INSTITUTION_USERS,
  FETCH_INSTITUTIONS_RESULTS,
  FETCHING_INSTITUTIONS_RESULTS
} from '../actions/types'

const initialState = {
  isInstitutionFetching: false,
  isUsersFetching: false,
  isUsersResultsFetching: false,
  usersResultsErrors: null,
  isPatientsFetching: false,
  foundPatients: null,
  users: null,
  isPatientsSearching: false,
  patientsSearchError: null,
  newInstitution: null,
  patientsError: null,
  institutions: null,
  isInstitutionsResultsFetching: false,
  institutionsResults: null,
  selectedInstitution: null,
  patients: {
    data: [],
    count: 0
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_INSTITUTIONS:
      return {
        ...state,
        isInstitutionFetching: true
      }
    case FETCH_INSTITUTIONS:
      return {
        ...state,
        isInstitutionFetching: false,
        institutions: action.payload
      }
    case SELECT_INSTITUTION:
      return {
        ...state,
        selectedInstitution: action.payload
      }
    case FETCHING_PATIENTS:
      return {
        ...state,
        isPatientsFetching: true
      }
    case FETCH_PATIENTS:
      return {
        ...state,
        isPatientsFetching: false,
        patients: action.payload
      }
    case FETCH_PATIENTS_ERRORS:
      return {
        ...state,
        isPatientsFetching: false,
        patientsError: action.payload
      }
    case FETCHING_USERS_RESULTS:
      return {
        ...state,
        isUsersResultsFetching: true
      }
    case FETCH_USERS_RESULTS:
      return {
        ...state,
        isUsersResultsFetching: false,
        usersResults: action.payload
      }
    case FETCH_USERS_RESULTS_ERRORS:
      return {
        ...state,
        isUsersResultsFetching: false,
        usersResultsErrors: action.payload
      }
    case EDIT_PATIENT:
      return {
        ...state
      }
    case SEARCH_PATIENTS:
      return {
        ...state,
        isPatientsSearching: false,
        foundPatients: action.payload
      }
    case SEARCHING_PATIENTS:
      return {
        ...state,
        isPatientsSearching: true
      }
    case SEARCH_PATIENTS_ERRORS:
      return {
        ...state,
        isPatientsSearching: false,
        patientsSearchError: action.payload
      }
    case CLEAR_INSTITUTION:
      return {
        ...state,
        newInstitution: null
      }
    case POST_INSTITUTION:
      return {
        ...state,
        newInstitution: action.payload
      }
    case EDIT_INSTITUTION:
      return {
        ...state,
        newInstitution: action.payload
      }
    case FETCHING_INSTITUTION_USERS:
      return {
        ...state,
        isInstitutionUsersFetching: true
      }
    case FETCH_INSTITUTION_USERS:
      return {
        ...state,
        isInstitutionFetching: false,
        institutionUsers: action.payload
      }
    case FETCHING_USERS:
      return {
        ...state,
        isUsersFetching: true
      }
    case FETCH_USERS:
      return {
        ...state,
        users: action.payload,
        isUsersFetching: false
      }
    case ATTACH_INSTITUTION_USERS:
      return {
        ...state,
        institutionUsers: [...state.institutionUsers, action.payload]
      }
    case DETTACH_INSTITUTION_USERS:
      return {
        ...state,
        institutionUsers: state.institutionUsers.filter(
          u => u.id !== Number(action.payload.id)
        )
      }
    case FETCHING_INSTITUTIONS_RESULTS:
      return {
        ...state,
        isInstitutionsResultsFetching: true
      }
    case FETCH_INSTITUTIONS_RESULTS:
      return {
        ...state,
        institutionsResults: action.payload,
        isInstitutionsResultsFetching: false
      }
    default:
      return state
  }
}
