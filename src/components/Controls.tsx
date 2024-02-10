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
      <h3>CONTROLS</h3>
      <p>〔→ , D〕 Move right</p>
      <p>〔← , A〕 Move left</p>
      <p>〔↓ , S〕 Soft drop</p>
      <p>〔Space〕Hard drop</p>
      <p>〔↑ , W〕 Rotate right</p>
      <hr />
      <div>
        {
          isGamePaused
            ? (
              <button onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                resumeGame()
              }}>Resume Game</button>
            )
            : (
              <button onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                ev.currentTarget.blur()
                pauseGame()
              }}>Pause Game</button>
            )
        }
      </div>
      <br />
      <div>
        <button onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
          ev.currentTarget.blur()
          muteGame()
        }}>Mute Game</button>
      </div>
    </div>
  )
}
