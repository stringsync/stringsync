import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { get, noop } from 'lodash';
import React, { useEffect, useRef } from 'react';
import ReactSplitPane, { SplitPaneProps } from 'react-split-pane';
import styled from 'styled-components';
import { InternalError } from '../../errors';
import { useDimensions } from '../../hooks/useDimensions';
import { Dimensions } from '../../util/types';

const HorizontalOuter = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 0;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme['@border-color']};
  z-index: 3;
`;

const VerticalOuter = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 0;
  border-right: 1px solid ${(props) => props.theme['@border-color']};
  z-index: 3;
`;

const VerticalMenuOutlined = styled(MenuOutlined)`
  transform: rotate(90deg);
`;

type Props = SplitPaneProps & {
  split: 'vertical' | 'horizontal';
  onPane1Resize?: (dimensions: Dimensions) => void;
};

export const SplitPane: React.FC<Props> = (props) => {
  // children management
  const children = React.Children.toArray(props.children);

  useEffect(() => {
    if (children.length !== 2) {
      throw new InternalError('must have exactly 2 children for <SplitPane>');
    }
  }, [children]);

  // split pane ref
  const splitPaneRef = useRef<ReactSplitPane>(null);
  const splitPane = splitPaneRef.current;
  const onMouseDown = splitPane?.onMouseDown || noop;
  const onTouchStart = splitPane?.onTouchStart || noop;
  const onMouseUp = splitPane?.onMouseUp || noop;
  const onPane1Resize = props.onPane1Resize || noop;

  // dimensions management
  const pane1 = get(splitPane, 'pane1', null);
  const pane1Dimensions = useDimensions(pane1);
  useEffect(() => {
    onPane1Resize(pane1Dimensions);
  }, [onPane1Resize, pane1Dimensions]);

  return (
    <ReactSplitPane
      allowResize={props.allowResize}
      className={props.className}
      primary={props.primary}
      minSize={props.minSize}
      maxSize={props.maxSize}
      defaultSize={props.defaultSize}
      size={props.size}
      split={props.split}
      onDragStarted={props.onDragStarted}
      onDragFinished={props.onDragFinished}
      onChange={props.onChange}
      onResizerClick={props.onResizerClick}
      onResizerDoubleClick={props.onResizerDoubleClick}
      style={props.style}
      resizerStyle={props.resizerStyle}
      paneStyle={props.paneStyle}
      pane1Style={props.pane1Style}
      pane2Style={props.pane2Style}
      resizerClassName={props.resizerClassName}
      step={props.step}
      ref={splitPaneRef}
    >
      {children[0]}
      {props.split === 'horizontal' && (
        <>
          <HorizontalOuter>
            <Button
              icon={<MenuOutlined />}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              onTouchEnd={onMouseUp}
              size="small"
              style={{ cursor: 'row-resize' }}
            />
          </HorizontalOuter>
          {children[1]}
        </>
      )}
      {props.split === 'vertical' && (
        <>
          <VerticalOuter>
            <Button
              icon={<VerticalMenuOutlined />}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              onTouchEnd={onMouseUp}
              size="small"
              style={{ cursor: 'col-resize' }}
            />
          </VerticalOuter>
          {children[1]}
        </>
      )}
    </ReactSplitPane>
  );
};
