import { compose, lifecycle, mapProps, withState } from 'recompose';
import { INotation } from '../@types/notation';
import { connect } from 'react-redux';
import { IStore } from '../@types/store';
import { NotationActions } from '../data/notation/notationActions';
import { fetchNotation } from '../data/notation/notationApi';

export interface IWithNotationProps {
  notation: INotation;
}

export type NotationIdGetter<TProps> = (props: TProps) => number;

export type NotationHandler<TProps> = (props: TProps) => any;

interface IOwnProps<TProps> {
  ownProps: TProps;
}

interface IStateProps {
  fetching: boolean;
  setFetching: (fetching: boolean) => void;
}

interface IConnectProps<TProps> extends IOwnProps<TProps> {
  notation: INotation;
  setNotation: (notation: INotation) => void;
  resetNotation: () => void;
}

export const withNotation = <TProps>(
  getNotationId: NotationIdGetter<TProps>,
  onSuccess: NotationHandler<TProps>,
  onError: NotationHandler<TProps>,
  onChange: NotationHandler<TProps>) => (
    BaseComponent => {
      const enhance = compose<IWithNotationProps & TProps, TProps>(
        mapProps<IOwnProps<TProps>, TProps>(ownProps => ({ ownProps })),
        connect(
          (state: IStore) => ({
            notation: state.notation
          }),
          dispatch => ({
            setNotation: (notation: INotation) => dispatch(NotationActions.setNotation(notation)),
            resetNotation: () => dispatch(NotationActions.resetNotation())
          })
        ),
        lifecycle<IConnectProps<TProps>, {}, {}>({
          componentDidMount(): void {
            this.props.resetNotation();
          },
          componentDidUpdate(prevProps): void {
            const prevNotationId = getNotationId(prevProps.ownProps);
            const notationId = getNotationId(this.props.ownProps);

            if (prevNotationId !== notationId) {
              this.props.resetNotation();
              onChange(this.props.ownProps);
            }
          },
          componentWillUnmount(): void {
            this.props.resetNotation();
          }
        }),
        withState('fetching' , 'setFetching', false),
        lifecycle<IConnectProps<TProps> & IStateProps, {}, {}>({
          async componentDidUpdate(): Promise<void> {
            const notationId = getNotationId(this.props.ownProps);

            if (this.props.fetching || this.props.notation.id === notationId) {
              return;
            }

            try {
              if (isNaN(notationId)) {
                throw new Error(`'${notationId}' is not a valid notation id`);
              }

              this.props.setFetching(true);
              const notation = await fetchNotation(notationId);
              this.props.setNotation(notation);
              onSuccess(this.props.ownProps);
            } catch (error) {
              console.error(error);
              window.ss.message.error(`could not load notation '${notationId}'`);
              onError(this.props.ownProps);
            }

            this.props.setFetching(false);
          }
        }),
        mapProps<any, any>(props => ({
          ...props.ownProps,
          notation: props.notation
        }))
      );

      return enhance(BaseComponent);
    });
