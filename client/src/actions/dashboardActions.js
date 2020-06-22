import api from '../api'
import {
  FETCHING_INSTITUTIONS,
  FETCHING_PATIENTS,
  FETCH_INSTITUTIONS,
  FETCH_PATIENTS,
  FETCHING_USERS_RESULTS,
  FETCH_USERS_RESULTS,
  SEARCHING_PATIENTS,
  SEARCH_PATIENTS,
  SELECT_INSTITUTION,
  POST_INSTITUTION,
  GET_SUCCESS,
  EDIT_INSTITUTION,
  FETCH_INSTITUTION_USERS,
  FETCHING_INSTITUTION_USERS,
  ATTACH_INSTITUTION_USERS,
  DETTACH_INSTITUTION_USERS,
  FETCHING_USERS,
  FETCH_USERS,
  FETCH_INSTITUTIONS_RESULTS,
  FETCHING_INSTITUTIONS_RESULTS,
  LOGOUT_SUCCESS,
} from './types'
import { returnErrors } from './errorActions'
import history from '../history'
import { SubmissionError } from 'redux-form'

export const fetchInstitution = () => async (dispatch, getState) => {
  const userId = getState().auth.user.id

  dispatch({ type: FETCHING_INSTITUTIONS })

  await api
    .get(`/users/${userId}/institutions`)
    .then((res) => {
      const institutions = res.data.data
      const selectedInstitutionLS = localStorage.getItem('institution')

      dispatch({
        type: FETCH_INSTITUTIONS,
        payload: institutions,
      })

      if (!selectedInstitutionLS) {
        if (institutions.length !== 0) {
          const institutionId = institutions[0].id
          localStorage.setItem('institution', institutionId)
          dispatch({ type: SELECT_INSTITUTION, payload: institutions[0] })
        }
      } else {
        dispatch({
          type: SELECT_INSTITUTION,
          payload: institutions.find(
            (i) => i.id === Number(selectedInstitutionLS)
          ),
        })
      }
    })
    .catch((err) => {
      if (err.response.status === 401) dispatch({ type: LOGOUT_SUCCESS })
      else dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCHING_USERS })

  await api
    .get(`/users`)
    .then((res) => {
      dispatch({
        type: FETCH_USERS,
        payload: res.data.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const attachUserToInstitution = (id) => async (dispatch, getState) => {
  const institutionId = getState().dashboard.selectedInstitution.id

  await api
    .post(`/institutions/${institutionId}/attachUser/${id}`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      console.log('sen t', res.data.data)
      dispatch({ type: ATTACH_INSTITUTION_USERS, payload: res.data.data })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const dettachUserToInstitution = (id) => async (dispatch, getState) => {
  const institutionId = getState().dashboard.selectedInstitution.id

  await api
    .post(`/institutions/${institutionId}/detachUser/${id}`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      dispatch({ type: DETTACH_INSTITUTION_USERS, payload: res.data.data })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const selectInstituiton = (institution) => (dispatch) => {
  localStorage.setItem('institution', institution.id)
  dispatch({ type: SELECT_INSTITUTION, payload: institution })
}

export const postInstitution = ({
  name,
  address,
  city,
  postal_code,
  description,
}) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const userId = getState().auth.user.id

  const body = {
    name,
    address,
    city,
    postal_code,
    description,
    userId,
  }

  await api
    .post('/institutions', body, config)
    .then((res) => {
      dispatch({
        type: POST_INSTITUTION,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Institution added' },
      })

      selectInstituiton(res.data)

      history.push('/')
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))

      throw new SubmissionError(err.response.data.errors)
    })
}

export const editInstitution = ({
  name,
  address,
  city,
  postal_code,
  description,
  id,
}) => async (dispatch, getState) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = {
    name,
    address,
    city,
    postal_code,
    description,
  }

  await api
    .put(`/institutions/${id}`, body, config)
    .then((res) => {
      dispatch({
        type: EDIT_INSTITUTION,
        payload: res.data,
      })

      dispatch({
        type: GET_SUCCESS,
        payload: { msg: 'Institution updated' },
      })

      history.push('/')
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))

      throw new SubmissionError(err.response.data.errors)
    })
}

export const fetchInstitutionUsers = () => async (dispatch, getState) => {
  const institutionId = getState().dashboard.selectedInstitution.id

  dispatch({ type: FETCHING_INSTITUTION_USERS })

  await api
    .get(`/institutions/${institutionId}/users`)
    .then((res) => {
      dispatch({
        type: FETCH_INSTITUTION_USERS,
        payload: res.data.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const fetchPatients = (institutionId, page, perPage) => async (
  dispatch
) => {
  dispatch({ type: FETCHING_PATIENTS })

  const start = page * perPage
  const end = start + perPage

  await api
    .get(`/institutions/${institutionId}/patients?range=[${start},${end}]`)
    .then((res) => {
      dispatch({
        type: FETCH_PATIENTS,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const fetchUsersResults = () => async (dispatch, getState) => {
  const userId = getState().auth.user.id
  dispatch({ type: FETCHING_USERS_RESULTS })

  await api
    .get(`/users/${userId}/results?latest=5`)
    .then((res) => {
      dispatch({
        type: FETCH_USERS_RESULTS,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))

      console.log(err)
    })
}

export const fetchInstituionsResults = () => async (dispatch, getState) => {
  const institutionId = getState().dashboard.selectedInstitution.id
  dispatch({ type: FETCHING_INSTITUTIONS_RESULTS })

  await api
    .get(`/institutions/${institutionId}/results?latest=5`)
    .then((res) => {
      dispatch({
        type: FETCH_INSTITUTIONS_RESULTS,
        payload: res.data.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}

export const searchPatients = (query) => async (dispatch, getState) => {
  const institutionId = getState().dashboard.selectedInstitution.id

  dispatch({ type: SEARCHING_PATIENTS })

  await api
    .get(`/institutions/${institutionId}/patients/search?q=${query}`)
    .then((res) => {
      dispatch({
        type: SEARCH_PATIENTS,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data.errors, err.response.status))
    })
}
