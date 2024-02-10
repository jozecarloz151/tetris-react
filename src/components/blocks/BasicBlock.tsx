import { type Color } from '../../types.d'
import './Block.css'

interface Props {
  color: Color
}

export function BasicBlock ({ color }: Props) {
  const classes = `basic-block ${color}`

  return (
    <div className={classes}>

    </div>
  )
}
