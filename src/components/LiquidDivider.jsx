import "./LiquidDivider.css";
import crowdBg from "../assets/crowd-bg.png";

// Organic blob-edge paths — same command structure across all three so the
// browser can smoothly morph between them (SMIL animate on the "d" attribute).
// Full-size (1440x200 viewBox) versions, used for the visible tint/shadow layers.
const WAVE_A =
  "M0,0 L1440,0 L1440,125 C1400,130 1280,158.3 1200,155 C1120,151.7 1040,101.7 960,105 C880,108.3 800,175.8 720,175 C640,174.2 560,104.2 480,100 C400,95.8 320,146.7 240,150 C160,153.3 40,125 0,120 L0,0 Z";
const WAVE_B =
  "M0,0 L1440,0 L1440,150 C1400,141.7 1280,98.3 1200,100 C1120,101.7 1040,157.5 960,160 C880,162.5 800,114.2 720,115 C640,115.8 560,166.7 480,165 C400,163.3 320,108.3 240,105 C160,101.7 40,138.3 0,145 L0,0 Z";
const WAVE_C =
  "M0,0 L1440,0 L1440,110 C1400,119.2 1280,168.3 1200,165 C1120,161.7 1040,92.5 960,90 C880,87.5 800,145 720,150 C640,155 560,116.7 480,120 C400,123.3 320,173.3 240,170 C160,166.7 40,111.7 0,100 L0,0 Z";
const VALUES = `${WAVE_A};${WAVE_B};${WAVE_C};${WAVE_A}`;

// Same shapes as fractions of the box (0–1), used to clip the HTML background
// image behind the SVG — clipPathUnits="objectBoundingBox" needs 0–1 coords.
const CLIP_A =
  "M0,0 L1,0 L1,0.625 C0.97222,0.65 0.88889,0.7915 0.83333,0.775 C0.77778,0.7585 0.72222,0.5085 0.66667,0.525 C0.61111,0.5415 0.55556,0.879 0.5,0.875 C0.44444,0.871 0.38889,0.521 0.33333,0.5 C0.27778,0.479 0.22222,0.7335 0.16667,0.75 C0.11111,0.7665 0.02778,0.625 0,0.6 L0,0 Z";
const CLIP_B =
  "M0,0 L1,0 L1,0.75 C0.97222,0.7085 0.88889,0.4915 0.83333,0.5 C0.77778,0.5085 0.72222,0.7875 0.66667,0.8 C0.61111,0.8125 0.55556,0.571 0.5,0.575 C0.44444,0.579 0.38889,0.8335 0.33333,0.825 C0.27778,0.8165 0.22222,0.5415 0.16667,0.525 C0.11111,0.5085 0.02778,0.6915 0,0.725 L0,0 Z";
const CLIP_C =
  "M0,0 L1,0 L1,0.55 C0.97222,0.596 0.88889,0.8415 0.83333,0.825 C0.77778,0.8085 0.72222,0.4625 0.66667,0.45 C0.61111,0.4375 0.55556,0.725 0.5,0.75 C0.44444,0.775 0.38889,0.5835 0.33333,0.6 C0.27778,0.6165 0.22222,0.8665 0.16667,0.85 C0.11111,0.8335 0.02778,0.5585 0,0.5 L0,0 Z";
const CLIP_VALUES = `${CLIP_A};${CLIP_B};${CLIP_C};${CLIP_A}`;

export default function LiquidDivider() {
  return (
    <div className="liquid-divider" aria-hidden="true">
      {/* hidden defs: clips the HTML background image below to the same
          morphing blob shape as the visible SVG waves, in sync */}
      <svg className="liquid-divider__defs" width="0" height="0">
        <defs>
          <clipPath id="liquid-clip" clipPathUnits="objectBoundingBox">
            <path d={CLIP_A}>
              <animate
                attributeName="d"
                values={CLIP_VALUES}
                dur="14s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
                keyTimes="0; 0.33; 0.66; 1"
              />
            </path>
          </clipPath>
        </defs>
      </svg>

      {/* soft rust-toned shadow layer, behind everything else — offset in
          phase from the front wave so it only peeks out past its edges,
          never showing through the opaque photo on top of it */}
      <svg
        className="liquid-divider__shadow-svg"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path className="liquid-divider__shadow" d={WAVE_A}>
          <animate
            attributeName="d"
            values={VALUES}
            dur="14s"
            begin="-4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
            keyTimes="0; 0.33; 0.66; 1"
          />
        </path>
      </svg>

      {/* the Hero's own background photo, spilling down into the wave,
          clipped to the blob shape and treated exactly like the Hero bg —
          this is the front wave, fully opaque, sitting above the shadow */}
      <div
        className="liquid-divider__bg"
        style={{ backgroundImage: `url(${crowdBg})` }}
      />
      <div className="liquid-divider__scrim" />

      <svg
        className="liquid-divider__svg"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        {/* red/rust duotone tint over the clipped photo — same treatment as
            the About showcase image, so the photo reads bright orange while
            still showing through */}
        {/* <path className="liquid-divider__tint" d={WAVE_A}>
          <animate
            attributeName="d"
            values={VALUES}
            dur="14s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1; 0.45 0 0.55 1"
            keyTimes="0; 0.33; 0.66; 1"
          />
        </path> */}
      </svg>
    </div>
  );
}