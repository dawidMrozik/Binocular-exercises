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

const PatientSubmit = (props) => {
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
          Editing patient {initialValues.firstname} {initialValues.lastname}
        </Typography>
      )}
      {!edit && (
        <Typography variant="h6" gutterBottom>
          Add new patient
        </Typography>
      )}
      <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
        <>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  required
                  id="firstname"
                  name="firstname"
                  label="Firstname"
                  fullWidth
                  component={renderTextField}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  required
                  id="lastname"
                  name="lastname"
                  label="Lastname"
                  fullWidth
                  component={renderTextField}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Field
                  id="dysfunction"
                  name="dysfunction"
                  label="Dysfunction"
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
                  label="Description"
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
  form: 'newPatient',
  enableReinitialize: true,
  validate,
  touchOnBlur: false,
})(PatientSubmit)
const NewPatient = connect((state) => ({
  initialValues: state.patients.patient ? state.patients.patient.data : {},
}))(createReduxForm)
const NewPatientFormWithStyles = withStyles(styles)(NewPatient)

export default NewPatientFormWithStyles
