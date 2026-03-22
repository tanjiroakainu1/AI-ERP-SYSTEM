/**
 * Decorative full-viewport layer: animated lightning + grid (pointer-events none).
 */
export function LightningBackdrop() {
  return (
    <div className="lightning-root pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="lightning-aurora" />
      <div className="lightning-grid" />
      <div className="lightning-vignette" />

      <div className="lightning-strike-wrap lightning-wrap-a">
        <div className="lightning-strike-inner" />
      </div>
      <div className="lightning-strike-wrap lightning-wrap-b">
        <div className="lightning-strike-inner" />
      </div>
      <div className="lightning-strike-wrap lightning-wrap-c">
        <div className="lightning-strike-inner" />
      </div>

      <div className="lightning-fork lightning-fork-a" />
      <div className="lightning-fork lightning-fork-b" />

      <div className="lightning-orb lightning-orb-1" />
      <div className="lightning-orb lightning-orb-2" />
      <div className="lightning-orb lightning-orb-3" />
    </div>
  )
}
