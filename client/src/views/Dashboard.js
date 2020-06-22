import React, { useEffect, useState } from 'react'
import { Grid, Typography, Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Patients from '../components/dashboard/Patients'
import { fetchInstitution } from '../actions/dashboardActions'
import { connect } from 'react-redux'
import LastUsersResults from '../components/results/LastUsersResults'
import Matrixes from '../components/dashboard/Matrixes'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import SelectInstitutionDialog from '../components/utils/SelectInstitutionDialog'
import TabPanel from '../components/utils/TabPanel'
import LastInstitutionsResults from '../components/results/LastInstitutionsResults'
import NoInstitution from './NoInstitution'
import MainTemplate from '../templates/MainTemplate'
import CenteredLoader from '../components/utils/CenteredLoader'

const styles = (theme) => ({
  lastResults: {
    marginLeft: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
  },
  institution: {
    cursor: 'pointer',
    '&:hover': {
      color: '#555',
    },
  },
})

const Dashboard = ({
  fetchInstitution,
  classes,
  selectedInstitution,
  isInstitutionFetching,
  isAuthenticated,
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = React.useState(0)

  useEffect(() => {
    fetchInstitution()
  }, [])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      {isAuthenticated && (
        <>
          {selectedInstitution ? (
            <MainTemplate>
              <>
                <Grid item xs={12}>
                  <Typography
                    component="h4"
                    variant="h4"
                    gutterBottom
                    className={classes.institution}
                    onClick={handleClickOpen}
                  >
                    Institution: {selectedInstitution.name}{' '}
                    <ArrowDropDownIcon />
                  </Typography>
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Patients />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Matrixes />
                </Grid>
                <Grid item xs={12}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="results"
                  >
                    <Tab label="Institution" />
                    <Tab label="Yours" />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <LastInstitutionsResults />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <LastUsersResults />
                  </TabPanel>
                </Grid>
              </>
            </MainTemplate>
          ) : (
            <>
              {isInstitutionFetching ? <CenteredLoader /> : <NoInstitution />}
            </>
          )}
          <SelectInstitutionDialog open={open} handleClose={handleClose} />
        </>
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedInstitution: state.dashboard.selectedInstitution,
    isInstitutionFetching: state.dashboard.isInstitutionFetching,
    isAuthenticated: state.auth.isAuthenticated,
  }
}

const DashboardWithStyles = withStyles(styles)(Dashboard)

export default connect(mapStateToProps, { fetchInstitution })(
  DashboardWithStyles
)
