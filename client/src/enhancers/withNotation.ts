import { compose, lifecycle, mapProps } from 'recompose';
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

interface IConnectProps<TProps> extends IOwnProps<TProps> {
  notation: INotation;
  setNotation: (notation: INotation) => void;
  resetNotation: () => void;
}

export const withNotation = <TProps>(
  getNotationId: NotationIdGetter<TProps>,
  onSuccess: NotationHandler<TProps>,
  onError: NotationHandler<TProps>) => (
    BaseComponent => {
      const enhance = compose<IWithNotationProps, TProps>(
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
          async componentDidMount(): Promise<void> {
            const notationId = getNotationId(this.props.ownProps);

            try {
              if (isNaN(notationId)) {
                throw new Error(`'${notationId}' is not a valid notation id`);
              }

              const notation = await fetchNotation(notationId);
              this.props.setNotation(notation);
              onSuccess(this.props.ownProps);
            } catch (error) {
              console.error(error);
              window.ss.message.error(`could not load notation '${notationId}'`);
              onError(this.props.ownProps);
            }
          }
        }),
        mapProps<any, any>(props => ({
          ...props.ownProps,
          notation: props.notation
        }))
      );

      return enhance(BaseComponent);
    });
