import { noop } from 'lodash';
import { VideoJsPlayer } from 'video.js';
import { AsyncLoop } from '../../util/AsyncLoop';
import { Duration } from '../../util/Duration';
import { EventBus } from '../EventBus';
import { MediaPlayer, MediaPlayerEventBus, PlayState } from './types';

export class VideoJsMediaPlayer implements MediaPlayer {
  eventBus: MediaPlayerEventBus = new EventBus();

  private timeChangeLoop: AsyncLoop;
  private player: VideoJsPlayer;
  private currentTime = Duration.zero();

  private isSuspended = false;
  private onUnsuspend = noop;
  private isReady = false;

  constructor(player: VideoJsPlayer) {
    this.player = player;
    this.player.ready(this.onReady);
    this.player.on('play', this.onPlay);
    this.player.on('pause', this.onPause);

    this.timeChangeLoop = new AsyncLoop(
      this.onTimeChangeLoop,
      player.requestAnimationFrame.bind(player),
      player.cancelAnimationFrame.bind(player)
    );
  }

  dispose() {
    this.timeChangeLoop.stop();
    this.player.off('play', this.onPlay);
    this.player.off('pause', this.onPause);
    // HACK: prevent the root element from being deleted when disposing the player
    // https://github.com/videojs/video.js/blob/85343d1cec98b59891a650e9d050989424ecf866/src/js/component.js#L167
    (this.player as any).el_ = null;
    this.player.dispose();
  }

  play = () => {
    if (this.isSuspended) {
      return;
    }
    this.player.play();
  };

  pause = () => {
    if (this.isSuspended) {
      return;
    }
    this.player.pause();
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
    try {
      return this.player.paused() ? PlayState.Paused : PlayState.Playing;
    } catch (e) {
      return PlayState.Unknown;
    }
  }

  getCurrentTime() {
    return this.isReady ? Duration.sec(this.player.currentTime()) : Duration.zero();
  }

  private updateTime(time: Duration) {
    if (this.currentTime.eq(time)) {
      return;
    }
    this.currentTime = time;
    this.eventBus.dispatch('timechange', { time });
  }

  private onTimeChangeLoop = () => {
    const time = this.getCurrentTime();
    this.updateTime(time);
  };

  private onReady = () => {
    this.isReady = true;
    this.eventBus.dispatch('init', {});
  };

  private onPlay = () => {
    this.timeChangeLoop.start();
    this.eventBus.dispatch('playstatechange', { playState: PlayState.Playing });
  };

  private onPause = () => {
    this.timeChangeLoop.stop();
    this.eventBus.dispatch('playstatechange', { playState: PlayState.Paused });
  };
}
