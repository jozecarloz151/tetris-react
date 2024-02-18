import { faArrowDown, faArrowLeft, faArrowRight, faPause, faPlay, faRotate, faSortDown, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface Props {
  pauseGame: () => void
  resumeGame: () => void
  muteGame: () => void
  moveLeft: () => void
  moveRight: () => void
  moveDown: () => void
  rotate: () => void
  hardDrop: () => void
  isGamePaused: boolean
  gameMuted: boolean
}

export function Controls ({ pauseGame, resumeGame, muteGame, moveLeft, moveRight, moveDown, rotate, hardDrop, isGamePaused, gameMuted }: Props) {
  return (
    <div className='controls-container'>
      <div className='controls'>
        <h3 className='subtitle'>CONTROLS</h3>
        <p className='detail'>〔→ , D〕 Move right</p>
        <p className='detail'>〔← , A〕 Move left</p>
        <p className='detail'>〔↓ , S〕 Soft drop</p>
        <p className='detail'>〔↑ , W〕 Rotate right</p>
        <p className='detail'>〔Space〕Hard drop</p>
      </div>
      <div className='buttons-container'>
        <button className='button' onClick={moveLeft} title='Move Left'><FontAwesomeIcon icon={faArrowLeft} /></button>
        <button className='button' onClick={moveRight} title='Move Right'><FontAwesomeIcon icon={faArrowRight} /></button>
        <button className='button' onClick={moveDown} title='Soft Drop'><FontAwesomeIcon icon={faArrowDown} /></button>
        <button className='button' onClick={rotate} title='Rotate Block'><FontAwesomeIcon icon={faRotate} /></button>
        <button className='button' onClick={hardDrop} title='Hard Drop'><FontAwesomeIcon icon={faSortDown} /></button>
        {
          isGamePaused
            ? (
              <button className='button' title='Resume Game' onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                resumeGame()
              }}><FontAwesomeIcon icon={faPlay} /></button>
            )
            : (
              <button className='button' title='Pause Game' onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                pauseGame()
              }}><FontAwesomeIcon icon={faPause} /></button>
            )
        }
        {
          gameMuted
            ? (
              <button className='button' title='Unmute Game' onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                muteGame()
              }}><FontAwesomeIcon icon={faVolumeMute} /></button>
            )
            : (
              <button className='button' title='Mute Game' onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                muteGame()
              }}><FontAwesomeIcon icon={faVolumeUp} /></button>
            )
        }
      </div>
    </div >
  )
}
