import { noop } from 'lodash';
import React, { useEffect, useRef } from 'react';

type Props = {
  onIntersectionEnter?: () => void;
  onIntersectionExit?: () => void;
};

export const IntersectionTrigger: React.FC<Props> = (props) => {
  const onIntersectionEnter = props.onIntersectionEnter || noop;
  const onIntersectionExit = props.onIntersectionExit || noop;

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }
    if (!onIntersectionEnter && !onIntersectionExit) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        onIntersectionEnter();
      } else {
        onIntersectionExit();
      }
    }, {});

    observer.observe(div);
    return () => {
      observer.disconnect();
    };
  }, [divRef, onIntersectionEnter, onIntersectionExit]);

  return <div data-testid="intersection-trigger" ref={divRef}></div>;
};
