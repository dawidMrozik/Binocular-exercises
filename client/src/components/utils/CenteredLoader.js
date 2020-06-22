import React from 'react'
import { CircularProgress } from '@material-ui/core'

const CenteredLoader = () => {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <CircularProgress
        style={{
          margin: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  )
}

export default CenteredLoader
