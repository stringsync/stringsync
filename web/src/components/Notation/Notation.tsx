import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { StringsyncOpenSheetMusicDisplay } from './StringsyncOpenSheetMusicDisplay';

const Outer = styled.div`
  margin-top: 24px;
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 10;
  text-align: center;
`;

const Loading = styled.small`
  margin-top: 36px;
`;

type NotationProps = {
  musicXmlUrl: string;
};

export const Notation: React.FC<NotationProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    const osmd = new StringsyncOpenSheetMusicDisplay(div, {
      autoResize: true,
      disableCursor: false,
      backend: 'svg',
      drawTitle: false,
      pageBackgroundColor: 'white',
      drawingParameters: 'compacttight',
      onResizeStart: startLoading,
      onResizeEnd: stopLoading,
    });

    (async () => {
      try {
        startLoading();
        await osmd.load(props.musicXmlUrl);
        osmd.render();
      } finally {
        stopLoading();
      }
    })();

    return () => {};
  }, [props.musicXmlUrl]);

  return (
    <Outer>
      {isLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <div ref={divRef} />
    </Outer>
  );
};
