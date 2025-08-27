import { useEffect, useRef, useState } from "react";

function TaskName({ name, completed, onDoubleClick }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const measureOverflow = () => {
      const container = containerRef.current;
      const textEl = textRef.current;
      if (!container || !textEl) return;

      // Use getBoundingClientRect to measure real visible width
      const containerWidth = container.getBoundingClientRect().width;
      const textWidth = textEl.scrollWidth;

      if (textWidth > containerWidth) {
        const speed = 60; // pixels/sec
        const distance = textWidth + containerWidth;
        const duration = distance / speed;

        textEl.style.setProperty("--scroll-duration", `${duration}s`);
        setShouldAnimate(true);
      } else {
        setShouldAnimate(false);
      }
    };

    // Measure after render
    requestAnimationFrame(measureOverflow);

    // Re-measure on window resize
    window.addEventListener("resize", measureOverflow);
    return () => window.removeEventListener("resize", measureOverflow);
  }, [name]);

  return (
    <span
      className={`task-name ${completed ? "completed" : ""}`}
      onDoubleClick={onDoubleClick}
      ref={containerRef}
    >
      <span ref={textRef} className={shouldAnimate ? "scrolling" : ""}>
        {name}
      </span>
    </span>
  );
}

export default TaskName;
