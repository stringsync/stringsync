import * as React from 'react';
import { compose, withStateHandlers, withProps, withHandlers } from 'recompose';
import withSizes from 'react-sizes';
import { scrollToTop } from './scrollToTop';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Inputs } from './Inputs';
import { Results } from './Results';

interface IOuterProps {
  queryString: string;
  queryTags: string[];
  numQueried: number;
  setQueryString: (queryString: string) => void;
  setQueryTags: (queryTags: string[]) => void;
}

interface ISizesProps extends IOuterProps {
  isMobile: boolean;
}

interface IAffixProps extends ISizesProps {
  affixOffsetBottom: 0 | undefined;
}

interface IStateProps extends IAffixProps {
  affixed: boolean;
  handleAffixChange: (affixed?: boolean) => void;
}

interface IClearProps extends IStateProps {
  handleClear: () => void;
}

const enhance = compose<IClearProps, IOuterProps>(
  withSizes(size => ({ isMobile: withSizes.isMobile(size) })),
  withProps<any, ISizesProps>(props => ({
    affixOffsetBottom: props.isMobile ? 0 : undefined
  })),
  withStateHandlers(
    { affixed: false },
    { handleAffixChange: () => affixed => ({ affixed }) }
  ),
  withHandlers<IStateProps, any>({
    handleClear: props => () => {
      if (props.isMobile) {
        scrollToTop();
      }

      props.setQueryString('');
      props.setQueryTags([]);
    }
  })
);

const AffixInner = styled('div')<{ affixed: boolean }>`
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
          setQueryString={props.setQueryString}
          setQueryTags={props.setQueryTags}
          onClear={props.handleClear}
        />
        <Results
          numQueried={props.numQueried}
          queryString={props.queryString}
          queryTags={props.queryTags}
          onClear={props.handleClear}
        />
      </AffixInner>
    </Affix>
  </div>
));
