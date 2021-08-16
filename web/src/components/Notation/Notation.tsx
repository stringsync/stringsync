import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MusicDisplay } from './MusicDisplay';

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
  z-index: 2;
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
  const { musicXmlUrl } = props;

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }

    const display = new MusicDisplay(div, {
      onLoadStart: startLoading,
      onLoadEnd: stopLoading,
      onResizeStart: startLoading,
      onResizeEnd: () => {
        stopLoading();
        display.renderCursor();
      },
    });

    (async () => {
      await display.load(musicXmlUrl);
      display.renderNotation();
      display.renderCursor();
    })();

    return () => {
      display.clear();
    };
  }, [musicXmlUrl, startLoading, stopLoading]);

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
