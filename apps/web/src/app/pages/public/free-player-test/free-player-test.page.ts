import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'mss-free-player-test-page',
  imports: [],
  templateUrl: './free-player-test.page.html',
  styleUrl: './free-player-test.page.scss',
})
export class FreePlayerTestPageComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('youtubeHost', { static: true })
  private youtubeHost!: ElementRef<HTMLDivElement>;

  @ViewChild('youtubeShell', { static: true })
  private youtubeShell!: ElementRef<HTMLDivElement>;

  @ViewChild('hlsVideo', { static: true })
  private hlsVideo!: ElementRef<HTMLVideoElement>;

  @ViewChild('hlsShell', { static: true })
  private hlsShell!: ElementRef<HTMLDivElement>;

  readonly youtubeStatus = signal('Loading YouTube APIâ€¦');
  readonly youtubePlaying = signal(false);
  readonly youtubeMuted = signal(false);
  readonly youtubeProgress = signal(0);
  readonly youtubeCurrentTime = signal('0:00');
  readonly youtubeDuration = signal('0:00');
  readonly youtubeVolume = signal(100);

  readonly hlsStatus = signal('Preparing HLS playerâ€¦');
  readonly hlsPlaying = signal(false);
  readonly hlsMuted = signal(false);
  readonly hlsProgress = signal(0);
  readonly hlsCurrentTime = signal('0:00');
  readonly hlsDuration = signal('0:00');
  readonly hlsVolume = signal(100);

  private readonly youtubeVideoId = 'rJ6hEF1TL2A';

  private readonly publicHlsTestUrl =
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  private youtubePlayer?: any;
  private youtubeProgressTimer?: number;
  private hls?: Hls;

  ngAfterViewInit(): void {
    void this.initializeYoutube();
    this.initializeHls();
  }

  ngOnDestroy(): void {
    if (this.youtubeProgressTimer !== undefined) {
      window.clearInterval(this.youtubeProgressTimer);
    }

    this.youtubePlayer?.destroy?.();
    this.youtubePlayer = undefined;

    this.hls?.destroy();
    this.hls = undefined;
  }

  // ----------------------------------------------------------
  // YouTube IFrame API
  // ----------------------------------------------------------

  private async initializeYoutube(): Promise<void> {
    try {
      await this.loadYoutubeApi();

      const youtubeWindow = window as Window & {
        YT?: any;
      };

      if (!youtubeWindow.YT?.Player) {
        throw new Error('YouTube Player API was not available.');
      }

      this.youtubePlayer = new youtubeWindow.YT.Player(
        this.youtubeHost.nativeElement,
        {
          width: '100%',
          height: '100%',
          videoId: this.youtubeVideoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              this.youtubeStatus.set('MSS YouTube controls are ready.');
              this.syncYoutubeState();

              this.youtubeProgressTimer = window.setInterval(
                () => this.syncYoutubeState(),
                500,
              );
            },
            onStateChange: (event: { data: number }) => {
              this.youtubePlaying.set(event.data === 1);

              if (event.data === 0) {
                this.youtubeStatus.set('YouTube video completed.');
              } else if (event.data === 1) {
                this.youtubeStatus.set('YouTube video is playing.');
              } else if (event.data === 2) {
                this.youtubeStatus.set('YouTube video is paused.');
              }
            },
            onError: (event: { data: number }) => {
              this.youtubeStatus.set(
                `YouTube player error: ${event.data}`,
              );
            },
          },
        },
      );
    } catch (error) {
      this.youtubeStatus.set(
        error instanceof Error
          ? error.message
          : 'YouTube player initialization failed.',
      );
    }
  }

  private loadYoutubeApi(): Promise<void> {
    const youtubeWindow = window as Window & {
      YT?: any;
      onYouTubeIframeAPIReady?: () => void;
    };

    if (youtubeWindow.YT?.Player) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      let completed = false;

      const finish = (): void => {
        if (completed) {
          return;
        }

        completed = true;
        resolve();
      };

      youtubeWindow.onYouTubeIframeAPIReady = finish;

      let script = document.getElementById(
        'youtube-iframe-api',
      ) as HTMLScriptElement | null;

      if (!script) {
        script = document.createElement('script');
        script.id = 'youtube-iframe-api';
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;

        script.onerror = () => {
          if (completed) {
            return;
          }

          completed = true;
          reject(new Error('Could not load the YouTube IFrame API.'));
        };

        document.head.appendChild(script);
      }

      window.setTimeout(() => {
        if (youtubeWindow.YT?.Player) {
          finish();
          return;
        }

        if (!completed) {
          completed = true;
          reject(new Error('YouTube API loading timed out.'));
        }
      }, 15000);
    });
  }

  toggleYoutubePlayback(): void {
    if (!this.youtubePlayer) {
      return;
    }

    const playing = this.youtubePlayer.getPlayerState?.() === 1;

    if (playing) {
      this.youtubePlayer.pauseVideo?.();
    } else {
      this.youtubePlayer.playVideo?.();
    }
  }

  seekYoutube(event: Event): void {
    const input = event.target as HTMLInputElement;
    const percentage = Number(input.value);
    const duration = Number(
      this.youtubePlayer?.getDuration?.() ?? 0,
    );

    if (!duration) {
      return;
    }

    this.youtubePlayer.seekTo?.(
      (percentage / 100) * duration,
      true,
    );

    this.syncYoutubeState();
  }

  toggleYoutubeMute(): void {
    if (!this.youtubePlayer) {
      return;
    }

    if (this.youtubePlayer.isMuted?.()) {
      this.youtubePlayer.unMute?.();
    } else {
      this.youtubePlayer.mute?.();
    }

    this.syncYoutubeState();
  }

  setYoutubeVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = Number(input.value);

    this.youtubePlayer?.setVolume?.(volume);
    this.youtubeVolume.set(volume);
    this.youtubeMuted.set(volume === 0);
  }

  fullscreenYoutube(): void {
    this.requestFullscreen(this.youtubeShell.nativeElement);
  }

  private syncYoutubeState(): void {
    if (!this.youtubePlayer?.getDuration) {
      return;
    }

    const currentTime = Number(
      this.youtubePlayer.getCurrentTime?.() ?? 0,
    );

    const duration = Number(
      this.youtubePlayer.getDuration?.() ?? 0,
    );

    const progress =
      duration > 0
        ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
        : 0;

    this.youtubeProgress.set(progress);
    this.youtubeCurrentTime.set(this.formatTime(currentTime));
    this.youtubeDuration.set(this.formatTime(duration));
    this.youtubePlaying.set(
      this.youtubePlayer.getPlayerState?.() === 1,
    );

    const muted = Boolean(this.youtubePlayer.isMuted?.());
    this.youtubeMuted.set(muted);

    const volume = Number(
      this.youtubePlayer.getVolume?.() ?? 100,
    );

    this.youtubeVolume.set(muted ? 0 : volume);
  }

  // ----------------------------------------------------------
  // Custom HLS player
  // ----------------------------------------------------------

  private initializeHls(): void {
    const video = this.hlsVideo.nativeElement;

    if (Hls.isSupported()) {
      this.hls = new Hls({
        enableWorker: true,
      });

      this.hls.loadSource(this.publicHlsTestUrl);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.hlsStatus.set(
          'Custom hls.js player is ready.',
        );
      });

      this.hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal || !this.hls) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          this.hlsStatus.set(
            'HLS network error. Retryingâ€¦',
          );

          this.hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          this.hlsStatus.set(
            'HLS media error. Recoveringâ€¦',
          );

          this.hls.recoverMediaError();
          return;
        }

        this.hlsStatus.set(
          `Fatal HLS error: ${data.details}`,
        );

        this.hls.destroy();
        this.hls = undefined;
      });

      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.publicHlsTestUrl;
      this.hlsStatus.set(
        'Native browser HLS player is ready.',
      );

      return;
    }

    this.hlsStatus.set(
      'This browser does not support HLS playback.',
    );
  }

  toggleHlsPlayback(): void {
    const video = this.hlsVideo.nativeElement;

    if (video.paused) {
      void video.play().catch(() => {
        this.hlsStatus.set(
          'Playback was blocked by the browser.',
        );
      });
    } else {
      video.pause();
    }
  }

  seekHls(event: Event): void {
    const input = event.target as HTMLInputElement;
    const percentage = Number(input.value);
    const video = this.hlsVideo.nativeElement;

    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    video.currentTime = (percentage / 100) * video.duration;
    this.syncHlsState();
  }

  toggleHlsMute(): void {
    const video = this.hlsVideo.nativeElement;
    video.muted = !video.muted;
    this.syncHlsState();
  }

  setHlsVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = Number(input.value);

    const video = this.hlsVideo.nativeElement;

    video.volume = Math.min(1, Math.max(0, volume / 100));
    video.muted = volume === 0;

    this.syncHlsState();
  }

  setHlsPlaybackRate(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.hlsVideo.nativeElement.playbackRate =
      Number(select.value);
  }

  fullscreenHls(): void {
    const video = this.hlsVideo.nativeElement;

    this.requestFullscreen(
      this.hlsShell.nativeElement,
      video,
    );
  }

  syncHlsState(): void {
    const video = this.hlsVideo.nativeElement;

    const duration =
      Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : 0;

    const progress =
      duration > 0
        ? Math.min(100, Math.max(0, (video.currentTime / duration) * 100))
        : 0;

    this.hlsPlaying.set(!video.paused);
    this.hlsMuted.set(video.muted);
    this.hlsVolume.set(
      video.muted ? 0 : Math.round(video.volume * 100),
    );
    this.hlsProgress.set(progress);
    this.hlsCurrentTime.set(this.formatTime(video.currentTime));
    this.hlsDuration.set(this.formatTime(duration));
  }

  private requestFullscreen(
    element: HTMLElement,
    fallbackVideo?: HTMLVideoElement,
  ): void {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    const fullscreenElement = element as HTMLElement & {
      webkitRequestFullscreen?: () => void;
    };

    if (fullscreenElement.requestFullscreen) {
      void fullscreenElement.requestFullscreen();
      return;
    }

    if (fullscreenElement.webkitRequestFullscreen) {
      fullscreenElement.webkitRequestFullscreen();
      return;
    }

    const mobileVideo = fallbackVideo as
      | (HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
        })
      | undefined;

    mobileVideo?.webkitEnterFullscreen?.();
  }

  private formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }

    const wholeSeconds = Math.floor(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }
}