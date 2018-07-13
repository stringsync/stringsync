import { AbstractValidator } from 'utilities';
import VextabRenderer from './VextabRenderer';
import { Line } from '../..';

export class VextabRenderValidator extends AbstractValidator<VextabRenderer> {
  constructor(renderer: VextabRenderer) {
    super(renderer);
  }

  protected doValidate(): void {
    this.validateCanvases();
    this.validateArtists();
  }

  private get lineIds(): number[] {
    return this.target.vextab.lines.map(line => line.id);
  }

  private get missingCanvases(): number[] {
    return this.lineIds.filter(id => !this.target.store.data[id]);
  }

  private get missingArtists(): number [] {
    return this.lineIds.filter(id => !this.target.store.data[id]);
  }

  private validateCanvases(): void {
    const { missingCanvases } = this;

    if (missingCanvases.length > 0) {
      this.error(`missing canvases for line ids ${missingCanvases.join(', ')}`);
    }
  }

  private validateArtists(): void {
    const { missingArtists } = this;

    if (missingArtists.length > 0) {
      this.error(`missing artists for line ids ${missingArtists.join(', ')}`);
    }
  }

  private validateWidth(): void {
    if (!this.target.width) {
      this.error('expected width to be a positive number');
    }
  }
}