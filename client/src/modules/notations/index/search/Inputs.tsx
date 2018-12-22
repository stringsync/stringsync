import * as React from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import withSizes from 'react-sizes';
import { scrollToTop } from './scrollToTop';
import { Input, Icon, Row, Tag } from 'antd';
import { connect } from 'react-redux';
import { IStore } from '../../../../@types/store';
import styled from 'react-emotion';

interface IOuterProps {
  queryString: string;
  queryTags: string[];
  setQueryString: (queryString: string) => void;
  setQueryTags: (queryTags: string[]) => void;
  onClear: () => void;
}

interface IConnectProps extends IOuterProps {
  tags: string[];
}

interface ISizesProps extends IConnectProps {
  isGtMobile: boolean;
}

interface IHandlerProps extends ISizesProps {
  handleQueryStringChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleQueryTagsChange: (tag: string) => (checked: boolean) => void;
}

interface IInnerProps extends IHandlerProps {
  suffix: JSX.Element | null;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect((state: IStore) => {
    const tags = state.notations.reduce((tagSet, notation) => {
      notation.tags.forEach(tag => tagSet.add(tag));
      return tagSet;
    }, new Set());

    return { tags: Array.from(tags).sort() };
  }),
  withSizes(size => ({ isGtMobile: withSizes.isGtMobile(size) })),
  withHandlers<IOuterProps, any>({
    handleQueryStringChange: props => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (props.isGtMobile) {
        scrollToTop();
      }

      props.setQueryString(event.target.value);
    },
    handleQueryTagsChange: props => (tag: string) => (checked: boolean) => {
      if (props.isGtMobile) {
        scrollToTop();
      }

      const nextQueryTags = new Set(props.queryTags);
      if (checked) {
        nextQueryTags.add(tag);
      } else {
        nextQueryTags.delete(tag);
      }

      props.setQueryTags(Array.from(nextQueryTags));
    }
  }),
  withProps<any, IHandlerProps>(props => {
    const suffix = props.queryString
      ? <Icon type="close-circle-o" onClick={props.onClear} style={{ cursor: 'pointer' }} />
      : null;

    return { suffix };
  })
);

const Outer = styled('div')<{ isGtMobile: boolean}>`
  padding: 0 ${props => props.isGtMobile ? 0 : 16}px;
`;

const TagWrapper = styled('span')`
  margin-top: 6px;
`;

export const Inputs = enhance(props => {
  const queryTags = new Set(props.queryTags);

  return (
    <Outer isGtMobile={props.isGtMobile}>
      <Input
        type="text"
        placeholder="song, artist, or transcriber name"
        value={props.queryString}
        prefix={<Icon type="search" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
        onChange={props.handleQueryStringChange}
        suffix={props.suffix}
      />
      <Row type="flex" justify="center" align="middle">
        {
          Array.from(props.tags).map(tag => (
            <TagWrapper key={tag}>
              <Tag.CheckableTag
                onChange={props.handleQueryTagsChange(tag)}
                checked={queryTags.has(tag)}
              >
                {tag}
              </Tag.CheckableTag>
            </TagWrapper>
          ))
        }
      </Row>
    </Outer>
  );
});
