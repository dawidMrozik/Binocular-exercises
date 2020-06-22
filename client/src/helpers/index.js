import store from '../store'

//helper function to create 2d array
export function createArray(length) {
  var arr = new Array(length || 0),
    i = length

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1)
    while (i--) arr[length - 1 - i] = createArray.apply(this, args)
  }

  return arr
}

//initialize matrix with default points
export function createEmptyMatrix() {
  const arr = createArray(16, 21)

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      arr[i][j] = {
        isSelected: false,
        color: '#bbb'
      }
    }
  }

  return arr
}

//generate matrix string to recreate matrix in the future
export function generateMatrixString(matrix, withPointsCounts = false) {
  let matrixString = '@'
  const firstColor = store.getState().colors.first
  const secondColor = store.getState().colors.second
  let firstColorPointsCount = 0
  let secondColorPointsCount = 0

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j].isSelected) {
        switch (matrix[i][j].color) {
          case firstColor:
            matrixString += `|r/${i}/${j}/${firstColor}`
            firstColorPointsCount++
            break
          case secondColor:
            matrixString += `|g/${i}/${j}/${secondColor}`
            secondColorPointsCount++
            break
          default:
            break
        }
      }
    }
  }

  matrixString += '@'

  return withPointsCounts
    ? [matrixString, firstColorPointsCount, secondColorPointsCount]
    : matrixString
}

//prepare redux state based on provided string
export function encodeMatrixString(matrixString, returnPointsLeft = false) {
  let splitedMatrixString = ''
  //prepare empty 2d array
  let emptyMatrix = createEmptyMatrix()
  let redPoints = 0
  let greenPoints = 0

  let red = null
  let green = null
  //inital string validation - check first and last chars if they are '@'
  if (
    matrixString[0] === '@' &&
    matrixString[matrixString.length - 1] === '@'
  ) {
    //inital validation passed - remove '@' characters
    matrixString = matrixString.slice(1).slice(0, matrixString.length - 2)
    splitedMatrixString = matrixString.split('|')
    for (let i = 1; i < splitedMatrixString.length; i++) {
      let splitedUnit = splitedMatrixString[i].split('/')
      let row = splitedUnit[1]
      let col = splitedUnit[2]
      let color = splitedUnit[3]
      if (splitedUnit[0] === 'r') {
        emptyMatrix[row][col] = { isSelected: true, color }
        redPoints++
        red = color
      } else if (splitedUnit[0] === 'g') {
        emptyMatrix[row][col] = { isSelected: true, color }
        greenPoints++
        green = color
      }
    }
  }

  //if asked for points left with function arg then return array to destructure with [matrix, pointsLeft]
  return returnPointsLeft
    ? [
        emptyMatrix,
        splitedMatrixString.length - 1,
        redPoints,
        greenPoints,
        red,
        green
      ]
    : emptyMatrix
}
