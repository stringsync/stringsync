import React from 'react';
import styled from 'react-emotion';
import { NotationGrid, NotationSearch } from './';
import { compose, withProps, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';
import { notationsActions } from 'data';

const enhance = compose(
  connect(
    state => ({
      fetchedAt: state.notations.index.fetchedAt,
      notations: state.notations.index.notations
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
    
    return { tagOptions: Array.from(tagOptions) }
  }),
  withState('queryString', 'setQueryString', ''),
  withState('queryTags', 'setQueryTags', []),
  withProps(props => ({
    clearQueries: () => {
      props.setQueryString('');
      props.setQueryTags([]);
    }
  })),
  withHandlers({
    handleQueryStringChange: props => event => {
      // Support calling this handler with a React event and a regular string
      const queryString = typeof event === 'string' ? event : event.target.value;
      props.setQueryString(queryString);
    },
    handleQueryTagsChange: props => tags => {
      props.setQueryTags(tags);
    }
  }),
  withProps(props => {
    const queryString = props.queryString.toUpperCase();
    const queriedNotations = props.notations.filter(({ attributes, relationships }) => (
      [
        attributes.artistName.toUpperCase(),
        attributes.songName.toUpperCase(),
        relationships.transcriber.attributes.name.toUpperCase(),
        ...relationships.tags.map(tag => tag.attributes.name.toUpperCase())
      ].some(tag => tag.includes(queryString))
    ));

    return {
      queriedNotations
    }
  }),
  withProps(props => ({
    /**
     * Transforms the data from the notations index endpoint into notation objects
     * for the store.
     * 
     * @param {object} json 
     * @return {object}
     */
    getNotations(json) {
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
  lifecycle({
    async componentDidMount() {
      const response = await fetch('/api/v1/notations');
      const json = await response.json();
      const notations = this.props.getNotations(json);
      this.props.setNotations(notations);
    }
  })
);

const Outer = styled('div')`
  margin-top: 24px;
`;

const NotationIndex = enhance(props => (
  <Outer>
    <NotationSearch
      queryString={props.queryString}
      queryTags={props.queryTags}
      clearQueries={props.clearQueries}
      onQueryStringChange={props.handleQueryStringChange}
      onQueryTagsChange={props.handleQueryTagsChange}
      numQueried={props.queriedNotations.length}
      tagOptions={props.tagOptions}
    />
    <NotationGrid notations={props.queriedNotations} />
  </Outer>
));

export default NotationIndex;
