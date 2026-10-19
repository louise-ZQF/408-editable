/**
 * Project-local manim-web entry.
 *
 * Import animation primitives from this file instead of directly from
 * "manim-web". The explicit Text export overrides manim-web's Text with
 * SafariSafeText, while all other exports still come from manim-web.
 */
export * from 'manim-web'
export { SafariSafeText as Text } from './SafariSafeText'
