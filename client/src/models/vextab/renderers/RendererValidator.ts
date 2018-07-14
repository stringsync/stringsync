import { AbstractValidator } from 'utilities';
import { RendererStore } from './RendererStore';
import { Vextab } from 'models';

interface IBaseRendererProps {
  store: RendererStore<any>;
  vextab: Vextab;
  width: number;
}

export class RendererValidator<R extends IBaseRendererProps> extends AbstractValidator<R> {
  constructor(renderer: R) {
    super(renderer);
  }

  protected doValidate(): void {
    this.validateCanvases();
    this.validateArtists();
    this.validateWidth();
  }

  private get lineIds(): number[] {
    return this.target.vextab.lines.map(line => line.id);
  }

  private get missingCanvases(): number[] {
    return this.lineIds.filter(lineId => {
      try {
        return !this.target.store.fetch(lineId).scoreCanvas
      } catch {
        return false;
      }
    });
  }

  private get missingArtists(): number[] {
    return this.lineIds.filter(lineId => {
      try {
        return !this.target.store.fetch(lineId).artist
      } catch {
        return false;
      }
    });
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