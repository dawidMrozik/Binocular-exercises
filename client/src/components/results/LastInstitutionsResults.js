import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchInstituionsResults } from '../../actions/dashboardActions'
import ResultItem from './ResultItem'
import { Typography } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const renderInstitutionsResultsList = (institutionsResults) => {
  return institutionsResults ? (
    <>
      <Typography variant="caption">Latest exercise results</Typography>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: '650px' }} aria-label="Latest results">
          <TableHead>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell>Matrix</TableCell>
              <TableCell align="right">Patient</TableCell>
              <TableCell align="right">Red points</TableCell>
              <TableCell align="right">Green points</TableCell>
              <TableCell align="right">Points missed</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institutionsResults.map((result) => (
              <ResultItem key={result.id} result={result} withPatient />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    'Brak wyników'
  )
}

const LastInstitutionsResults = (props) => {
  useEffect(() => {
    props.fetchInstituionsResults()
  }, [props.selectedInstitution])

  return renderInstitutionsResultsList(props.institutionsResults)
}

const mapStateToProps = (state) => {
  return {
    institutionsResults: state.dashboard.institutionsResults,
    selectedInstitution: state.dashboard.selectedInstitution.id,
  }
}

export default connect(mapStateToProps, {
  fetchInstituionsResults,
})(LastInstitutionsResults)
