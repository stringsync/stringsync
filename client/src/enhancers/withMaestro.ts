import { compose } from 'recompose';
import { Maestro } from '../models/maestro/Maestro';
import { connect } from 'react-redux';
import { IStore } from '../@types/store';
import { ScoreActions } from '../data/score/scoreActions';

export interface IMaestroProps {
  maestro: Maestro | null;
  setMaestro: (maestro: Maestro) => void;
  resetMaestro: () => void;
}

interface IStateProps {
  maestro: Maestro | null;
}

interface IDispatchProps {
  setMaestro: (maestro: Maestro) => void;
  resetMaestro: () => void;
}

export const withMaestro = <TProps>(BaseComponent) => {
  const enhance = compose<IMaestroProps & TProps, TProps>(
    connect<IStateProps, IDispatchProps, {}, IStore>(
      state => ({
        maestro: state.score.maestro
      }),
      dispatch => ({
        setMaestro: (maestro: Maestro) => dispatch(ScoreActions.setMaestro(maestro)),
        resetMaestro: () => dispatch(ScoreActions.setMaestro(null))
      })
    )
  );

  return enhance(BaseComponent);
};
