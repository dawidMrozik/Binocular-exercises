import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  List,
  ListSubheader,
  withStyles,
  Grid,
  Button,
} from '@material-ui/core'
import { searchMatrixes } from '../../actions/matrixActions'
import MatrixItem from './MatrixItem'
import { Link } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(1),
  },
  matrixListContainer: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(3),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#fcfcfc',
    '&:hover': {
      backgroundColor: '#fafafa',
    },
    width: '100%',
    marginRight: theme.spacing(2),
    marginLeft: 0,
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
})

const renderMatrixesList = (props, patientId) => {
  const { classes, matrixes } = props
  const handleSearch = (e) => {
    const q = e.target.value
    props.searchMatrixes(q)
  }

  if (matrixes) {
    return (
      <>
        <ListSubheader>Plansze:</ListSubheader>
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
            <MatrixItem key={matrix.id} matrix={matrix} patientId={patientId} />
          ))}
        </List>
      </>
    )
  }
}

const MatrixList = (props) => {
  const { classes, institutionId } = props
  const {
    match: { params },
  } = props

  const ButtonLink = (props) => (
    <Link to={`/institutions/${institutionId}/matrixes/new`} {...props} />
  )

  useEffect(() => {
    props.searchMatrixes('')
  }, [])

  return (
    <Grid container justify="center" className={classes.matrixListContainer}>
      <Grid xs={10} xl={6} item>
        <Paper>
          {renderMatrixesList(props, params.patientId)}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            component={ButtonLink}
          >
            Add new matrix
          </Button>
        </Paper>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    matrixes: state.matrix.foundMatrixes,
    institutionId: state.dashboard.selectedInstitution.id,
  }
}

const MatrixListWithStyles = withStyles(styles)(MatrixList)

export default connect(mapStateToProps, { searchMatrixes })(
  MatrixListWithStyles
)
