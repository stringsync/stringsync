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
  const { musicXmlUrl } = props;

  const divRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    const osmd = new MusicDisplay(div, {
      onLoadStart: startLoading,
      onLoadEnd: stopLoading,
      onResizeStart: startLoading,
      onResizeEnd: stopLoading,
    });

    (async () => {
      await osmd.load(musicXmlUrl);
      osmd.render();
    })();

    return () => {};
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
