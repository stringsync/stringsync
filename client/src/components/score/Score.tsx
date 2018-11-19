import * as React from 'react';
import { lifecycle, compose } from 'recompose';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import xml from './example.xml';

interface IProps {
  src: string;
}

const enhance = compose<IProps, IProps>(
  lifecycle({
    async componentDidMount() {
      const osmd = new OpenSheetMusicDisplay('score');
      await osmd.load(xml);
      osmd.render();
    }
  })
);

export const Score = enhance(() => (
  <div>
    <div id="score" style={{ width: '400px' }} />
  </div>
));
