import { useRef, useState } from "react";
import { trackLandingEvent } from "../analytics";

/**
 * Color Fix before/after comparison (strategy §S4). Pointer + touch drag and
 * keyboard operable (role="slider"). The "after" image is clipped to the
 * divider position. Real photo pair — labelled honest proof.
 *
 * // TODO(phase-c): confirm beforeSrc/afterSrc are a TRUE matched pair exported
 * from the app's ColorCorrectionView.
 */

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

export function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt }: Props) {
  const [split, setSplit] = useState(35);
  const trackedRef = useRef(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  function trackOnce() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackLandingEvent("product_demo_started", { demo_id: "color-fix", source_section: "color_fix" });
  }

  function setFromClientX(clientX: number) {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(100, Math.max(0, pct)));
  }

  function onPointerDown(e: React.PointerEvent) {
    trackOnce();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;
    setFromClientX(e.clientX);
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      trackOnce();
      setSplit((s) => Math.max(0, s - 4));
    } else if (e.key === "ArrowRight") {
      trackOnce();
      setSplit((s) => Math.min(100, s + 4));
    } else if (e.key === "Home") {
      setSplit(0);
    } else if (e.key === "End") {
      setSplit(100);
    }
  }

  return (
    <div
      className="ba-slider"
      ref={frameRef}
      style={{ ["--split" as string]: `${split}%` }}
      role="slider"
      tabIndex={0}
      aria-label="Compare photo before and after colour correction"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(split)}
      aria-valuetext={`Corrected image ${Math.round(split)} percent revealed`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
    >
      {/* before/after are the same real photo; the "after" file is pre-corrected. */}
      <img className="ba-before" src={beforeSrc} alt={beforeAlt} loading="lazy" decoding="async" />
      <img className="ba-after" src={afterSrc} alt={afterAlt} loading="lazy" decoding="async" />
      <span className="ba-label ba-label-before" aria-hidden="true">Before</span>
      <span className="ba-label ba-label-after" aria-hidden="true">Steve</span>
      <div className="ba-divider" aria-hidden="true">
        <span className="ba-handle">⇔</span>
      </div>
    </div>
  );
}
