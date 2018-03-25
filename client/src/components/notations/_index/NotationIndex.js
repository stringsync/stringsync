import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps, lifecycle } from 'recompose';
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
  withProps(props => ({
    /**
     * Transforms the data from the notations index endpoint into notation objects
     * for the store.
     * 
     * @param {object} json 
     * @return {object}
     */
    getNotations(json) {
      const { tags, users, videos } = json.included.reduce((memo, object) => {
        const { type, id, attributes, links } = object;
        memo[type] = memo[type] || {};
        memo[type][id] = { attributes, links };
        return memo;
      }, {});
      
      return json.data.reduce((notations, data) => {

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
    Notations
  </div>
));

export default NotationIndex;
