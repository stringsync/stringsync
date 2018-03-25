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
  withState('query', 'setQuery', ''),
  withHandlers({
    handleQueryChange: props => event => {
      // Support calling this handler with a React event and a regular string
      const query = typeof event === 'string' ? event : event.target.value;
      props.setQuery(query);
    }
  }),
  withProps(props => {
    const query = props.query.toUpperCase();
    const queriedNotations = props.notations.filter(({ attributes, relationships }) => (
      [
        attributes.artistName.toUpperCase(),
        attributes.songName.toUpperCase(),
        relationships.transcriber.attributes.name.toUpperCase(),
        ...relationships.tags.map(tag => tag.attributes.name.toUpperCase())
      ].some(tag => tag.includes(query))
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
      query={props.query}
      onChange={props.handleQueryChange}
      numQueried={props.queriedNotations.length}
    />
    <NotationGrid notations={props.queriedNotations} />
  </Outer>
));

export default NotationIndex;
