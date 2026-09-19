import { addZero } from "./addZero.js";

export const videoPlayerInit = () => {
  const videoPlayer = document.querySelector(".video-player");
  const videoButtonPlay = document.querySelector(".video-button__play");
  const videoButtonStop = document.querySelector(".video-button__stop");
  const videoTimePassed = document.querySelector(".video-time__passed");
  const videoProgress = document.querySelector(".video-progress");
  const videoTimeTotal = document.querySelector(".video-time__total");
  const videoVolume = document.querySelector(".video-volume");
  const videoFullScreen = document.querySelector(".video-fullscreen");
  const videoPip = document.querySelector(".video-pip");
  const videoSpeed = document.querySelector(".video-speed");
  const videoVolumeUp = document.querySelector(".video-volume-up");
  const videoVolumeDown = document.querySelector(".video-volume-down");

  if (videoFullScreen) {
    videoFullScreen.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoPlayer.requestFullscreen().catch(() => {});
      }
    });
  }

  if (videoPip && document.pictureInPictureEnabled) {
    videoPip.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoPlayer.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('PiP error:', err);
      }
    });
  }

  // Playback speeds cycle: 1x -> 1.25x -> 1.5x -> 2x -> 0.75x -> 1x
  const speeds = [1, 1.25, 1.5, 2, 0.75];
  let speedIdx = 0;
  if (videoSpeed) {
    videoSpeed.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      videoPlayer.playbackRate = speeds[speedIdx];
      videoSpeed.textContent = `${speeds[speedIdx]}x`;
    });
  }

  const toggleIcon = () => {
    if (videoPlayer.paused) {
      videoButtonPlay.classList.remove("fa-pause");
      videoButtonPlay.classList.add("fa-play");
    } else {
      videoButtonPlay.classList.remove("fa-play");
      videoButtonPlay.classList.add("fa-pause");
    }
  };

  const togglePlay = () => {
    if (videoPlayer.paused) {
      videoPlayer.play().catch(() => {});
    } else {
      videoPlayer.pause();
    }
    toggleIcon();
  };

  const stopPlay = () => {
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    toggleIcon();
  };

  videoPlayer.addEventListener("click", togglePlay);
  videoButtonPlay.addEventListener("click", togglePlay);

  videoPlayer.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      videoPlayer.removeEventListener("click", togglePlay);
    } else {
      videoPlayer.addEventListener("click", togglePlay);
    }
  });

  videoPlayer.addEventListener("play", toggleIcon);
  videoPlayer.addEventListener("pause", toggleIcon);

  if (videoButtonStop) {
    videoButtonStop.addEventListener("click", stopPlay);
  }

  videoPlayer.addEventListener("timeupdate", () => {
    const currentTime = videoPlayer.currentTime;
    const durationTime = videoPlayer.duration || 0;

    if (durationTime > 0) {
      videoProgress.value = (currentTime / durationTime) * 100;
    }

    const minutePassed = Math.floor(currentTime / 60) || 0;
    const secondsPassed = Math.floor(currentTime % 60) || 0;
    const minuteTotal = Math.floor(durationTime / 60) || 0;
    const secondsTotal = Math.floor(durationTime % 60) || 0;

    if (videoTimePassed) {
      videoTimePassed.textContent = `${addZero(minutePassed)}:${addZero(secondsPassed)}`;
    }
    if (videoTimeTotal) {
      videoTimeTotal.textContent = `${addZero(minuteTotal)}:${addZero(secondsTotal)}`;
    }
  });

  if (videoProgress) {
    videoProgress.addEventListener("input", () => {
      const duration = videoPlayer.duration || 0;
      const value = videoProgress.value;
      videoPlayer.currentTime = (value * duration) / 100;
    });
  }

  const changeVolume = () => {
    videoPlayer.volume = videoVolume.value / 100;
  };

  if (videoVolume) {
    videoVolume.addEventListener("input", changeVolume);
  }
  if (videoVolumeUp) {
    videoVolumeUp.addEventListener("click", () => {
      videoPlayer.volume = 1;
      if (videoVolume) videoVolume.value = 100;
    });
  }
  if (videoVolumeDown) {
    videoVolumeDown.addEventListener("click", () => {
      videoPlayer.volume = 0;
      if (videoVolume) videoVolume.value = 0;
    });
  }

  // Keyboard controls for video block
  window.addEventListener('keydown', (e) => {
    const videoBlock = document.querySelector('.player-block.video');
    if (!videoBlock || !videoBlock.classList.contains('active')) return;

    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'KeyM') {
      videoPlayer.muted = !videoPlayer.muted;
    } else if (e.code === 'KeyF') {
      if (videoFullScreen) videoFullScreen.click();
    } else if (e.code === 'ArrowRight') {
      videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 5);
    } else if (e.code === 'ArrowLeft') {
      videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 5);
    }
  });

  videoPlayerInit.stop = () => {
    videoPlayer.pause();
    toggleIcon();
  };
};