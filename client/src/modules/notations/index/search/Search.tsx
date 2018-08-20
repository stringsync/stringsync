import * as React from 'react';
import scrollToTop from './scrollToTop';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Inputs } from './Inputs';
import { Results } from './Results';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { compose, withProps, withState, withHandlers } from 'recompose';

interface IOuterProps {
  queryString: string;
  queryTags: Set<string>;
  numFound: number;
  tags: Set<string>;
  viewportType: ViewportTypes;
  onQueryStringChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onQueryTagsChange: (tags: Set<string>) => void;
  clearQueries: () => void;
}

interface IInnerProps extends IOuterProps {
  affixOffsetBottom: number | undefined;
  affixed: boolean;
  handleAffixChange: (affixed: boolean) => void;
  handleClear: () => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withProps((props: any) => ({
    affixOffsetBottom: props.viewportType === 'MOBILE' ? 0 : undefined
  })),
  /**
   * The AffixInner styled component needs knowledge of its parent affix
   */
  withState('affixed', 'setAffixed', false),
  withHandlers({
    handleAffixChange: (props: any) => (affixed: boolean) => props.setAffixed(affixed)
  }),
  withHandlers({
    handleClear: (props: any) => () => {
      if (props.viewportType !== 'MOBILE') {
        scrollToTop();
      }

      props.clearQueries();
    }
  }),
);

interface IAffixInnerProps {
  affixed: boolean;
}

const AffixInner = styled('div')<IAffixInnerProps>`
  background: ${props => props.affixed ? '#FFFFFF' : 'transparent'};
  padding: ${props => props.affixed ? '24px' : '0'};
  transition: all 150ms ease-in;
`;

export const Search = enhance(props => (
  <div>
    <Affix
      onChange={props.handleAffixChange}
      offsetBottom={props.affixOffsetBottom}
    >
      <AffixInner affixed={props.affixed}>
        <Inputs
          queryString={props.queryString}
          queryTags={props.queryTags}
          onQueryStringChange={props.onQueryStringChange}
          onQueryTagsChange={props.onQueryTagsChange}
          onClear={props.handleClear}
          tags={props.tags}
          viewportType={props.viewportType}
        />
      </AffixInner>
    </Affix>
    <Results
      queryString={props.queryString}
      queryTags={props.queryTags}
      numFound={props.numFound}
      onClear={props.handleClear}
    />
  </div>
));
