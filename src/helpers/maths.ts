export const maths = {
  rotateMatrixRight: (matrix: boolean[][]) => {
    return matrix.map((_, index) => matrix.map(row => row[index]).reverse())
  },
  rotateMatrixLeft: (matrix: boolean[][]) => {
    return matrix.map((_, index) => matrix.map(row => row[row.length - 1 - index]))
  },
  transpose: (matrix: boolean[][]) => {
    return matrix.map((row, rowIndex) => row.map((_, colIndex) => matrix[colIndex][rowIndex]))
  }
}
