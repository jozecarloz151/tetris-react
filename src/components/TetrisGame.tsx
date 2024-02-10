import { useEffect, useRef, useState } from 'react'
import { useTetris } from '../hooks/useTetris'
import { Controls } from './Controls'
import { NextBlocks } from './NextBlocks'
import { TetrisBoard } from './TetrisBoard'
import TetrisTheme from '../assets/TetrisTheme.mp3'

export function TetrisGame () {
  const { board, isGamePaused, isGameOver, currentLevel, score, linesCleared, nextBlocks, hasGameStarted, startGame, pauseGame, resumeGame, moveRight, moveLeft, moveDown, rotateBlock, hardDrop } = useTetris()
  const tetrisContainerRef = useRef<HTMLDivElement>(null)
  const tetrisThemeAudio = useRef<HTMLAudioElement>(new Audio(TetrisTheme))
  const [gameMuted, setGameMuted] = useState(false)

  useEffect(() => {
    tetrisContainerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (hasGameStarted) {
      tetrisContainerRef.current?.focus()
      tetrisThemeAudio.current.pause()
      if (!isGamePaused && !gameMuted) {
        tetrisThemeAudio.current = new Audio(TetrisTheme)
        void tetrisThemeAudio.current.play()
        tetrisThemeAudio.current.loop = true
      }
    }
  }, [hasGameStarted, isGamePaused, gameMuted])

  function muteGame () {
    setGameMuted((current) => !current)
  }

  function handleOnKeyDown (ev: React.KeyboardEvent) {
    switch (ev.code) {
      case 'ArrowUp':
      case 'KeyW':
        rotateBlock()
        break
      case 'ArrowDown':
      case 'KeyS':
        moveDown()
        break
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft()
        break
      case 'ArrowRight':
      case 'KeyD':
        moveRight()
        break
      case 'Space':
        hardDrop()
        break
    }
  }

  return (
    <div ref={tetrisContainerRef} onKeyDown={handleOnKeyDown} tabIndex={0} className='tetris-container'>
      <TetrisBoard board={board} currentLevel={currentLevel} score={score} linesCleared={linesCleared} />
      <NextBlocks nextBlocks={nextBlocks} />
      <Controls pauseGame={() => {
        pauseGame()
      }} resumeGame={() => {
        resumeGame()
        tetrisContainerRef.current?.focus()
      }} isGamePaused={isGamePaused} muteGame={muteGame} />
      {
        isGameOver && <div className='message-container'>
          <div className='message-sub-container'>
            <div className='message'>
              <h3>GAME OVER</h3>
              <p>SCORE: <b>{score}</b></p>
              <p>LEVEL: <b>{currentLevel}</b></p>
              <p>LINES: <b>{linesCleared}</b></p>
              <button onClick={() => {
                startGame()
              }}>Play again!</button>
            </div>
          </div>
        </div>
      }
      {
        !hasGameStarted && !isGameOver && <div className='message-container'>
          <div className='message-sub-container'>
            <div className='message'>
              <button onClick={() => {
                startGame()
              }}>Start Game!</button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
