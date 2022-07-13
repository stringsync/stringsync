import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { clamp } from 'lodash';
import React, { CSSProperties, PropsWithChildren, useCallback, useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { usePrevious } from '../hooks/usePrevious';
import { InternalError } from '../lib/errors';

// Inspired by https://github.com/tomkp/react-split-pane

type Split = 'horizontal' | 'vertical';

const HorizontalOuter = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  position: absolute;
  outline: none;
  overflow: hidden;
  user-select: text;
  bottom: 0;
  flex-direction: column;
  min-height: 100%;
  top: 0;
  width: 100%;
`;

const HorizontalDivider = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 0;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme['@border-color']};
  user-select: inherit !important;
`;

const HorizontalPane1 = styled.div<{ px: number }>`
  position: relative;
  outline: none;
  height: ${(props) => props.px}px;
  display: flex;
  flex: none;
`;

const HorizontalPane2 = styled.div`
  flex: 1;
`;

const VerticalOuter = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  position: absolute;
  outline: none;
  overflow: hidden;
  user-select: text;
  flex-direction: row;
  left: 0;
  right: 0;
  width: 100%;
`;

const VerticalDivider = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 0;
  border-right: 1px solid ${(props) => props.theme['@border-color']};
  user-select: inherit !important;
`;

const VerticalMenuOutlined = styled(MenuOutlined)`
  transform: rotate(90deg);
`;

const VerticalPane1 = styled.div<{ px: number }>`
  flex: none;
  position: relative;
  outline: none;
  width: ${(props) => props.px}px;
`;

const VerticalPane2 = styled.div`
  width: 100%;
`;

const unfocus = () => {
  try {
    document.getSelection()?.removeAllRanges();
  } catch (e) {
    // noop
  }
  try {
    window.getSelection()?.removeAllRanges();
  } catch (e) {
    // noop
  }
};

export type SlidingWindowProps = PropsWithChildren<{
  split?: Split;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onSlideEnd?: (size: number) => void;
  pane1Style?: CSSProperties;
  pane2Style?: CSSProperties;
  dividerZIndexOffset?: number;
}>;

export const SlidingWindow: React.FC<SlidingWindowProps> = (props) => {
  const children = props.children;
  const split = props.split || 'horizontal';
  const defaultSize = props.defaultSize ?? 200;
  const minSize = props.minSize ?? 200;
  const maxSize = props.maxSize ?? 500;
  const onSlideEnd = props.onSlideEnd || null;
  const pane1Style = useMemoCmp(props.pane1Style || {});
  const pane2Style = useMemoCmp(props.pane2Style || {});
  const dividerZIndexOffset = props.dividerZIndexOffset ?? 0;

  // ids
  const idPrefix = useId();
  const buttonId = `${idPrefix}-btn`;
  const pane1Id = `${idPrefix}-pane1`;
  const pane2Id = `${idPrefix}-pane2`;

  // error handling
  useEffect(() => {
    if (React.Children.count(children) !== 2) {
      throw new InternalError('must have exactly two children for <Frame>');
    }
  }, [children]);
  useEffect(() => {
    if (minSize < 0) {
      throw new InternalError('minSize must be >= 0');
    }
    if (maxSize < 0) {
      throw new InternalError('maxSize must be >= 0');
    }
    if (maxSize < minSize) {
      throw new InternalError('maxSize must be greater than or equal to minSize');
    }
  }, [minSize, maxSize]);

  // size
  const [size, setSize] = useState(() => defaultSize);
  useEffect(() => {
    setSize((size) => {
      if (size < minSize) {
        return minSize;
      }
      if (size > maxSize) {
        return maxSize;
      }
      return size;
    });
  }, [minSize, maxSize]);

  // active state
  const [active, setActive] = useState(false);
  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  // start
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const onStart = (x: number, y: number) => {
    setStartX(x);
    setStartY(y);
    activate();
  };
  const onMouseDown: React.MouseEventHandler = (event) => {
    onStart(event.clientX, event.clientY);
  };
  const onTouchStart: React.TouchEventHandler = (event) => {
    onStart(event.touches[0].clientX, event.touches[0].clientY);
  };

  // active
  const outerRef = useRef<HTMLDivElement>(null);
  const pane1Ref = useRef<HTMLDivElement>(null);
  const pane2Ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) {
      return;
    }
    const outer = outerRef.current;
    if (!outer) {
      return;
    }
    const pane1 = pane1Ref.current;
    if (!pane1) {
      return;
    }
    const pane2 = pane2Ref.current;
    if (!pane2) {
      return;
    }

    const onMove = (x: number, y: number) => {
      unfocus();

      const pane1Rect = pane1.getBoundingClientRect();
      const minX = split === 'vertical' ? pane1Rect.x + minSize : Number.NEGATIVE_INFINITY;
      const minY = split === 'horizontal' ? pane1Rect.y + minSize : Number.NEGATIVE_INFINITY;
      const maxX = split === 'vertical' ? pane1Rect.x + maxSize : Number.POSITIVE_INFINITY;
      const maxY = split === 'horizontal' ? pane1Rect.y + maxSize : Number.POSITIVE_INFINITY;

      x = clamp(x, minX, maxX);
      y = clamp(y, minY, maxY);

      switch (split) {
        case 'horizontal':
          setSize(y - pane1Rect.y);
          break;
        case 'vertical':
          setSize(x - pane1Rect.x);
          break;
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      onMove(event.clientX, event.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      onMove(event.touches[0].clientX, event.touches[0].clientY);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [active, split, minSize, maxSize, startX, startY]);

  // end
  useEffect(() => {
    if (!active) {
      return;
    }
    const onEnd = () => {
      const button = document.getElementById(buttonId);
      button?.blur();
      deactivate();
    };
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
    return () => {
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchend', onEnd);
    };
  }, [active, buttonId, deactivate]);

  // slide end
  const prevActive = usePrevious(active);
  useEffect(() => {
    if (!onSlideEnd) {
      return;
    }
    if (!prevActive) {
      return;
    }
    if (active) {
      return;
    }
    onSlideEnd(size);
  }, [onSlideEnd, prevActive, active, size]);

  // z-index for divider must be pane1ZIndex + 1
  const [pane1ZIndex, setPane1ZIndex] = useState(1);
  const [pane2ZIndex, setPane2ZIndex] = useState(1);
  const dividerZIndex = Math.max(pane1ZIndex, pane2ZIndex) + 1 + dividerZIndexOffset;
  useEffect(() => {
    const pane1 = document.getElementById(pane1Id);
    const pane2 = document.getElementById(pane2Id);
    if (!pane1 || !pane2) {
      return;
    }

    const getZIndex = (element: Element) => {
      const zIndex = parseInt(getComputedStyle(element).zIndex || '1', 10);
      return Number.isInteger(zIndex) ? zIndex : 1;
    };
    const nextPane1ZIndex = getZIndex(pane1);
    const nextPane2ZIndex = getZIndex(pane2);
    setPane1ZIndex(nextPane1ZIndex);
    setPane2ZIndex(nextPane2ZIndex);

    const mutationObserver = new MutationObserver(() => {
      const nextPane1ZIndex = getZIndex(pane1);
      const nextPane2ZIndex = getZIndex(pane2);
      setPane1ZIndex(nextPane1ZIndex);
      setPane2ZIndex(nextPane2ZIndex);
    });
    mutationObserver.observe(pane1, {
      attributes: true,
      attributeFilter: ['style'],
    });
    mutationObserver.observe(pane2, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [pane1Id, pane2Id]);

  const [pane1, pane2] = React.Children.toArray(children);

  const isHorizontal = split === 'horizontal';
  const isVertical = split === 'vertical';

  return (
    <>
      {isHorizontal && (
        <HorizontalOuter ref={outerRef}>
          <HorizontalPane1 id={pane1Id} px={size} ref={pane1Ref} style={pane1Style}>
            {pane1}
          </HorizontalPane1>
          <HorizontalPane2 id={pane2Id} ref={pane2Ref} style={pane2Style}>
            <HorizontalDivider style={{ zIndex: dividerZIndex }}>
              <Button
                id={buttonId}
                icon={<MenuOutlined />}
                size="small"
                style={{ cursor: 'row-resize' }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
              />
            </HorizontalDivider>
            {pane2}
          </HorizontalPane2>
        </HorizontalOuter>
      )}

      {isVertical && (
        <VerticalOuter ref={outerRef}>
          <VerticalPane1 id={pane1Id} px={size} ref={pane1Ref} style={pane1Style}>
            {pane1}
          </VerticalPane1>
          <VerticalPane2 id={pane2Id} ref={pane2Ref}>
            <VerticalDivider style={{ zIndex: dividerZIndex }}>
              <Button
                id={buttonId}
                icon={<VerticalMenuOutlined />}
                size="small"
                style={{ cursor: 'col-resize' }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
              />
            </VerticalDivider>
            {pane2}
          </VerticalPane2>
        </VerticalOuter>
      )}
    </>
  );
};
