import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { Lane } from '../../../components/lane/Lane';
import { INotation } from '../../../@types/notation';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { NotationsActions } from '../../../data/notations/notationsActions';
import { fetchAllNotations } from '../../../data/notation/notationApi';
import { Table } from 'antd';
import { Box } from '../../../components/box';
import { FeaturedCheckbox } from './FeaturedCheckbox';
import { SessionRoles } from '../../../@types/session';
import { Link } from 'react-router-dom';

interface IStateProps {
  notations: INotation[];
  currentUserRole: SessionRoles;
}

interface IDispatchProps {
  setNotations: (notations: INotation[]) => void;
  resetNotations: () => void;
}

type InnerProps = IStateProps & IDispatchProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      notations: state.notations,
      currentUserRole: state.session.role
    }),
    dispatch => ({
      setNotations: (notations: INotation[]) => dispatch(NotationsActions.setNotations(notations)),
      resetNotations: () => dispatch(NotationsActions.setNotations([]))
    })
  ),
  lifecycle<InnerProps, {}, {}>({
    componentDidMount(): void {
      this.props.resetNotations();
    },
    shouldComponentUpdate(nextProps): boolean {
      return (
        this.props.notations.length === 0 ||
        this.props.currentUserRole !== nextProps.currentUserRole
      );
    },
    async componentDidUpdate(): Promise<void> {
      if (this.props.currentUserRole === 'admin') {
        const notations = await fetchAllNotations('all');
        const sorted = notations.sort((a, b) => (b.id as number) - (a.id as number));
        this.props.setNotations(sorted);
      }
    },
    componentWillUnmount(): void {
      this.props.resetNotations();
    }
  })
);

const getRowKey = (notation: INotation) => `notation-${notation.id}`;
const renderDate = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
const renderThumbnail = (src: string) => <img src={src} style={{ width: 35 }} alt="thumbnail" />;
const renderCheckbox = (_, notation: INotation) => <FeaturedCheckbox notation={notation} />;
const renderEditLink = (_, notation: INotation) => <Link to={`/n/${notation.id}/edit`}>edit</Link>;

export const NotationDashboard = enhance(props => (
  <Lane withTopMargin={true} withPadding={true}>
    <Box title="dashboard" width="100%">
      <Table
        rowKey={getRowKey}
        dataSource={props.notations}
        pagination={{ position: 'top' }}
      >
        <Table.Column
          dataIndex="thumbnailUrl"
          render={renderThumbnail}
        />
        <Table.Column
          title="featured"
          dataIndex="featured"
          render={renderCheckbox}
        />
        <Table.Column
          title="id"
          dataIndex="id"
        />
        <Table.Column
          title="created at"
          dataIndex="createdAt"
          render={renderDate}
        />
        <Table.Column
          title="song name"
          dataIndex="songName"
        />
        <Table.Column
          title="artist name"
          dataIndex="artistName"
        />
        <Table.Column
          render={renderEditLink}
        />
      </Table>
    </Box>
  </Lane>
));
