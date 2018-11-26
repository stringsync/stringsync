import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import VT from 'vextab/releases/vextab-div.js';

const { Flow, Artist, VexTab } = VT;

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
        div.setAttribute('width', '680');
        div.setAttribute('scale', '1.0');
        div.setAttribute('editor', 'true');
        div.setAttribute('editor_width', '680');

        const renderer = new Flow.Renderer(div, Flow.Renderer.Backends.SVG);
        const artist = new Artist(10, 10, 600);
        const vextab = new VexTab(artist);

        try {
          // Parse VexTab music notation passed in as a string.
          vextab.parse('tabstave notation=true\n notes :q 4/4\n');

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
