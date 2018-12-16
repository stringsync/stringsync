import * as React from 'react';
import { Skeleton, Tooltip } from 'antd';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import styled from 'react-emotion';
import { truncate } from 'lodash';

interface IStateProps {
  artistName: string;
  songName: string;
  thumbnailUrl: string;
}

interface ILoadingProps {
  loading: boolean;
}

type InnerProps = IStateProps & ILoadingProps ;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, {}, {}, IStore>(
    state => ({
      artistName: state.notation.artistName,
      songName: state.notation.songName,
      thumbnailUrl: state.notation.thumbnailUrl
    })
  ),
  withProps<ILoadingProps, IStateProps >(props => ({
    loading: !props.artistName || !props.songName || !props.thumbnailUrl
  }))
);

const Img = styled('img')`
  min-width: 36px;
  min-height: 36px;
  width: 36px;
  height: 36px;
`;

export const Detail = enhance(props => (
  <Skeleton
    loading={props.loading}
    avatar={true}
    paragraph={false}
    active={true}
  >
    <Tooltip title={`${props.songName} by ${props.artistName}`}>
      <Img src={props.thumbnailUrl} alt={props.songName} />
    </Tooltip>
  </Skeleton>
));
