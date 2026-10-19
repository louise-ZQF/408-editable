import { Text } from 'manim-web'
import type { TextOptions } from 'manim-web'

/**
 * SafariSafeText
 *
 * Fixes Safari/WebKit clipping CJK glyphs when manim-web renders Text
 * into an off-screen CanvasTexture.
 *
 * manim-web currently estimates canvas height from:
 *   fontSize * lineHeight
 * and renders with:
 *   textBaseline = 'top'
 *
 * Safari's CJK fallback-font metrics can extend outside that estimated
 * em box, so the glyph is already clipped before Three.js receives it.
 *
 * This subclass measures the real glyph ascent/descent and renders using
 * an alphabetic baseline with extra safety padding.
 */
export class SafariSafeText extends Text {
  protected override _renderToCanvas(): void {
    if (!this._canvas || !this._ctx) return

    const RESOLUTION_SCALE = 2
    const SVG_UNITS_PER_PT = 4 / 3
    const DEFAULT_FONT_SIZE_PT = 48
    const DEFAULT_FONT_SIZE_IN_WORLD_SPACE = 0.5

    const ctx = this._ctx
    const lines = this._text.split('\n')
    const scaledFontSize = this._fontSize * RESOLUTION_SCALE
    const requestedLineHeight = scaledFontSize * this._lineHeight

    // Set the font before measuring.
    ctx.font = this._buildFontString()

    type LineMetrics = {
      width: number
      ascent: number
      descent: number
    }

    const measured: LineMetrics[] = lines.map((line) => {
      // An empty line still needs a sensible vertical box.
      const metrics = ctx.measureText(line || '国')

      const ascent =
        Number.isFinite(metrics.actualBoundingBoxAscent)
        && metrics.actualBoundingBoxAscent > 0
          ? metrics.actualBoundingBoxAscent
          : scaledFontSize * 0.85

      const descent =
        Number.isFinite(metrics.actualBoundingBoxDescent)
        && metrics.actualBoundingBoxDescent >= 0
          ? metrics.actualBoundingBoxDescent
          : scaledFontSize * 0.25

      const letterSpacingWidth =
        Math.max(0, Array.from(line).length - 1)
        * this._letterSpacing
        * RESOLUTION_SCALE

      // actualBoundingBoxLeft/Right protect italic/overhanging glyphs;
      // metrics.width remains the normal advance width.
      const glyphWidth =
        Math.max(
          metrics.width,
          Math.abs(metrics.actualBoundingBoxLeft || 0)
            + Math.abs(metrics.actualBoundingBoxRight || 0),
        ) + letterSpacingWidth

      return {
        width: glyphWidth,
        ascent,
        descent,
      }
    })

    const maxWidth = measured.reduce(
      (max, metrics) => Math.max(max, metrics.width),
      0,
    )

    const maxAscent = measured.reduce(
      (max, metrics) => Math.max(max, metrics.ascent),
      scaledFontSize * 0.85,
    )

    const maxDescent = measured.reduce(
      (max, metrics) => Math.max(max, metrics.descent),
      scaledFontSize * 0.25,
    )

    // Never make line advance smaller than the actual glyph box.
    const glyphLineHeight = maxAscent + maxDescent
    const lineAdvance = Math.max(requestedLineHeight, glyphLineHeight)

    // Deliberately generous: the texture is tiny compared with the scene,
    // and this avoids WebKit clipping antialiasing / fallback-font overshoot.
    const horizontalPadding = scaledFontSize * 0.35
    const verticalPadding = scaledFontSize * 0.35

    const width = Math.max(
      1,
      Math.ceil(maxWidth + horizontalPadding * 2),
    )

    const height = Math.max(
      1,
      Math.ceil(
        verticalPadding * 2
          + maxAscent
          + maxDescent
          + Math.max(0, lines.length - 1) * lineAdvance,
      ),
    )

    // Resizing canvas resets CanvasRenderingContext2D state.
    this._canvas.width = width
    this._canvas.height = height

    ctx.clearRect(0, 0, width, height)

    ctx.font = this._buildFontString()
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = this._textAlign

    let textX: number
    switch (this._textAlign) {
      case 'left':
        textX = horizontalPadding
        break
      case 'right':
        textX = width - horizontalPadding
        break
      case 'center':
      default:
        textX = width / 2
        break
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Baseline, rather than top edge, is derived from real ascent.
      const baselineY =
        verticalPadding
        + maxAscent
        + i * lineAdvance

      ctx.fillStyle = this.color
      ctx.strokeStyle = this.color
      ctx.globalAlpha = this.fillOpacity

      if (this._letterSpacing > 0) {
        this._drawTextWithLetterSpacing(
          line,
          textX,
          baselineY,
          scaledFontSize,
        )
      } else {
        if (this.strokeWidth > 0) {
          ctx.lineWidth = this.strokeWidth * RESOLUTION_SCALE
          ctx.strokeText(line, textX, baselineY)
        }

        ctx.fillText(line, textX, baselineY)
      }
    }

    const pxToWorld =
      (1 / SVG_UNITS_PER_PT)
      * (1 / DEFAULT_FONT_SIZE_PT)
      * DEFAULT_FONT_SIZE_IN_WORLD_SPACE

    this._worldWidth =
      (width / RESOLUTION_SCALE) * pxToWorld

    this._worldHeight =
      (height / RESOLUTION_SCALE) * pxToWorld

    this._canvasDirty = false

    if (this._texture) {
      this._texture.needsUpdate = true
    }
  }
}
