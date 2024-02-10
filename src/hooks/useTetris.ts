import { useEffect, useRef, useState } from 'react'
import { useTetrisBoard } from './useTetrisBoard'
import { BlockTypes, Color, SHAPES, type BlockShape, HorizontalMovement, type Block } from '../types.d'

export const GAME_SPEED = 50

const LEVELS_SPEED = [1000, 900, 800, 600, 400, 300, 200, 150, 100, GAME_SPEED]

export function useTetris () {
  const { boardState, dispatchBoardState } = useTetrisBoard()
  const [hasGameStarted, setHasGameStarted] = useState(false)
  const [isGamePaused, setIsGamePaused] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const lastBlockColor = useRef(-1)
  const isMovingRight = useRef(false)
  const isMovingLeft = useRef(false)
  const isMovingDown = useRef(false)
  const isRotating = useRef(false)
  const [linesCleared, setLinesCleared] = useState(0)
  const [nextBlocks, setNextBlocks] = useState<Block[]>([])

  useEffect(() => {
    if (!hasGameStarted) return

    function gameTick () {
      if (isGamePaused) {
        return
      }

      if (boardState.droppingBlock === null) {
        dispatchBoardState({
          type: 'drop',
          block: nextBlocks[0]
        })
        setNextBlocks((current) => [current[1], current[2], getNewBlock()])
      }

      if (isMovingRight.current || isMovingLeft.current) {
        dispatchBoardState({
          type: 'move',
          horizontal: isMovingRight.current ? HorizontalMovement.RIGHT : HorizontalMovement.LEFT
        })

        isMovingRight.current = false
        isMovingLeft.current = false
      }

      if (isMovingDown.current) {
        dispatchBoardState({
          type: 'fall'
        })
        isMovingDown.current = false
      }

      if (isRotating.current) {
        dispatchBoardState({
          type: 'rotate'
        })
        isRotating.current = false
      }
    }

    function fallBlock () {
      if (isGamePaused) return
      isMovingDown.current = true
    }

    const speedIdx = Math.min(currentLevel - 1, LEVELS_SPEED.length - 1)
    const intervalTick = setInterval(gameTick, GAME_SPEED)
    const intervalFalling = setInterval(fallBlock, LEVELS_SPEED[speedIdx])

    return () => {
      clearInterval(intervalTick)
      clearInterval(intervalFalling)
    }
  }, [hasGameStarted, isGamePaused, currentLevel, nextBlocks, boardState.droppingBlock != null])

  useEffect(() => {
    if (boardState.collision === null) return

    if (boardState.collision.coordinates.row === 0) {
      setIsGameOver(true)
      setIsGamePaused(true)
      setHasGameStarted(false)
    }

    setLinesCleared(currrent => currrent + (boardState.collision !== null ? boardState.collision.rowsDeleted : 0))
    setScore((current) => {
      let suma = 0
      switch (boardState.collision?.rowsDeleted) {
        case 1:
          suma = 100 * currentLevel
          break
        case 2:
          suma = 100 * currentLevel
          break
        case 3:
          suma = 300 * currentLevel
          break
        case 4:
          suma = 400 * currentLevel
          break
      }
      return current + suma
    })
  }, [boardState.collision])

  useEffect(() => {
    setCurrentLevel(Math.floor(linesCleared / 10) + 1)
  }, [linesCleared])

  function pauseGame () {
    setIsGamePaused(true)
  }

  function resumeGame () {
    setIsGamePaused(false)
  }

  function moveRight () {
    isMovingRight.current = true
    isMovingLeft.current = false
  }

  function moveLeft () {
    isMovingLeft.current = true
    isMovingRight.current = false
  }

  function moveDown () {
    isMovingDown.current = true
  }

  function rotateBlock () {
    isRotating.current = true
  }

  function startGame () {
    dispatchBoardState({ type: 'init' })
    setIsGameOver(false)
    setIsGamePaused(false)
    setCurrentLevel(1)
    setScore(0)
    setNextBlocks([getNewBlock(), getNewBlock(), getNewBlock()])
    setLinesCleared(0)
    setHasGameStarted(true)
  }

  function hardDrop () {
    dispatchBoardState({ type: 'hard-drop' })
  }

  function getNewBlock () {
    const colors = Object.values(Color)
    lastBlockColor.current = (lastBlockColor.current + 1) % colors.length
    return {
      shape: getNextBlockShape(),
      color: colors[lastBlockColor.current]
    }
  }

  return { board: boardState.board, hasGameStarted, isGamePaused, isGameOver, currentLevel, score, linesCleared, nextBlocks, startGame, pauseGame, resumeGame, moveRight, moveLeft, moveDown, rotateBlock, hardDrop }
}

function getNextBlockShape (): BlockShape {
  const blockTypes = Object.values(BlockTypes)
  const blockChosen = blockTypes[Math.floor(Math.random() * blockTypes.length)]
  const nextBlockShape = SHAPES[blockChosen].shape

  return nextBlockShape
}
