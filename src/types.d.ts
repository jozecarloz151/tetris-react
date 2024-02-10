export enum HorizontalMovement {
  LEFT,
  RIGHT
}

export enum VerticalMovement {
  DOWN
}

export type Direction = HorizontalMovement | VerticalMovement

export interface Coordinates {
  row: number
  column: number
}

export enum Color {
  RED = 'red',
  PURPLE = 'purple',
  LIGHT_BUE = 'light-blue',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  ORANGE = 'orange'
}

export const EMPTY_CELL = ''

export type Cell = Color | typeof EMPTY_CELL

export enum BlockTypes {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

export type Board = Cell[][]
export type BlockShape = boolean[][]

export interface Block {
  shape: BlockShape
  color: Color
}

type ShapesObj = {
  [key in BlockTypes]: {
    shape: BlockShape
  };
}

export const SHAPES: ShapesObj = {
  I: {
    shape: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false]
    ]
  },
  J: {
    shape: [
      [false, false, false],
      [true, false, false],
      [true, true, true]
    ]
  },
  L: {
    shape: [
      [false, false, false],
      [false, false, true],
      [true, true, true]
    ]
  },
  O: {
    shape: [
      [true, true],
      [true, true]
    ]
  },
  S: {
    shape: [
      [false, false, false],
      [false, true, true],
      [true, true, false]
    ]
  },
  T: {
    shape: [
      [false, false, false],
      [false, true, false],
      [true, true, true]
    ]
  },
  Z: {
    shape: [
      [false, false, false],
      [true, true, false],
      [false, true, true]
    ]
  }
}
