import { TimeKeeper } from 'services';
import { AbstractObservable } from '../../utilities/AbstractObservable';

/**
 * This class's purpose is to provide a single interface for callers to invoke an update on
 * all of the backend models. If a caller asynchronously invokes an update while the Maestro
 * instance is still computing, it will be ignored.
 */
export class Maestro extends AbstractObservable {
  public timeKeeper: TimeKeeper;
  public isUpdating: boolean;

  constructor(timeKeeper: TimeKeeper) {
    super();

    this.timeKeeper = timeKeeper;
    this.isUpdating = false;
  }

  /**
   * The primary interface that event handlers should call to update the backend
   * models.
   */
  public update() {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    try {
      this.doUpdate();
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Contains the logic of actually doing the update.
   * 
   * @private
   */
  private doUpdate() {
    // A clone is constructed so that time doesn't change during the computation.
    // const timeKeeper = this.timeKeeper.clone;
    // TODO: Finish fleshing out this function
  }
}
