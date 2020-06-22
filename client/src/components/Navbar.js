import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MoreIcon from '@material-ui/icons/MoreVert'
import history from '../history'

import { Link } from 'react-router-dom'
import '../styles.css'
import { connect } from 'react-redux'
import { logout } from '../actions/authActions'
import AdjustColorDialog from './utils/AdjustColorDialog'

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline-block',
      marginRight: theme.spacing(1),
    },
  },
  brandName: {
    textDecoration: 'none',
    color: theme.palette.common.white,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
})

const Navbar = ({ logout, user, classes, institution }) => {
  const [state, setState] = useState({
    anchorEl: null,
    anchorMoreEl: null,
    mobileMoreAnchorEl: null,
  })

  const handleProfileMenuOpen = (event) => {
    setState({ anchorEl: event.currentTarget })
  }

  const handleMoreMenuOpen = (event) => {
    setState({ anchorMoreEl: event.currentTarget })
  }

  const handleMenuClose = () => {
    setState({ anchorEl: null, anchorMoreEl: null })
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setState({ mobileMoreAnchorEl: event.currentTarget })
  }

  const handleMobileMenuClose = () => {
    setState({ mobileMoreAnchorEl: null })
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  const renderProfileMenu = () => {
    const { anchorEl } = state
    const isMenuOpen = Boolean(anchorEl)

    if (user) {
      return (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>{user.firstname}</MenuItem>
          {institution && (
            <MenuItem onClick={() => history.push('/institution')}>
              Institution
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      )
    } else {
      return (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Link className="profile-link" to="/login">
              Sign in
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link className="profile-link" to="/register">
              Sign up
            </Link>
          </MenuItem>
        </Menu>
      )
    }
  }

  const renderMoreMenu = () => {
    const { anchorMoreEl } = state
    const isMenuOpen = Boolean(anchorMoreEl)

    if (user) {
      return (
        <Menu
          anchorEl={anchorMoreEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <AdjustColorDialog />
          <MenuItem onClick={handleMenuClose}>Close</MenuItem>
        </Menu>
      )
    }
  }

  const { anchorEl, mobileMoreAnchorEl } = state
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const renderMenu = renderProfileMenu()

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>

      <MenuItem onClick={handleMoreMenuOpen}>
        <IconButton color="inherit">
          <MoreIcon />
        </IconButton>
        <p>More</p>
      </MenuItem>
    </Menu>
  )

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" className={classes.brandName}>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
            >
              Binocular exercises
            </Typography>
            <Typography
              className={classes.title}
              variant="subtitle2"
              color="inherit"
              noWrap
            >
              {institution && institution.name}
            </Typography>
          </Link>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-owns={isMenuOpen ? 'material-appbar' : undefined}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <IconButton
              aria-label="display more actions"
              edge="end"
              color="inherit"
              aria-haspopup="true"
              onClick={handleMoreMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMoreMenu()}
      {renderMobileMenu}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    theme: state.colors.theme,
    institution: state.dashboard.selectedInstitution,
  }
}

const NavbarWithStyles = withStyles(styles)(Navbar)

export default connect(mapStateToProps, { logout })(NavbarWithStyles)
