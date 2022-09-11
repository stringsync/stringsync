import { isEqual, noop } from 'lodash';
import { VideoJsPlayer } from 'video.js';
import 'videojs-contrib-quality-levels';
import { AsyncLoop } from '../../util/AsyncLoop';
import { Duration } from '../../util/Duration';
import { EventBus } from '../EventBus';
import { MediaPlayer, MediaPlayerEventBus, PlayState, QualityLevel } from './types';

export class VideoJsMediaPlayer implements MediaPlayer {
  eventBus: MediaPlayerEventBus = new EventBus();

  private timeChangeLoop: AsyncLoop;
  private player: VideoJsPlayer;
  private currentTime = Duration.zero();
  private qualityLevels;

  private isSuspended = false;
  private onUnsuspend = noop;
  private ready = false;

  constructor(player: VideoJsPlayer) {
    this.player = player;
    this.player.ready(this.onReady);
    this.player.on('play', this.onPlay);
    this.player.on('pause', this.onPause);
    this.player.on('volumechange', this.onVolumeChange);
    this.player.on('ended', this.onEnded);

    this.qualityLevels = (this.player as any).qualityLevels();
    this.qualityLevels.on('addqualitylevel', this.onAddQualityLevel);
    this.qualityLevels.on('removequalitylevel', this.onRemoveQualityLevel);
    this.qualityLevels.on('change', this.onQualityLevelsChange);

    this.timeChangeLoop = new AsyncLoop(
      this.syncTime,
      player.requestAnimationFrame.bind(player),
      player.cancelAnimationFrame.bind(player)
    );
  }

  dispose() {
    this.player.off('play', this.onPlay);
    this.player.off('pause', this.onPause);
    this.player.off('volumechange', this.onVolumeChange);
    this.player.off('ended', this.onEnded);
    // HACK: prevent the root element from being deleted when disposing the player
    // https://github.com/videojs/video.js/blob/85343d1cec98b59891a650e9d050989424ecf866/src/js/component.js#L167
    (this.player as any).el_ = null;
    this.player.dispose();

    this.qualityLevels.off('addqualitylevel', this.onAddQualityLevel);
    this.qualityLevels.off('removequalitylevel', this.onRemoveQualityLevel);
    this.qualityLevels.off('change', this.onQualityLevelsChange);

    this.timeChangeLoop.stop();
  }

  play = () => {
    if (this.isSuspended) {
      return;
    }
    if (!this.ready) {
      return;
    }
    this.player.play();
  };

  pause = () => {
    if (this.isSuspended) {
      return;
    }
    if (!this.ready) {
      return;
    }
    this.player.pause();
  };

  seek(time: Duration) {
    if (!this.ready) {
      return;
    }
    this.player.currentTime(time.sec);
    this.updateTime(time);
  }

  suspend() {
    if (!this.ready) {
      return;
    }
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
    if (!this.ready) {
      return;
    }
    if (!this.isSuspended) {
      return;
    }

    this.isSuspended = false;
    this.onUnsuspend();
    this.onUnsuspend = noop;
    this.eventBus.dispatch('unsuspend', {});
  }

  getPlayState() {
    if (!this.ready) {
      return PlayState.Paused;
    }
    try {
      return this.player.paused() ? PlayState.Paused : PlayState.Playing;
    } catch (e) {
      return PlayState.Unknown;
    }
  }

  getCurrentTime() {
    return this.ready ? Duration.sec(this.player.currentTime()) : Duration.zero();
  }

  getVolume() {
    if (!this.ready) {
      return 0;
    }
    return this.player.volume();
  }

  setVolume(volume: number) {
    if (!this.ready) {
      return;
    }
    this.player.volume(volume);
  }

  isReady() {
    return this.ready;
  }

  isMuted() {
    if (!this.ready) {
      return false;
    }
    // The VideoJs player does not protect against player.el_ being null.
    try {
      return this.player.muted();
    } catch (e) {
      return false;
    }
  }

  mute() {
    if (!this.ready) {
      return;
    }
    this.player.muted(true);
    this.eventBus.dispatch('mutechange', { muted: true });
  }

  unmute() {
    if (!this.ready) {
      return;
    }
    this.player.muted(false);
    this.eventBus.dispatch('mutechange', { muted: false });
  }

  getPlayback() {
    if (!this.ready) {
      return 1;
    }
    return this.player.playbackRate();
  }

  setPlayback(playback: number) {
    if (!this.ready) {
      return;
    }
    this.player.playbackRate(playback);
    this.eventBus.dispatch('playbackchange', { playback });
  }

  getQualityLevels(): QualityLevel[] {
    return Array.from<any>(this.qualityLevels).map((qualityLevel) => ({
      id: qualityLevel.id,
      label: `${qualityLevel.height}p`,
      width: qualityLevel.width,
      height: qualityLevel.height,
      bitrate: qualityLevel.bitrate,
      enabled: qualityLevel.enabled_(),
    }));
  }

  setQualityLevel(qualityLevelId: string): void {
    const qualityLevels = Array.from<any>(this.qualityLevels);

    const hasQualityLevel = qualityLevels.some((qualityLevel) => qualityLevel.id === qualityLevelId);
    if (!hasQualityLevel) {
      throw new Error(`could not find quality level: ${qualityLevelId}`);
    }

    const enabledQualityLevelIds = qualityLevels
      .filter((qualityLevel) => qualityLevel.enabled_())
      .map((qualityLevel) => qualityLevel.id);
    const alreadyHasQualityLevelSet = isEqual(new Set(enabledQualityLevelIds), new Set([qualityLevelId]));
    if (alreadyHasQualityLevelSet) {
      return;
    }

    for (const qualityLevel of qualityLevels) {
      qualityLevel.enabled = qualityLevel.id === qualityLevelId;
    }
  }

  resetQualityLevels() {
    const qualityLevels = Array.from<any>(this.qualityLevels);

    const allQualityLevelsEnabled = qualityLevels.every((qualityLevel) => qualityLevel.enabled_());
    if (allQualityLevelsEnabled) {
      return;
    }

    for (const qualityLevel of qualityLevels) {
      qualityLevel.enabled = true;
    }
  }

  private updateTime(time: Duration) {
    if (this.currentTime.eq(time)) {
      return;
    }
    this.currentTime = time;
    this.eventBus.dispatch('timechange', { time });
  }

  private syncTime = () => {
    try {
      const time = this.getCurrentTime();
      this.updateTime(time);
    } catch {}
  };

  private onReady = () => {
    this.ready = true;
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

  private onEnded = () => {
    this.eventBus.dispatch('end', {});
  };

  private onVolumeChange = () => {
    const volume = this.getVolume();
    this.eventBus.dispatch('volumechange', { volume });
  };

  private onAddQualityLevel = () => {
    this.eventBus.dispatch('qualitylevelschange', {});
  };

  private onRemoveQualityLevel = () => {
    this.eventBus.dispatch('qualitylevelschange', {});
  };

  private onQualityLevelsChange = () => {
    this.eventBus.dispatch('qualitylevelschange', {});
  };
}
