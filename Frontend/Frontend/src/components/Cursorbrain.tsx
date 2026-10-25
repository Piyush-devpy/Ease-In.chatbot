import { useEffect, useRef, useState } from "react";
import brainImg from "/src/assets/brain.webp"; // adjust to where brain.webp lives

// Pupil width as a % of the brain's width (must match w-[9.5%] below)
const PUPIL_SIZE = 9.5;
// Max eye travel as a % of the brain's width
const MAX_TRAVEL = 3;

function CursorBrain() {
  const brainRef = useRef<HTMLDivElement>(null);
  // Offset in "pupil widths" (1 = the pupil's own width)
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!brainRef.current) return;

      const rect = brainRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      const distance = MAX_TRAVEL / PUPIL_SIZE;

      setPupil({
        x: Math.cos(angle) * distance * 1.4,
        y: Math.sin(angle) * distance,
      });
    };

    // pointermove covers mouse, pen and touch-drag
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const pupilStyle = {
    transform: `translate(${pupil.x * 100}%, ${pupil.y * 100}%)`,
  };

  return (
    <div ref={brainRef} className="relative mx-auto w-full max-w-[420px]">
      <img
        src={brainImg}
        alt="Ease-In brain mascot"
        className="block h-auto w-full select-none"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute left-[32%] top-[43%] aspect-square w-[9.5%] rounded-full bg-[#4b2418] transition-transform duration-75 ease-out motion-reduce:transition-none"
        style={pupilStyle}
      />
      <div
        className="pointer-events-none absolute left-[64%] top-[43%] aspect-square w-[9.5%] rounded-full bg-[#4b2418] transition-transform duration-75 ease-out motion-reduce:transition-none"
        style={pupilStyle}
      />
    </div>
  );
}

export default CursorBrain;