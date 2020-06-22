import React, { useEffect, useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import { connect } from 'react-redux'
import { fetchPatients } from '../actions/dashboardActions'
import { fetchMatrixes } from '../actions/matrixActions'
import MainTemplate from '../templates/MainTemplate'
import { Paper, Typography, withStyles } from '@material-ui/core'

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  title: {
    backgroundColor: '#fafafa',
    padding: theme.spacing(2),
  },
})

const PaginationTable = (props) => {
  const { resource, patients, matrixes, classes } = props
  const institutionId = props.match.params.institutionId

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const f = async () => {
      switch (resource) {
        case 'patients':
          props.fetchPatients(institutionId, page, rowsPerPage)
          setColumns([
            { id: 'firstname', label: 'Firstname', minWidth: 170 },
            { id: 'lastname', label: 'Lastname', minWidth: 100 },
            {
              id: 'dysfunction',
              label: 'Dysfunction',
              minWidth: 170,
              align: 'right',
            },
            {
              id: 'description',
              label: 'Description',
              minWidth: 170,
              align: 'right',
            },
            {
              id: 'created_at',
              label: 'Created at',
              minWidth: 170,
              align: 'right',
            },
            {
              id: 'updated_at',
              label: 'Updated at',
              minWidth: 170,
              align: 'right',
            },
          ])
          break
        case 'matrixes':
          props.fetchMatrixes(institutionId, page, rowsPerPage)
          setColumns([
            { id: 'name', label: 'Name', minWidth: 170 },
            { id: 'difficulty', label: 'Difficulty', minWidth: 100 },
            {
              id: 'red_points',
              label: 'Red points',
              minWidth: 170,
              align: 'right',
            },
            {
              id: 'green_points',
              label: 'Green points',
              minWidth: 170,
              align: 'right',
            },
          ])
          break
        default:
          break
      }
    }

    f()
  }, [page, rowsPerPage])

  if (resource === 'patients') {
    useEffect(() => {
      setData(patients.data)
      setCount(patients.count)
    }, [patients])
  }

  if (resource === 'matrixes') {
    useEffect(() => {
      setData(matrixes.data)
      setCount(matrixes.count)
    }, [matrixes])
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <MainTemplate>
      <Paper>
        <Typography variant="h6" className={classes.title}>
          {resource === 'patients' && 'Patient list'}
          {resource === 'matrixes' && 'Matrix list'}
        </Typography>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label={resource}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </MainTemplate>
  )
}

const mapStateToProps = (state) => ({
  matrixes: state.matrix.matrixList,
  patients: state.dashboard.patients,
})

const PaginationTableWithStyles = withStyles(styles)(PaginationTable)

export default connect(mapStateToProps, { fetchMatrixes, fetchPatients })(
  PaginationTableWithStyles
)
