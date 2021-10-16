import { MenuOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { noop } from 'lodash';
import React, { useEffect, useRef } from 'react';
import ReactSplitPane, { SplitPaneProps } from 'react-split-pane';
import styled from 'styled-components';
import { InternalError } from '../../errors';

const HorizontalOuter = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 0;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme['@border-color']};
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
`;

const VerticalMenuOutlined = styled(MenuOutlined)`
  transform: rotate(90deg);
`;

export const SplitPane: React.FC<SplitPaneProps & { split: 'vertical' | 'horizontal' }> = (props) => {
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

  return (
    <ReactSplitPane {...props} ref={splitPaneRef}>
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
