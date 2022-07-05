import { noop } from 'lodash';
import React, { useEffect, useRef } from 'react';

type Props = {
  onEnter?: () => void;
  onExit?: () => void;
};

export const IntersectionTrigger: React.FC<Props> = (props) => {
  const onEnter = props.onEnter || noop;
  const onExit = props.onExit || noop;

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }
    if (!onEnter && !onExit) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onEnter();
      } else {
        onExit();
      }
    });

    observer.observe(div);
    return () => {
      observer.disconnect();
    };
  }, [divRef, onEnter, onExit]);

  return (
    <div data-testid="intersection-trigger" ref={divRef}>
      <br />
    </div>
  );
};
