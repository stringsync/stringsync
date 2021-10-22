import { VideoJsPlayer } from 'video.js';

export class MediaPlayer {
  private player: VideoJsPlayer;

  constructor(player: VideoJsPlayer) {
    this.player = player;
  }
}
