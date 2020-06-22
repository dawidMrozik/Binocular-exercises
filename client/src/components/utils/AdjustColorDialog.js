import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles, Typography } from '@material-ui/core'
import { SketchPicker } from 'react-color'
import { connect } from 'react-redux'
import { changeColors } from '../../actions/colorsActions'

const styles = (theme) => ({
  container: {
    display: 'flex',
  },
  picker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  overview: {
    width: '200px',
    height: '200px',
    marginBottom: '25px',
    borderRadius: '50%',
  },
})

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const AdjustColorDialog = (props) => {
  const { colors, classes } = props

  const [state, setState] = useState({
    open: false,
    firstColor: colors.first,
    secondColor: colors.second,
  })

  const handleClickOpen = () => {
    setState({ ...state, open: true })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const handleFirstChange = (color) => {
    setState({ ...state, firstColor: color.hex })
  }

  const handleSecondChange = (color) => {
    setState({ ...state, secondColor: color.hex })
  }

  const handleSaveColors = () => {
    props.changeColors(state.firstColor, state.secondColor)
    setState({ ...state, open: false })
  }

  return (
    <>
      <MenuItem onClick={handleClickOpen}>Adjust colors</MenuItem>
      <Dialog
        open={state.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="Adjust colors"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Adjusting colors
        </DialogTitle>
        <DialogContent>
          <div className={classes.container}>
            <div className={classes.picker} style={{ marginRight: '50px' }}>
              <Typography variant="caption" gutterBottom>
                Red points
              </Typography>
              <div
                className={classes.overview}
                style={{ backgroundColor: state.firstColor }}
              />
              <SketchPicker
                color={state.firstColor}
                onChange={handleFirstChange}
                presetColors={[]}
                disableAlpha
                width="200px"
              />
            </div>
            <div className={classes.picker}>
              <Typography variant="caption" gutterBottom>
                Green points
              </Typography>
              <div
                className={classes.overview}
                style={{ backgroundColor: state.secondColor }}
              />
              <SketchPicker
                color={state.secondColor}
                onChange={handleSecondChange}
                presetColors={[]}
                disableAlpha
                width="200px"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveColors} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const mapStateToProps = (state) => ({
  colors: state.colors,
})

const AdjustColorDialogRedux = connect(mapStateToProps, { changeColors })(
  AdjustColorDialog
)

export default withStyles(styles)(AdjustColorDialogRedux)
