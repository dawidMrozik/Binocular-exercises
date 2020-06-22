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

import { login } from '../actions/authActions'
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

const Login = ({ classes, errors, login }) => {
  const [state, setState] = useState({ email: '', password: '', msg: null })

  const onSubmit = (e) => {
    e.preventDefault()
    const { email, password } = state

    // Create user object
    const user = {
      email,
      password,
    }

    login(user)
  }

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
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
        Sign in
      </Typography>
      <form onSubmit={onSubmit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <Input
            id="email"
            name="email"
            autoComplete="email"
            onChange={onChange}
            required
            autoFocus
          />
          <FormHelperText error>{renderEmailErrors()}</FormHelperText>
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            required
            autoComplete="current-password"
            onChange={onChange}
          />
          <FormHelperText error>{renderPasswordErrors()}</FormHelperText>
        </FormControl>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign in
        </Button>
      </form>
      <p className={classes.link} onClick={() => history.push('/register')}>
        Dont have an account yet? Sign up now!
      </p>
    </FormTemplate>
  )
}

const mapStateToProps = (state) => {
  return {
    errors: state.error,
  }
}

const LoginWithStyles = withStyles(styles)(Login)

export default connect(mapStateToProps, { login })(LoginWithStyles)
