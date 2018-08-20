import * as React from 'react';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { compose, withHandlers, withProps } from 'recompose';
import { Icon, Input, Tag } from 'antd';
import scrollToTop from './scrollToTop';
import styled from 'react-emotion';

interface IOuterProps {
  queryString: string;
  queryTags: Set<string>;
  tags: Set<string>;
  viewportType: ViewportTypes;
  onQueryStringChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onQueryTagsChange: (tags: Set<string>) => void;
  onClear: () => void;
}

interface IInnerProps extends IOuterProps {
  suffix: JSX.Element | null;
  handleQueryStringChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleQueryTagsChange: (tag: string) => (checked: boolean) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withHandlers({
    handleQueryStringChange: (props: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (props.viewportType !== 'MOBILE') {
        scrollToTop();
      }

      props.onQueryStringChange(event);
    },
    handleQueryTagsChange: (props: any) => (tag: string) => (checked: boolean) => {
      if (props.viewportType !== 'MOBILE') {
        scrollToTop();
      }

      const nextQueryTags = new Set([...Array.from(props.queryTags)]);
      if (checked) {
        nextQueryTags.add(tag);
      } else {
        nextQueryTags.delete(tag);
      }

      props.onQueryTagsChange(nextQueryTags);
    }
  }),
  withProps((props: any) => {
    const suffix = props.queryString
      ? <Icon type="close-circle-o" onClick={props.onClear} style={{ cursor: 'pointer' }} />
      : null

    return { suffix }
  })
);

interface IOuterDivProps {
  viewportType: ViewportTypes;
}

const Outer = styled('div')<IOuterDivProps>`
  max-width: ${props => props.viewportType === 'MOBILE' ? '95%' : '100%'};
  margin: ${props => props.viewportType === 'TABLET' ? '0 16px' : '0 auto'};
`;

const TagsOuter = styled('div')`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TagOuter = styled('span')`
  margin-top: 2px;
`;

export const Inputs = enhance(props => (
  <Outer viewportType={props.viewportType}>
    <Input
      type="text"
      placeholder="song, artist, or transcriber name"
      value={props.queryString}
      prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
      onChange={props.handleQueryStringChange}
      suffix={props.suffix}
    />
    <TagsOuter>
      {
        Array.from(props.tags).map(tagName => (
          <TagOuter key={tagName}>
            <Tag.CheckableTag
              onChange={props.handleQueryTagsChange(tagName)}
              checked={props.queryTags.has(tagName)}
            >
              {tagName}
            </Tag.CheckableTag>
          </TagOuter>
        ))
      }
    </TagsOuter>
  </Outer>
));
