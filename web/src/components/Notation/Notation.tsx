import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Outer = styled.div`
  margin-top: 24px;
`;

type NotationProps = {
  musicXmlUrl: string;
};

export const Notation: React.FC<NotationProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }

    const osmd = new OpenSheetMusicDisplay(div, {
      autoResize: true,
      backend: 'svg',
      drawTitle: false,
      pageBackgroundColor: 'white',
    });

    (async () => {
      await osmd.load(props.musicXmlUrl);
      osmd.render();
    })();

    return () => {};
  }, [props.musicXmlUrl]);

  return (
    <Outer>
      <div ref={divRef} />
    </Outer>
  );
};
