import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  List,
  ListSubheader,
  withStyles,
  Button,
} from '@material-ui/core'
import { searchMatrixes } from '../../actions/matrixActions'
import Matrix from './Matrix'
import { Link } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import history from '../../history'

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
  },
  matrixListContainer: {
    padding: theme.spacing.unit * 4,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fcfcfc',
    '&:hover': {
      backgroundColor: '#fafafa',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    width: '100%',
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

const renderMatrixesList = (props) => {
  const { classes, matrixes } = props
  const handleSearch = (e) => {
    const q = e.target.value
    props.searchMatrixes(q)
  }

  if (matrixes) {
    return (
      <>
        <ListSubheader>Matrixes</ListSubheader>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search matrixes"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearch}
          />
        </div>
        <List className={classes.root}>
          {matrixes.data.map((matrix) => (
            <Matrix key={matrix.id} matrix={matrix} />
          ))}
        </List>
      </>
    )
  }
}

const Matrixes = (props) => {
  const { classes, institutionId, selectedInstitution } = props

  const ButtonLink = (props) => (
    <Link to={`/institutions/${institutionId}/matrixes/new`} {...props} />
  )

  useEffect(() => {
    props.searchMatrixes('')
  }, [selectedInstitution])

  return (
    <Paper className={classes.matrixListContainer}>
      {renderMatrixesList(props)}
      <div className={classes.btnContainer}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          component={ButtonLink}
        >
          Add new matrix
        </Button>
        <Button
          variant="text"
          color="secondary"
          className={classes.button}
          onClick={() =>
            history.push(`/institutions/${selectedInstitution.id}/matrixes`)
          }
        >
          Show all
        </Button>
      </div>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    matrixes: state.matrix.foundMatrixes,
    selectedInstitution: state.dashboard.selectedInstitution,
  }
}

const MatrixListWithStyles = withStyles(styles)(Matrixes)

export default connect(mapStateToProps, { searchMatrixes })(
  MatrixListWithStyles
)
