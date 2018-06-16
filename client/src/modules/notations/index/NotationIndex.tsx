import * as React from 'react';
import styled from 'react-emotion';
import { BackTop } from 'antd';
import { connect } from 'react-redux';
import { compose, ComponentEnhancer, withProps, withState, withHandlers, lifecycle } from 'recompose';
import { fetchAllNotations } from 'data';
import { NotationSearch } from './search';
import { ViewportTypes } from '../../../data/viewport/getViewportType';
import { compact } from 'lodash';
import { NotationGrid } from './NotationGrid';

interface IInnerProps {
  queryString: string;
  queryTags: Set<string>;
  queriedNotations: Notation.INotation[];
  tags: Set<string>;
  notations: Notation.INotation[];
  viewportType: ViewportTypes;
  handleQueryStringChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleQueryTagsChange: (tags: Set<string>) => void;
  clearQueries: () => void;
}

const enhance = compose<IInnerProps, any>(
  connect(
    (state: StringSync.Store.IState) => ({
      notations: state.notations.index,
      viewportType: state.viewport.type
    }),
    dispatch => ({
      fetchAllNotations: () => dispatch(fetchAllNotations() as any)
    })
  ),
  withProps((props: { notations: Notation.INotation[] }) => {
    const tags = new Set();
    props.notations.forEach(notation => {
        notation.tags.forEach(tag => tags.add(tag));
    });

    return { tags: Array.from(tags).sort() };
  }),
  withState('queryString', 'setQueryString', ''),
  withState('queryTags', 'setQueryTags', new Set()),
  withProps((props: any) => ({
    clearQueries: () => {
      props.setQueryString('');
      props.setQueryTags(new Set());
    }
  })),
  withHandlers({
    handleQueryStringChange: (props: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setQueryString(event.target.value);
    },
    handleQueryTagsChange: (props: any) => (tags: Set<string>) => {
      props.setQueryTags(tags);
    }
  }),
  withProps((props: any) => {
    const queryTags: string[] = Array.from(props.queryTags).map((tag: string) => tag.toUpperCase());
    const queryString: string = props.queryString.toUpperCase();

    const queriedNotations = props.notations
      // On the first pass, filter the notations that match props.queryTags
      .filter((notation: Notation.INotation) => {
        const notationTags = new Set(notation.tags.map(tag => tag.toUpperCase()));
        // For a notation to match, it must have _every_ queryTag (and then maybe some others)
        return queryTags.every(queryTag => notationTags.has(queryTag));
      })
      // On the second pass, filter the notations that match props.queryString
      .filter((notation: Notation.INotation) => {

        const matchers = compact([
          notation.artistName.toUpperCase(),
          notation.songName.toUpperCase(),
          notation.transcriber && notation.transcriber.name.toUpperCase()
        ]);

        return matchers.some(matcher => matcher.includes(queryString))
      });

    return { queriedNotations }
  }),
  lifecycle<any, any, any>({
    async componentDidMount() {
      try {
        await this.props.fetchAllNotations();
      } catch (error) {
        window.ss.message.error('Notations could not load');
      }
    }
  })
);

const Outer = styled('div')`
  overflow-x: hidden;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 24px;
`;

export const NotationIndex = enhance(props => (
  <Outer>
    <BackTop />
    <NotationSearch
      queryString={props.queryString}
      queryTags={props.queryTags}
      clearQueries={props.clearQueries}
      onQueryStringChange={props.handleQueryStringChange}
      onQueryTagsChange={props.handleQueryTagsChange}
      numQueriedNotations={props.queriedNotations.length}
      tags={props.tags}
      viewportType={props.viewportType}
    />
    <NotationGrid
      notations={props.queriedNotations}
      queryTags={props.queryTags}
    />
  </Outer>
));
