import 'intersection-observer';
import { useEffect, useRef, useState } from 'react';

export const useIntersection = (triggerId: string, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const onObservation: IntersectionObserverCallback = (entries) => {
    const entry = entries[0];
    setIsIntersecting(entry.isIntersecting);
  };

  const observerRef = useRef<IntersectionObserver>(new IntersectionObserver(onObservation, options));

  useEffect(() => {
    const observer = observerRef.current;
    observer.disconnect();
    const trigger = document.getElementById(triggerId);
    if (trigger) {
      observer.observe(trigger);
    } else {
      console.warn(`could not find element with [id=${triggerId}]`);
    }
    return () => {
      observer.disconnect();
    };
  }, [options, triggerId]);

  return isIntersecting;
};
