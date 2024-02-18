import { useMemo } from 'react'
import { type Block } from '../types.d'
import { BasicBlock } from './blocks/BasicBlock'
import { EmptyCell } from './blocks/EmptyCell'

interface Props {
  nextBlocks: Block[]
}

export function NextBlocks ({ nextBlocks }: Props) {
  const myStyle = {
    width: 'calc(var(--square-size) * 5',
    height: 'calc(var(--square-size) * 12',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(12, 1fr)'
  }

  const nextBlocksTransformed = useMemo(() => {
    return nextBlocks.map(block => {
      let newShape = block.shape.map(row => {
        const newArray = [false, false, ...row, false]
        const n = 5
        const start = newArray.length - n
        return newArray.slice(start, start + n)
      })
      newShape = [Array(5).fill(false), ...newShape, Array(5).fill(false)]
      const n = 4
      const start = newShape.length - n
      newShape = newShape.slice(start, start + n)

      const blockTransformed: Block = { shape: newShape, color: block.color }

      return blockTransformed
    })
  }, [nextBlocks])

  return (
    <div className='right-side-container'>
      <h3 className='subtitle'>NEXT</h3>
      <div className='tetris-board' style={myStyle}>
        {
          nextBlocksTransformed.map(block => (
            block.shape.map((row, i) => (
              row.map((cell, j) => {
                if (cell) return <BasicBlock color={block.color} key={i + '-' + j}></BasicBlock>
                else return <EmptyCell key={i + '-' + j} />
              })
            ))
          ))
        }
      </div>
    </div >
  )
}
