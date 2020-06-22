import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import store from '../../store'
import { CLEAR_INSTITUTION } from '../../actions/types'
import InstitutionSubmit from '../../views/InstitutionSubmit'
import {
  postInstitution,
  editInstitution
} from '../../actions/dashboardActions'

const InstitutionForm = props => {
  useEffect(() => {
    if (!props.edit) {
      store.dispatch({ type: CLEAR_INSTITUTION })
    }
  }, [])

  const InstitutionPostHandler = values => {
    return props.postInstitution(values)
  }

  const InstitutionEditHandler = values => {
    return props.editInstitution({
      ...values,
      id: props.match.params.institutionId
    })
  }

  return props.edit ? (
    <InstitutionSubmit onSubmit={InstitutionEditHandler} edit />
  ) : (
    <InstitutionSubmit onSubmit={InstitutionPostHandler} />
  )
}

export default connect(null, { postInstitution, editInstitution })(
  InstitutionForm
)
