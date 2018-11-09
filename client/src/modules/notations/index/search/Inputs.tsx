import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import withSizes from 'react-sizes';
import { scrollToTop } from './scrollToTop';
import { Input, Icon, Row, Tag } from 'antd';

interface IOuterProps {
  queryString: string;
  queryTags: string[];
  setQueryString: (queryString: string) => void;
  setQueryTags: (queryTags: string[]) => void;
  onClear: () => void;
}

interface IInnerProps extends IOuterProps {
  suffix: JSX.Element | null;
  handleQueryStringChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleQueryTagsChange: (tag: string) => (checked: boolean) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
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
  })
);

export const Inputs = enhance(props => (
  <div>
    <Input
      type="text"
      placeholder="song, artist, or transcriber name"
      value={props.queryString}
      prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
      onChange={props.handleQueryStringChange}
      suffix={props.suffix}
    />
    <Row type="flex" justify="center" align="middle">
      {
        [].map(tagName => (
          <Tag.CheckableTag
            key={tagName}
            onChange={props.handleQueryTagsChange(tagName)}
            checked={true}
          >
            {tagName}
          </Tag.CheckableTag>
        ))
      }
    </Row>
  </div>
));
