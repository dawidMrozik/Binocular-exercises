import React, { useEffect } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import history from '../history'
import store from '../store'
import PrivateRoute from './auth/PrivateRoute'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'

import Login from '../views/Login'
import Register from '../views/Register'
import Dashboard from '../views/Dashboard'
import Patient from '../views/Patient'
import MatrixList from './matrixes/MatrixList'
import MatrixOverview from '../views/MatrixOverview'
import CssBaseline from '@material-ui/core/CssBaseline'
import NewMatrix from '../views/NewMatrix'
import MatrixForm from './matrixes/MatrixForm'
import MatrixSolver from '../views/MatrixSolver'
import PatientForm from './patients/PatientForm'
import InstitutionOverview from '../views/InstitutionOverview'
import {
  CLEAR_ERROR_STATUS,
  CLEAR_ERRORS,
  CLEAR_SUCCESS
} from '../actions/types'
import { initColors } from '../actions/colorsActions'
import CenteredLoader from './utils/CenteredLoader'
import InstitutionForm from './institution/InstitutionForm'
import PaginationTable from '../views/PaginationTable'

const App = props => {
  const {
    initColors,
    error,
    enqueueSnackbar,
    success,
    isAuthenticated,
    isLoading
  } = props
  useEffect(() => {
    // store.dispatch(loadUser())
    initColors()

    // clear errors on any route change
    history.listen((location, action) => {
      store.dispatch({ type: CLEAR_ERRORS })
    })
  }, [])

  const showErrorAlert = () => {
    if (error.status) {
      Object.values(error.msg).map(item =>
        item.map(err =>
          enqueueSnackbar(err, {
            variant: 'error'
          })
        )
      )

      store.dispatch({ type: CLEAR_ERROR_STATUS })
    }
  }

  const showSuccessAlert = () => {
    const msg = success.msg
    if (msg) {
      enqueueSnackbar(msg, {
        variant: 'success'
      })

      store.dispatch({ type: CLEAR_SUCCESS })
    }
  }

  if (isLoading) return <CenteredLoader />

  return (
    <>
      <CssBaseline />
      {showErrorAlert()}
      {showSuccessAlert()}
      <Router history={history}>
        <Switch>
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/"
            exact
            component={Dashboard}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institution"
            exact
            component={InstitutionOverview}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/solve"
            exact
            component={MatrixSolver}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/patients/:patientId/selectMatrix"
            exact
            component={MatrixList}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/patients/:patientId"
            exact
            component={Patient}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/matrixes/:matrixId"
            exact
            component={MatrixOverview}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/patients/:patientId/matrixes/:matrixId/test"
            exact
            component={MatrixSolver}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/new"
            exact
            component={InstitutionForm}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/:institutionId/edit"
            exact
            component={props => <InstitutionForm {...props} edit />}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/:institutionId/patients"
            exact
            component={props => (
              <PaginationTable {...props} resource="patients" />
            )}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/:institutionId/patients/new"
            exact
            component={PatientForm}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/:institutionId/patients/:patientId/edit"
            exact
            component={props => <PatientForm {...props} edit />}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/:institutionId/matrixes"
            exact
            component={props => (
              <PaginationTable {...props} resource="matrixes" />
            )}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/:institutionId/matrixes/new"
            exact
            component={NewMatrix}
          />
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            path="/institutions/:institutionId/matrixes/finalize"
            exact
            component={MatrixForm}
          />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Switch>
      </Router>
    </>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    theme: state.colors.theme,
    error: state.error,
    success: state.success,
    isLoading: state.auth.isLoading,
    isInstitutionFetching: state.dashboard.isInstitutionFetching
  }
}

export default withSnackbar(connect(mapStateToProps, { initColors })(App))
