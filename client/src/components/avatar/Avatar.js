import React from 'react';
import { Avatar as AntdAvatar } from 'antd';
import styled from 'react-emotion';
import { compose, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    src: PropTypes.string,
    name: PropTypes.string
  }),
  withProps(props => {
    let initials = '';

    if (props.name && props.name.length > 0) {
      initials = props.name[0].toUpperCase();
    }

    return { initials }
  })
);

const Avatar = enhance(props => props.src ? <AntdAvatar src={props.src} /> : <AntdAvatar>{props.initials}</AntdAvatar>);


export default Avatar;