import React from 'react'

interface Props {
  pauseGame: () => void
  resumeGame: () => void
  muteGame: () => void
  isGamePaused: boolean
}

export function Controls ({ pauseGame, resumeGame, muteGame, isGamePaused }: Props) {
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
        {
          isGamePaused
            ? (
              <button className='button' onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                resumeGame()
              }}><span className='detail'>Resume</span></button>
            )
            : (
              <button className='button' onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                pauseGame()
              }}><span className='detail'>Pause</span></button>
            )
        }
        <button className='button' onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
          ev.currentTarget.blur()
          muteGame()
        }}><span className='detail'>Mute</span></button>
      </div>
    </div>
  )
}
