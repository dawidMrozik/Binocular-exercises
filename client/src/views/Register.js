import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import FormHelperText from '@material-ui/core/FormHelperText'
import history from '../history'

import { register } from '../actions/authActions'
import { connect } from 'react-redux'
import FormTemplate from '../templates/FormTemplate'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  avatar: {
    margin: '0 auto',
    backgroundColor: theme.palette.secondary.main,
  },
  header: {
    textAlign: 'center',
  },
  link: {
    marginTop: theme.spacing(4),
    cursor: 'pointer',
  },
})

const Register = ({ classes, errors, register }) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    msg: null,
  })

  const onSubmit = (e) => {
    e.preventDefault()
    const { firstname, lastname, email, password } = state

    // Create user object
    const newUser = {
      firstname,
      lastname,
      email,
      password,
    }

    register(newUser)
  }

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const renderFirstnameErrors = () => {
    if (errors.msg.firstname) {
      return Object.values(errors.msg.firstname)
    }
  }

  const renderLastnameErrors = () => {
    if (errors.msg.lastname) {
      return Object.values(errors.msg.lastname)
    }
  }

  const renderEmailErrors = () => {
    if (errors.msg.email) {
      return Object.values(errors.msg.email)
    }
  }

  const renderPasswordErrors = () => {
    if (errors.msg.password) {
      return Object.values(errors.msg.password)
    }
  }

  return (
    <FormTemplate>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>
        Sign up
      </Typography>
      <form onSubmit={onSubmit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="firstname">Firstname</InputLabel>
          <Input
            id="firstname"
            name="firstname"
            autoComplete="firstname"
            onChange={onChange}
            autoFocus
          />
          <FormHelperText error>{renderFirstnameErrors()}</FormHelperText>
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="lastname">Lastname</InputLabel>
          <Input
            id="lastname"
            name="lastname"
            autoComplete="lastname"
            onChange={onChange}
          />
          <FormHelperText error>{renderLastnameErrors()}</FormHelperText>
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            name="email"
            autoComplete="email"
            onChange={onChange}
          />
          <FormHelperText error>{renderEmailErrors()}</FormHelperText>
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={onChange}
          />
          <FormHelperText error>{renderPasswordErrors()}</FormHelperText>
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign up
        </Button>
      </form>
      <p className={classes.link} onClick={() => history.push('/login')}>
        Already have an account? Sign in
      </p>
    </FormTemplate>
  )
}

const mapStateToProps = (state) => {
  return {
    errors: state.error,
  }
}

const RegisterWithStyles = withStyles(styles)(Register)

export default connect(mapStateToProps, { register })(RegisterWithStyles)
