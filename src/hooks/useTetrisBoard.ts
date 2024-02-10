import { useReducer } from 'react'
import { type Board, EMPTY_CELL, type Block, HorizontalMovement, type Cell, type Coordinates } from '../types.d'
import { maths } from '../helpers/maths'

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

const EMPTY_BOARD: Board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))

interface DroppingBlock {
  block: Block
  row: number
  column: number
}

interface BoardState {
  board: Board
  boardCommited: Board
  droppingBlock: DroppingBlock | null
  collision: {
    coordinates: Coordinates
    rowsDeleted: number
  } | null
}

type Action = {
  type: 'init'
} | {
  type: 'drop'
  block: Block
} | {
  type: 'hard-drop'
} | {
  type: 'fall'
} | {
  type: 'move'
  horizontal: HorizontalMovement
} | {
  type: 'rotate'
}

export function useTetrisBoard () {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: structuredClone(EMPTY_BOARD),
      boardCommited: structuredClone(EMPTY_BOARD),
      droppingBlock: null,
      collision: null
    },
    (state) => { return state }
  )

  function boardReducer (state: BoardState, action: Action): BoardState {
    switch (action.type) {
      case 'init':
        return {
          board: structuredClone(EMPTY_BOARD),
          boardCommited: structuredClone(EMPTY_BOARD),
          droppingBlock: null,
          collision: null
        }
      case 'drop': {
        if (state.droppingBlock !== null) {
          console.error('There\'s already a block on the board')
          return state
        }

        const { board: newBoard, droppingBlock } = placeBlock(state.boardCommited, -10, 4, action.block)
        return {
          ...state,
          board: newBoard,
          droppingBlock
        }
      }
      case 'hard-drop': {
        if (state.droppingBlock === null) {
          console.error('There\'s no block to move')
          return state
        }

        let temp = {
          board: state.board,
          prevBoard: state.board,
          droppingBlock: state.droppingBlock,
          prevDroppingBlock: state.droppingBlock,
          isInvalid: false,
          collision: null
        }
        do {
          temp.prevDroppingBlock = temp.droppingBlock
          temp.prevBoard = temp.board
          temp = { ...temp, ...placeBlock(state.boardCommited, temp.droppingBlock.row + 1, temp.droppingBlock.column, temp.droppingBlock.block) }
        } while (!temp.isInvalid)

        const collision = hasCollishion(state.boardCommited, temp.prevDroppingBlock)
        if (collision != null) {
          const rowsToDelete = checkCompletedRows(temp.prevBoard)
          const boardToCommit = deleteRows(temp.prevBoard, rowsToDelete)

          return {
            ...state,
            board: boardToCommit,
            boardCommited: boardToCommit,
            droppingBlock: null,
            collision: {
              coordinates: collision,
              rowsDeleted: rowsToDelete.length
            }
          }
        }
        return state
      }
      case 'fall': {
        if (state.droppingBlock === null) {
          console.error('There\'s no block to move')
          return state
        }

        const { board: newBoard, droppingBlock, isInvalid } = placeBlock(state.boardCommited, state.droppingBlock.row + 1, state.droppingBlock.column, state.droppingBlock.block)
        if (isInvalid) {
          const collision = hasCollishion(state.boardCommited, state.droppingBlock)
          if (collision != null) {
            const rowsToDelete = checkCompletedRows(state.board)
            const boardToCommit = deleteRows(state.board, rowsToDelete)

            return {
              ...state,
              board: boardToCommit,
              boardCommited: boardToCommit,
              droppingBlock: null,
              collision: {
                coordinates: collision,
                rowsDeleted: rowsToDelete.length
              }
            }
          } else {
            console.error('Trying to place block in an invalid position')
            return state
          }
        }

        return {
          ...state,
          board: newBoard,
          droppingBlock
        }
      }
      case 'move': {
        if (state.droppingBlock === null) {
          console.error('There\'s no block to move')
          return state
        }

        let horizontalMovement = 0
        switch (action.horizontal) {
          case HorizontalMovement.LEFT:
            horizontalMovement = -1
            break
          case HorizontalMovement.RIGHT:
            horizontalMovement = 1
            break
        }

        if (horizontalMovement === 0) return state

        const row = state.droppingBlock.row
        const column = state.droppingBlock.column + horizontalMovement

        const { board: newBoard, droppingBlock, isInvalid } = placeBlock(state.boardCommited, row, column, state.droppingBlock.block)

        if (isInvalid) {
          console.error('Trying to place block in an invalid position')
          return state
        }

        return {
          ...state,
          board: newBoard,
          droppingBlock: {
            block: droppingBlock.block,
            row: state.droppingBlock.row,
            column: droppingBlock.column
          }
        }
      }
      case 'rotate': {
        if (state.droppingBlock === null) {
          console.error('There\'s no block to rotate')
          return state
        }

        const droppingBlockRotate = structuredClone(state.droppingBlock)
        droppingBlockRotate.block.shape = maths.rotateMatrixRight(droppingBlockRotate.block.shape)

        const { board: newBoard, droppingBlock, isInvalid } = placeBlock(state.boardCommited, droppingBlockRotate.row, droppingBlockRotate.column, droppingBlockRotate.block)

        if (isInvalid) {
          console.error('Trying to place block in an invalid position')
          return state
        }

        return {
          ...state,
          board: newBoard,
          droppingBlock
        }
      }
    }
    return state
  }

  return { boardState, dispatchBoardState }
}

