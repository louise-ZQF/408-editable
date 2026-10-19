import type { Scene } from 'manim-web'

export type ManimCodeStep = {
  id: string
  render: (scene: Scene, animate: boolean) => Promise<void> | void
}

export type ManimWebAnimation = {
  id: string
  ariaLabel: string
  initialState?: ManimCodeStep
  scene: {
    width: number
    height: number
    frameWidth: number
    frameHeight: number
    backgroundColor: string
  }
  steps: ManimCodeStep[]
}
