import React, { useEffect, useRef, useState } from "react";

export const FadeInWhenVisible = ({
  children,
  animationClass = "animate-fadeInUp",
  className = "",
  delay = 0,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);

            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [delay, threshold]);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-300 ${
        isVisible ? `opacity-100 ${animationClass}` : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};