function placeBlock (board: Board, row: number, column: number, block: Block) {
  const newBoard = structuredClone(board)
  const maxWidth = getMaxColumnNotEmpty(block.shape)
  const minWidth = getMinColumnNotEmpty(block.shape)
  const maxHeight = getMaxRowNotEmpty(block.shape)
  let isInvalid = false

  column = Math.max(-minWidth, column)
  column = Math.min(column, BOARD_WIDTH - maxWidth - 1)
  row = Math.max(0 - maxHeight - 1, row)

  const droppingBlock = {
    block,
    row,
    column
  }

  block.shape.forEach((rowBlock, i) => {
    rowBlock.forEach((cellBlock, j) => {
      const cellRow = row + i
      const cellColumn = column + j
      if (!cellBlock || cellRow < 0) return

      if (cellRow >= BOARD_HEIGHT) {
        isInvalid = true
        return
      }

      if (board[cellRow][cellColumn] !== EMPTY_CELL) {
        isInvalid = true
      }

      if (cellRow >= 0 && cellColumn >= 0) {
        newBoard[droppingBlock.row + i][droppingBlock.column + j] = block.color
      }
    })
  })

  if (!isInvalid) {
    return { board: newBoard, droppingBlock, isInvalid }
  } else {
    return { board, droppingBlock, isInvalid }
  }
}

function hasCollishion (board: Board, droppingBlock: DroppingBlock): Coordinates | null {
  let collision: Coordinates | null = null
  droppingBlock.block.shape.forEach((rowBlock, i) => {
    rowBlock.forEach((cell, j) => {
      const rowToCheck = droppingBlock.row + i + 1
      const colToCheck = droppingBlock.column + j

      if (cell && rowToCheck >= 0 && colToCheck >= 0 && colToCheck < BOARD_WIDTH && (rowToCheck >= BOARD_HEIGHT || board[rowToCheck][colToCheck] !== EMPTY_CELL)) {
        collision = {
          row: rowToCheck,
          column: colToCheck
        }
      }
    })
  })

  return collision
}

function checkCompletedRows (board: Board) {
  const indexes = []; let i
  for (i = 0; i < board.length; i++) {
    if (board[i].every(cell => cell !== EMPTY_CELL)) indexes.push(i)
  }

  return indexes
}

function deleteRows (board: Board, rowsToDelete: number[]) {
  const newBoard: Cell[][] = []
  board.forEach((row, idx) => {
    if (!rowsToDelete.includes(idx)) {
      newBoard.push(row)
    }
  })

  rowsToDelete.forEach(_ => newBoard.unshift(Array<Cell>(BOARD_WIDTH).fill(EMPTY_CELL)))

  return newBoard
}

function getMaxColumnNotEmpty (shape: boolean[][]) {
  const blockLastColumn = shape.map(line => Math.max(...line.map((val, idx) => val ? idx : 0)))
  return Math.max(...blockLastColumn)
}

function getMinColumnNotEmpty (shape: boolean[][]) {
  const blockLastColumn = shape.map(line => Math.min(...line.map((val, idx) => val ? idx : line.length)))
  return Math.min(...blockLastColumn)
}

function getMaxRowNotEmpty (shape: boolean[][]) {
  const tramsposedShape = maths.transpose(shape)
  const blockLastRow = tramsposedShape.map(line => Math.max(...line.map((val, idx) => val ? idx : 0)))
  return Math.max(...blockLastRow)
}
