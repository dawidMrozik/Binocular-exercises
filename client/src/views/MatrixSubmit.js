import React from 'react'
import {
  Grid,
  withStyles,
  Typography,
  Button,
  TextField,
  Select,
  FormHelperText,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@material-ui/core'
import { reduxForm, Field } from 'redux-form'
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
  selectDiff: {
    width: '100%',
  },
  matrixName: {
    width: '100%',
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

const renderFromHelper = ({ touched, error }) => {
  if (!(touched && error)) {
    return
  } else {
    return <FormHelperText>{touched && error}</FormHelperText>
  }
}

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <FormControl error={touched && error} style={{ width: '100%' }}>
    <InputLabel htmlFor="difficulty">Difficulty</InputLabel>
    <Select
      native
      {...input}
      {...custom}
      inputProps={{
        name: 'difficulty',
        id: 'difficulty',
      }}
    >
      {children}
    </Select>
    {renderFromHelper({ touched, error })}
  </FormControl>
)

const MatrixSubmit = (props) => {
  const { classes, handleSubmit, submitting } = props

  return (
    <FormTemplate>
      <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
        <>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Typography variant="h6" gutterBottom>
                  Enter matrix name
                </Typography>
                <Field
                  required
                  id="name"
                  name="name"
                  label="Matrix name"
                  fullWidth
                  component={renderTextField}
                  className={classes.matrixName}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl className={classes.field}>
                <Typography variant="h6" gutterBottom>
                  Select difficulty
                </Typography>
                <Field
                  required
                  name="difficulty"
                  component={renderSelectField}
                  label="Difficulty"
                  fullWidth
                  className={classes.selectDiff}
                >
                  <option value="" disabled></option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Field>
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
                  disabled={submitting}
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

const createReduxForm = reduxForm({ form: 'newMatrix' })
const NewMatrixForm = createReduxForm(MatrixSubmit)
const NewMatrixFormWithStyles = withStyles(styles)(NewMatrixForm)

export default NewMatrixFormWithStyles
