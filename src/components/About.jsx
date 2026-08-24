import { useEffect, useMemo, useRef, useState } from "react";
import "./About.css";

// Every image dropped into src/assets/gallery/ is picked up automatically
// (Vite's import.meta.glob scans the folder at build time) — add or
// remove a photo there and the slideshow updates on the next build, no
// code changes needed.
const galleryModules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const SLIDE_DURATION = 5000;

export default function About() {
  const slides = useMemo(
    () =>
      Object.keys(galleryModules)
        .sort()
        .map((key) => galleryModules[key]),
    []
  );

  const [index, setIndex] = useState(0);

  // Drag/scroll-carousel state. While dragging, the current photo and
  // whichever neighbour it's revealing are rendered on an overlay layer
  // that tracks the pointer 1:1 — a real filmstrip-scroll feel rather than
  // a "flick past a threshold" gesture.
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [pendingDir, setPendingDir] = useState(0); // -1 prev, 1 next, 0 spring back
  const [justCommitted, setJustCommitted] = useState(false);

  // Refs mirror the drag state so the release handler always reads the
  // live position — this matters because release can be caught by a
  // window-level fallback listener (pointer let go off the frame, or even
  // outside the browser window) whose closure may have been created
  // earlier in the drag than the state it needs.
  const dragXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const revealDirRef = useRef(1); // 1 = revealing next, -1 = revealing prev — locked to the actual drag gesture, not recomputed from dragX (which passes through 0 during the spring-back animation)
  const dragStartX = useRef(0);
  const widthRef = useRef(0);
  const activePointerId = useRef(null);
  const frameRef = useRef(null);

  const updateDragX = (v) => {
    dragXRef.current = v;
    setDragX(v);
  };

  useEffect(() => {
    const measure = () => {
      widthRef.current = frameRef.current?.offsetWidth || 0;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Auto-advance — resets whenever the slide changes (auto or manual) so a
  // user swipe/click gets a full fresh interval before it moves on again.
  useEffect(() => {
    if (slides.length < 2 || isDragging || settling) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length, index, isDragging, settling]);

  // After a drag-commit swaps the active index, briefly force that image to
  // full opacity with no transition (it's already fully visible under the
  // drag layer) so the normal crossfade doesn't fade it in from black.
  useEffect(() => {
    if (!justCommitted) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setJustCommitted(false))
    );
    return () => cancelAnimationFrame(id);
  }, [justCommitted]);

  const finishDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    activePointerId.current = null;

    const width = widthRef.current || 1;
    const threshold = Math.max(50, width * 0.15);
    const currentDragX = dragXRef.current;

    if (currentDragX === 0) {
      // No movement happened — nothing to settle/animate.
      return;
    }

    let target = 0;
    let dir = 0;
    if (currentDragX <= -threshold) {
      target = -width;
      dir = 1;
    } else if (currentDragX >= threshold) {
      target = width;
      dir = -1;
    }

    if (currentDragX === target) {
      // Already sitting exactly at the destination — no transform change
      // will fire, so commit immediately instead of waiting on a
      // transitionend that will never come.
      if (dir !== 0) {
        setJustCommitted(true);
        setIndex((i) => (i + dir + slides.length) % slides.length);
      }
      updateDragX(0);
      return;
    }

    setSettling(true);
    setPendingDir(dir);
    updateDragX(target);
  };

  // Window-level fallback: if the pointer is released off the frame, off
  // the window entirely, or the tab/window loses focus mid-drag, the
  // element's own onPointerUp/onPointerCancel may never fire. These
  // guarantee the drag always resolves instead of leaving isDragging
  // stuck true (which is what caused the freeze).
  useEffect(() => {
    if (!isDragging) return;
    const handleRelease = () => finishDrag();
    window.addEventListener("pointerup", handleRelease);
    window.addEventListener("pointercancel", handleRelease);
    window.addEventListener("blur", handleRelease);
    return () => {
      window.removeEventListener("pointerup", handleRelease);
      window.removeEventListener("pointercancel", handleRelease);
      window.removeEventListener("blur", handleRelease);
    };
  }, [isDragging]);

  const handlePointerDown = (e) => {
    if (slides.length < 2 || settling) return;
    e.preventDefault();
    widthRef.current = frameRef.current?.offsetWidth || widthRef.current;
    activePointerId.current = e.pointerId;
    dragStartX.current = e.clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture can fail in rare cases (e.g. pointer already released) —
      // the window-level fallback listeners still cover us.
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || e.pointerId !== activePointerId.current) return;
    const width = widthRef.current || 1;
    const raw = e.clientX - dragStartX.current;
    if (raw !== 0) revealDirRef.current = raw < 0 ? 1 : -1;
    updateDragX(Math.max(-width, Math.min(width, raw)));
  };

  const handleDragLayerTransitionEnd = (e) => {
    if (e.propertyName !== "transform" || !settling) return;
    if (pendingDir !== 0) {
      setJustCommitted(true);
      setIndex((i) => (i + pendingDir + slides.length) % slides.length);
    }
    setSettling(false);
    setPendingDir(0);
    updateDragX(0);
  };

  const showDragLayer = slides.length > 1 && (isDragging || settling);
  const dir = revealDirRef.current; // 1 = revealing next, -1 = revealing prev
  const neighborIndex = (index + dir + slides.length) % slides.length;
  const width = widthRef.current || 1;
  const neighborRestOffset = dir === 1 ? width : -width;
  const dragTransition = settling ? "transform 0.35s ease" : "none";

  return (
    <section className="showcase" id="about">
      <p className="eyebrow showcase__eyebrow wrap">Boho's After Dark</p>

      <div
        ref={frameRef}
        className={"showcase__frame" + (isDragging ? " showcase__frame--dragging" : "")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onPointerLeave={(e) => {
          // Only a safety net for mice (no capture support quirks); touch
          // stays captured. Buttons other than the primary are ignored.
          if (e.pointerType === "mouse" && e.buttons === 0) finishDrag();
        }}
      >
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            onDragStart={(ev) => ev.preventDefault()}
            className={
              "showcase__img" + (i === index ? " showcase__img--active" : "")
            }
            style={
              i === index && justCommitted
                ? { transition: "none", opacity: 1 }
                : undefined
            }
            aria-hidden="true"
          />
        ))}

        {showDragLayer && (
          <div className="showcase__drag-layer" aria-hidden="true">
            <img
              src={slides[index]}
              alt=""
              draggable={false}
              className="showcase__drag-img"
              style={{ transform: `translateX(${dragX}px)`, transition: dragTransition }}
              onTransitionEnd={handleDragLayerTransitionEnd}
            />
            <img
              src={slides[neighborIndex]}
              alt=""
              draggable={false}
              className="showcase__drag-img"
              style={{
                transform: `translateX(${dragX + neighborRestOffset}px)`,
                transition: dragTransition,
              }}
            />
          </div>
        )}

        {/* <div className="showcase__duotone" aria-hidden="true" /> */}
        {/* <div className="showcase__grain" aria-hidden="true" /> */}
        <div className="showcase__vignette" aria-hidden="true" />

        {slides.length > 1 && (
          <div className="showcase__dots" role="tablist" aria-label="Gallery slides">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show photo ${i + 1}`}
                className={
                  "showcase__dot" + (i === index ? " showcase__dot--active" : "")
                }
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}

        <p className="showcase__credit">Victoria St, Stellenbosch</p>
      </div>
    </section>
  );
}