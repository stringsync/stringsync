import { VEXTAB_STRINGS } from 'test'
import { Vextab } from 'models';
import { times, zip } from 'lodash';

test('Vextab.hydrate', () => {
  VEXTAB_STRINGS.forEach(vextabString => {
    const vextab = new Vextab(Vextab.decode(vextabString), 1);
    const canvases = vextab.lines.map(line => document.createElement('canvas'));

    // Assign canvases
    zip(canvases, vextab.lines).forEach(([canvas, line]) => {
      vextab.renderer.assign(canvas!, line!.id);
    });
  });
});