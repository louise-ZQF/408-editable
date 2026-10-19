/// <reference types="vite/client" />

declare module 'segmentit' {
  interface SegmentInstance {
    doSegment(text: string, options?: Record<string, unknown>): Array<string | { w?: string }>
  }
  export class Segment {
    constructor(options?: unknown)
  }
  export function useDefault(segment: unknown): SegmentInstance
}
