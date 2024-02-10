import { useEffect } from 'react'
import './TetrisBoard.css'
import { BOARD_HEIGHT, BOARD_WIDTH } from '../hooks/useTetrisBoard'
import { BasicBlock } from './blocks/BasicBlock'
import { EmptyCell } from './blocks/EmptyCell'
import { type Board, EMPTY_CELL } from '../types.d'

interface Props {
  board: Board
  score: number
  currentLevel: number
  linesCleared: number
}

export function TetrisBoard ({ board, score, currentLevel, linesCleared }: Props) {
  useEffect(() => {
    document.documentElement.style.setProperty('--board-width', BOARD_WIDTH + '')
    document.documentElement.style.setProperty('--board-height', BOARD_HEIGHT + '')
  }, [])

  return (
    <div className='board-container'>
      <h3>SCORE: {score} || LEVEL: {currentLevel} || LINES: {linesCleared}</h3>
      <div className='tetris-board'>
        {
          board.map((line, i) => (
            line.map((cell, j) => {
              if (cell !== EMPTY_CELL) return <BasicBlock color={cell} key={i + '-' + j}></BasicBlock>
              else return <EmptyCell key={i + '-' + j} />
            })
          ))
        }
      </div>

    </div>
  )
}
