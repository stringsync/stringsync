import React, { useEffect, useRef, useState } from 'react';
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
  onMusicDisplayChange?: (musicDisplay: MusicDisplay | null) => void;
};

export const Notation: React.FC<NotationProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay | null>(null);
  const { musicXmlUrl, onMusicDisplayChange } = props;

  useEffect(() => {
    if (onMusicDisplayChange) {
      onMusicDisplayChange(musicDisplay);
    }
  }, [musicDisplay, onMusicDisplayChange]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    const musicDisplay = new MusicDisplay(div, {
      onLoadStart: startLoading,
      onLoadEnd: stopLoading,
      onResizeStart: startLoading,
      onResizeEnd: stopLoading,
    });
    setMusicDisplay(musicDisplay);

    (async () => {
      await musicDisplay.load(musicXmlUrl);
      musicDisplay.render();
    })();

    return () => {
      musicDisplay.clear();
      setMusicDisplay(null);
    };
  }, [musicXmlUrl]);

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
