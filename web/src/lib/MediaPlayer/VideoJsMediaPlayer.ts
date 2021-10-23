import { noop } from 'lodash';
import { VideoJsPlayer } from 'video.js';
import { AsyncLoop } from '../../util/AsyncLoop';
import { Duration } from '../../util/Duration';
import { EventBus } from '../EventBus';
import { MediaPlayer, MediaPlayerEventBus, PlayState } from './types';

export class VideoJsMediaPlayer implements MediaPlayer {
  eventBus: MediaPlayerEventBus = new EventBus();

  private loop: AsyncLoop;
  private player: VideoJsPlayer;
  private currentTime = Duration.zero();

  private isSuspended = false;
  private onUnsuspend = noop;

  constructor(player: VideoJsPlayer) {
    this.player = player;
    this.player.on('play', this.onPlay);
    this.player.on('pause', this.onPause);

    this.loop = new AsyncLoop(this.onLoop);
  }

  dispose() {
    this.loop.stop();
    this.player.off('play', this.onPlay);
    this.player.off('pause', this.onPause);
    this.player.dispose();
  }

  play = () => {
    if (this.isSuspended) {
      return;
    }
    this.player.play();
    this.eventBus.dispatch('play', {});
  };

  pause = () => {
    if (this.isSuspended) {
      return;
    }
    this.player.pause();
    this.eventBus.dispatch('pause', {});
  };

  seek(time: Duration) {
    this.player.currentTime(time.sec);
    this.updateTime(time);
  }

  suspend() {
    if (this.isSuspended) {
      return;
    }

    const playState = this.getPlayState();
    if (playState === PlayState.Playing) {
      this.onUnsuspend = this.play;
    } else {
      this.onUnsuspend = noop;
    }

    this.pause();
    this.isSuspended = true;
    this.eventBus.dispatch('suspend', {});
  }

  unsuspend() {
    if (!this.isSuspended) {
      return;
    }

    this.isSuspended = false;
    this.onUnsuspend();
    this.onUnsuspend = noop;
    this.eventBus.dispatch('unsuspend', {});
  }

  getPlayState() {
    return this.player.paused() ? PlayState.Paused : PlayState.Playing;
  }

  getCurrentTime() {
    return Duration.sec(this.player.currentTime());
  }

  private updateTime(time: Duration) {
    if (this.currentTime.eq(time)) {
      return;
    }
    this.currentTime = time;
    this.eventBus.dispatch('timechange', { time });
  }

  private onLoop = () => {
    const time = this.getCurrentTime();
    this.updateTime(time);
  };

  private onPlay = () => {
    this.loop.start();
  };

  private onPause = () => {
    this.loop.stop();
  };
}
