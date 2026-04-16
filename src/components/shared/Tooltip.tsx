import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string | number;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  disabled?: boolean;
  wrapperClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "right",
  delay = 0,
  disabled = false,
  wrapperClassName = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLDivElement>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let top = 0;
    let left = 0;

    switch (position) {
      case "right":
        top = rect.top + rect.height / 2 + scrollTop;
        left = rect.right + scrollLeft + 10;
        break;
      case "left":
        top = rect.top + rect.height / 2 + scrollTop;
        left = rect.left + scrollLeft - 10;
        break;
      case "top":
        top = rect.top + scrollTop - 10;
        left = rect.left + rect.width / 2 + scrollLeft;
        break;
      case "bottom":
        top = rect.bottom + scrollTop + 10;
        left = rect.left + rect.width / 2 + scrollLeft;
        break;
    }

    setCoords({ top, left });
  };

  const handlePointerEnter = () => {
    if (disabled) return;
    calculatePosition();
    if (timeoutId.current) clearTimeout(timeoutId.current);

    if (delay > 0) {
      timeoutId.current = setTimeout(() => {
        setIsVisible(true);
        setTimeout(calculatePosition, 0);
      }, delay);
    } else {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }
  };

  const handlePointerLeave = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  // Update position on scroll or resize if visible
  useEffect(() => {
    if (isVisible) {
      window.addEventListener("scroll", calculatePosition);
      window.addEventListener("resize", calculatePosition);
      const interval = setInterval(calculatePosition, 100);
      return () => {
        window.removeEventListener("scroll", calculatePosition);
        window.removeEventListener("resize", calculatePosition);
        clearInterval(interval);
      };
    }
  }, [isVisible]);

  const transform = {
    right: "translateY(-50%)",
    left: "translateX(-100%) translateY(-50%)",
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%)",
  };

  const arrowClasses = {
    right: "left-[-4px] top-1/2 -translate-y-1/2",
    left: "right-[-4px] top-1/2 -translate-y-1/2",
    top: "bottom-[-4px] left-1/2 -translate-x-1/2",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2",
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={anchorRef}
      className={wrapperClassName || "inline-flex items-center justify-center"}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            className="fixed z-[99999] pointer-events-none animate-in fade-in duration-100"
            style={{
              top: coords.top,
              left: coords.left,
              transform: transform[position],
            }}
          >
            <div className="relative px-2 py-1 text-[11px] font-bold text-white bg-slate-800 rounded shadow-xl whitespace-nowrap border border-slate-700/50">
              {content}
              <div
                className={`absolute w-1.5 h-1.5 bg-slate-800 rotate-45 border-l border-t border-slate-700/50 ${arrowClasses[position]}`}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
