import React from 'react';
import styled from 'react-emotion';
import { NotationGrid, NotationSearch } from './';
import { compose, setDisplayName, withProps, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { BackTop } from 'antd';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';
import { notationsActions } from 'data';

const enhance = compose(
  setDisplayName('NotationIndex'),
  connect(
    state => ({
      fetchedAt: state.notations.index.fetchedAt,
      notations: state.notations.index.notations,
      viewportType: state.viewport.type
    }),
    dispatch => ({
      setNotations: notations => dispatch(notationsActions.notations.index.set(notations))
    })
  ),
  withProps(props => {
    const tagOptions = new Set();
    props.notations.forEach(notation => {
      notation.relationships.tags.forEach(tag => tagOptions.add(tag.attributes.name));
    });
    return { tagOptions: Array.from(tagOptions).sort() }
  }),
  withState('queryString', 'setQueryString', ''),
  withState('queryTags', 'setQueryTags', new Set()),
  withProps(props => ({
    clearQueries: () => {
      props.setQueryString('');
      props.setQueryTags(new Set());
    }
  })),
  withHandlers({
    handleQueryStringChange: props => event => {
      props.setQueryString(event.target.value);
    },
    handleQueryTagsChange: props => tags => {
      props.setQueryTags(tags);
    }
  }),
  withProps(props => {
    const queryTags = Array.from(props.queryTags).map(tag => tag.toUpperCase());
    const queryString = props.queryString.toUpperCase();

    const queriedNotations = props.notations
      // On the first pass, filter the notations that match props.queryTags
      .filter(notation => {
        const notationTags = new Set(notation.relationships.tags.map(tag => tag.attributes.name.toUpperCase()));
        // For a notation to match, it must have _every_ queryTag (and then maybe some others)
        return queryTags.every(queryTag => notationTags.has(queryTag));
      })
      // On the second pass, filter the notations that match props.queryString
      .filter(({ attributes, relationships }) => {
        const matchers = [
          attributes.artistName.toUpperCase(),
          attributes.songName.toUpperCase(),
          relationships.transcriber.attributes.name.toUpperCase()
        ]
        
        return matchers.some(matcher => matcher.includes(queryString))
      });

    return { queriedNotations }
  }),
  withProps(props => ({
    /**
     * Transforms the data from the notations index endpoint into notation objects
     * for the store
     * 
     * @param {object} json 
     * @return {object}
     */
    extractNotations(json) {
      const included = indexIncludedObjects(json.included);

      const notations = json.data.map(data => {
        const { id, attributes, links, relationships } = data;
        const tags = relationships.tags.data.map(({ id }) => included.tags[id]);
        const transcriber = included.users[relationships.transcriber.data.id];
        const video = included.videos[relationships.video.data.id];

        return camelCaseKeys({
          id,
          attributes,
          links,
          relationships: {
            tags,
            transcriber,
            video
          }
        }, true);
      });

      return notations;
    }
  })),
  withProps(props => ({
    fetchNotations: async () => {
      const response = await fetch('/api/v1/notations');
      const json = await response.json()
      return props.extractNotations(json);
    }
  })),
  lifecycle({
    async componentDidMount() {
      const twentyMinsAgo = Date.now() - (60 * 20 * 1000);
      if (this.props.notations.length === 0 || this.props.fetchedAt < twentyMinsAgo) {
        try {
          const notations = await this.props.fetchNotations();
          this.props.setNotations(notations);
        } catch (error) {
          window.ss.message.error('Notations could not load');
        }
      }
    }
  })
);

const Outer = styled('div')`
  margin-top: 24px;
  max-width: 100%;
  overflow-x: hidden;
`;

const NotationIndex = enhance(props => (
  <Outer>
    <BackTop />
    <NotationSearch
      queryString={props.queryString}
      queryTags={props.queryTags}
      clearQueries={props.clearQueries}
      onQueryStringChange={props.handleQueryStringChange}
      onQueryTagsChange={props.handleQueryTagsChange}
      numQueried={props.queriedNotations.length}
      tagOptions={props.tagOptions}
      viewportType={props.viewportType}
    />
    <NotationGrid
      notations={props.queriedNotations}
      queryTags={props.queryTags}
    />
  </Outer>
));

export default NotationIndex;
