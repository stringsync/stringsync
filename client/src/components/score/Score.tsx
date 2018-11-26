import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import VT from 'vextab/releases/vextab-div.js';

const { Flow, Artist, VexTab } = VT;
Artist.NOLOGO = true;

interface IProps {
  src: string;
}

interface IHandlerProps {
  handleDivRef: any;
}

type InnerProps = IHandlerProps & IProps;

const enhance = compose<InnerProps, IProps>(
  withHandlers(() => {
    let div: HTMLCanvasElement;

    return {
      handleDivRef: () => ref => {
        if (!ref) {
          return;
        }

        div = ref;

        const renderer = new Flow.Renderer(div, Flow.Renderer.Backends.SVG);
        const artist = new Artist(10, 10, 1200);
        const vextab = new VexTab(artist);

        try {
          // Parse VexTab music notation passed in as a string.
          vextab.parse(`
            (5/2.5/3.7/4) 5h6/3 7/4
            t12p7p5h7/4 7/5 5s3/5
            (8/2.7b9b7/3) (5b6/2.5b6/3)v 7s0/4
            (5/2.6/3.7/4)v
            (5/4.5/5)s(7/4.7/5)s(5/4.5/5) (5/4.5/5)h(7/5)
            t(12/5.12/4)s(5/5.5/4) 3b4/5 5V/6
            (5/2.5/3.7/4) 5h6/3 7/4
            t12p7p5h7/4 7/5 5s3/5
            (8/2.7b9b7/3) (5b6/2.5b6/3)v 7s0/4
            (5/2.6/3.7/4)v
            (5/4.5/5)s(7/4.7/5)s(5/4.5/5) (5/4.5/5)h(7/5)
            t(12/5.12/4)s(5/5.5/4) 3b4/5 5V/6
          `);

          // Render notation onto canvas.
          artist.render(renderer);
        } catch (e) {
          console.error(e);
        }
      }
    };
  })
);

export const Score = enhance(props => (
  <div ref={props.handleDivRef} />
));
