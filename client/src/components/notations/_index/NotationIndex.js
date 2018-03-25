import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps, lifecycle } from 'recompose';
import { notationsActions } from 'data';
import { indexIncluded } from 'utilities';

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
  withProps(props => ({
    /**
     * Transforms the data from the notations index endpoint into notation objects
     * for the store.
     * 
     * @param {object} json 
     * @return {object}
     */
    getNotations(json) {
      const included = indexIncluded(json.included);

      return json.data.reduce((notations, data) => {
        const { id, attributes, links, relationships } = data;
        const tags = relationships.tags.data.map(({ id }) => included.tags[id]);
        const transcriber = included.users[relationships.transcriber.data.id];
        const video = included.videos[relationships.video.data.id];

        notations[id] = {
          attributes,
          links,
          tags,
          transcriber,
          video
        };

        return notations;
      }, {})
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

const NotationIndex = enhance(props => (
  <div>
    
  </div>
));

export default NotationIndex;
