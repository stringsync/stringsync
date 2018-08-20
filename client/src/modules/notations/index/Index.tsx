import * as React from 'react';
import styled from 'react-emotion';
import { BackTop } from 'antd';
import { Grid } from './Grid';
import { Search } from './search/Search.tsx';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { compact } from 'lodash';
import { compose, withProps, withState, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { fetchNotations } from 'data';
import { RouteComponentProps } from 'react-router';

type OuterProps = RouteComponentProps<{}>;

interface IInnerProps {
  queryString: string;
  queryTags: Set<string>;
  queriedNotations: Notation.INotation[];
  tags: Set<string>;
  notations: Notation.INotation[];
  viewportType: ViewportTypes;
  fetchNotations: () => any;
  handleQueryStringChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleQueryTagsChange: (tags: Set<string>) => void;
  clearQueries: () => void;
}

const enhance = compose<IInnerProps, OuterProps>(
  connect(
    (state: Store.IState) => ({
      notations: state.notations,
      viewportType: state.viewport.type
    }),
    dispatch => ({
      fetchNotations: () => dispatch(fetchNotations() as any)
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
  lifecycle<IInnerProps, {}>({
    async componentDidMount() {
      try {
        await this.props.fetchNotations();
      } catch (error) {
        window.ss.message.error('could not load notations');
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

export const Index = enhance(props => (
  <Outer>
    <BackTop />
    <Search
      queryString={props.queryString}
      queryTags={props.queryTags}
      clearQueries={props.clearQueries}
      onQueryStringChange={props.handleQueryStringChange}
      onQueryTagsChange={props.handleQueryTagsChange}
      numFound={props.queriedNotations.length}
      tags={props.tags}
      viewportType={props.viewportType}
    />
    <Grid notations={props.queriedNotations} queryTags={props.queryTags} />
  </Outer>
));
