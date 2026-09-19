import { addZero } from "./addZero.js";
import { AudioVisualizer } from "./visualizer.js";

export const musicPlayerInit = () => {
  const audio = document.querySelector(".audio");
  const audioImg = document.querySelector(".audio-img");
  const audioHeader = document.querySelector(".audio-header");
  const audioPlayer = document.querySelector(".audio-player");
  const audioNavigation = document.querySelector(".audio-navigation");
  const audioButtonPlay = document.querySelector(".audio-button__play");
  const audioProgress = document.querySelector(".audio-progress");
  const audioProgressTiming = document.querySelector(".audio-progress__timing");
  const audioTimePassed = document.querySelector(".audio-time__passed");
  const audioTimeTotal = document.querySelector(".audio-time__total");
  const audioVolume = document.querySelector(".audio-volume");
  const audioVolumeUp = document.querySelector(".audio-volume-up");
  const audioVolumeDown = document.querySelector(".audio-volume-down");
  const visualizerCanvas = document.getElementById("musicVisualizer");

  let visualizer = null;
  if (visualizerCanvas) {
    visualizer = new AudioVisualizer(visualizerCanvas);
  }

  const playlist = [
    "Anata-Wa Korosareta",
    "Barking Barrels",
    "Be Rich or Snitch",
    "Beat Coin",
    "Become Juicy",
    "Blah-call-it",
    "Cash-In-Garage",
    "Final Lynch",
    "FluteInc.-feat-Tony-Montana",
    "Ideal Job",
    "Konoha In Action",
    "Lip-Slip",
    "MonTony x Ru1zy - Cash",
    "Murda-Priest",
    "Rubbish-Gangstas",
    "Still Flute +",
    "Streets-In-Souls",
    "Sweat-_-Blood",
    "Tangle-Club",
    "Thonnie",
    "Tight Style reinc",
    "razriv bita"
  ];
  
  let trackIndex = 0;

  const updatePlayState = (isPlaying) => {
    if (isPlaying) {
      audio.classList.add("play");
      audioButtonPlay.classList.remove("fa-play");
      audioButtonPlay.classList.add("fa-pause");
      if (visualizer) visualizer.start(audioPlayer);
    } else {
      audio.classList.remove("play");
      audioButtonPlay.classList.remove("fa-pause");
      audioButtonPlay.classList.add("fa-play");
      if (visualizer) visualizer.stop();
    }
  };

  const loadTrack = (shouldPlay = true) => {
    const track = playlist[trackIndex];
    audioImg.src = `./audio/hello.jpg`;
    audioHeader.textContent = track.replace(/[-_]/g, ' ').toUpperCase();
    audioPlayer.src = `./audio/${encodeURIComponent(track)}.mp3`;

    if (shouldPlay) {
      audioPlayer.play().then(() => {
        updatePlayState(true);
      }).catch(err => {
        console.warn('Audio play prevented:', err);
      });
    } else {
      updatePlayState(false);
    }
  };

  const prevTrack = () => {
    trackIndex = trackIndex !== 0 ? trackIndex - 1 : playlist.length - 1;
    loadTrack(true);
  };

  const nextTrack = () => {
    trackIndex = trackIndex < playlist.length - 1 ? trackIndex + 1 : 0;
    loadTrack(true);
  };

  audioNavigation.addEventListener("click", (event) => {
    if (event.target.classList.contains("audio-button__play")) {
      if (audioPlayer.paused) {
        if (!audioPlayer.src || audioPlayer.src.endsWith('/')) {
          loadTrack(true);
        } else {
          audioPlayer.play();
          updatePlayState(true);
        }
      } else {
        audioPlayer.pause();
        updatePlayState(false);
      }
    }

    if (event.target.classList.contains("audio-button__next")) {
      nextTrack();
    }

    if (event.target.classList.contains("audio-button__prev")) {
      prevTrack();
    }
  });

  audioPlayer.addEventListener("play", () => updatePlayState(true));
  audioPlayer.addEventListener("pause", () => updatePlayState(false));

  audioPlayer.addEventListener("ended", () => {
    nextTrack();
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const duration = audioPlayer.duration || 0;
    const currentTime = audioPlayer.currentTime || 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (audioProgressTiming) {
      audioProgressTiming.style.width = progress + "%";
    }

    const minutePassed = Math.floor(currentTime / 60) || 0;
    const secondsPassed = Math.floor(currentTime % 60) || 0;
    const minuteTotal = Math.floor(duration / 60) || 0;
    const secondsTotal = Math.floor(duration % 60) || 0;

    if (audioTimePassed) {
      audioTimePassed.textContent = `${addZero(minutePassed)}:${addZero(secondsPassed)}`;
    }
    if (audioTimeTotal) {
      audioTimeTotal.textContent = `${addZero(minuteTotal)}:${addZero(secondsTotal)}`;
    }
  });

  if (audioProgress) {
    audioProgress.addEventListener("click", (event) => {
      const rect = audioProgress.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const progress = (x / rect.width) * (audioPlayer.duration || 0);
      audioPlayer.currentTime = progress;
    });
  }

  const changeVolume = () => {
    audioPlayer.volume = audioVolume.value / 100;
  };

  if (audioVolume) {
    audioVolume.addEventListener("input", changeVolume);
  }
  if (audioVolumeUp) {
    audioVolumeUp.addEventListener("click", () => {
      audioPlayer.volume = 1;
      if (audioVolume) audioVolume.value = 100;
    });
  }
  if (audioVolumeDown) {
    audioVolumeDown.addEventListener("click", () => {
      audioPlayer.volume = 0;
      if (audioVolume) audioVolume.value = 0;
    });
  }

  // Pre-fill initial track title
  audioHeader.textContent = playlist[0].replace(/[-_]/g, ' ').toUpperCase();

  musicPlayerInit.stop = () => {
    audioPlayer.pause();
    updatePlayState(false);
  };
};
