import React from 'react'
import {
  Grid,
  withStyles,
  Button,
  TextField,
  Typography,
  FormControl,
  CircularProgress,
} from '@material-ui/core'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { green } from '@material-ui/core/colors'
import history from '../history'
import FormTemplate from '../templates/FormTemplate'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})

const validate = (values) => {
  const errors = {}
  const requiredFields = ['firstname', 'lastname']
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })

  return errors
}

const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
)

const InstitutionSubmit = (props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    classes,
    edit,
    initialValues,
  } = props

  return (
    <FormTemplate>
      {edit && (
        <Typography variant="h6" gutterBottom>
          Editing institution {initialValues.name}
        </Typography>
      )}
      {!edit && (
        <Typography variant="h6" gutterBottom>
          Add new institution
        </Typography>
      )}
      <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
        <>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  required
                  id="name"
                  name="name"
                  label="Institution name"
                  fullWidth
                  component={renderTextField}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  component={renderTextField}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  component={renderTextField}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  id="postal_code"
                  name="postal_code"
                  label="Postal code"
                  fullWidth
                  component={renderTextField}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  id="description"
                  name="description"
                  label="Institution description"
                  fullWidth
                  component={renderTextField}
                />
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                  className={classes.margin}
                  disabled={pristine || submitting}
                >
                  Save
                </Button>
                {submitting && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </Grid>
          </Grid>
        </>
      </form>
    </FormTemplate>
  )
}

const createReduxForm = reduxForm({
  form: 'newInstitutions',
  enableReinitialize: true,
  validate,
  touchOnBlur: false,
})(InstitutionSubmit)

const NewInstitution = connect((state) => ({
  initialValues: history.location.pathname.includes('/new')
    ? {}
    : state.dashboard.selectedInstitution,
}))(createReduxForm)

const NewInstitutionFormWithStyles = withStyles(styles)(NewInstitution)

export default NewInstitutionFormWithStyles
