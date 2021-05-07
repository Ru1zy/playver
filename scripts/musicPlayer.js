import { addZero } from "./addZero.js";

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

  const playlist = ["Anata-Wa Korosareta", "Barking Barrels", "Be Rich or Snitch","Beat Coin","Become Juicy","Blah-call-it","Cash-In-Garage","Final Lynch","FluteInc.-feat-Tony-Montana","Ideal Job","Konoha In Action","Lip-Slip","MonTony x Ru1zy - Cash","Murda-Priest","Rubbish-Gangstas","Still Flute +","Streets-In-Souls","Sweat-_-Blood","Tangle-Club","Thonnie","Tight Style reinc"];
  let trackIndex = 0;
  const loadTrack = () => {
    const isPlayed = audioPlayer.paused;
    const track = playlist[trackIndex];
    audioImg.src = `./audio/hello.jpg`;
    audioHeader.textContent = track.toUpperCase();
    audioPlayer.src = `./audio/${track}.mp3`;
    console.log(audioPlayer.src)

    if (isPlayed) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  };

  const nextTrack = () => {
    if (trackIndex !== 0) {
      trackIndex--;
    } else {
      trackIndex = playlist.length - 1;
    }
    loadTrack();
  };

  const prevTrack= () => {
    if (trackIndex === playlist.length - 1) {
      trackIndex = 0;
    } else {
      trackIndex++;
    }
    loadTrack();
  };

  audioNavigation.addEventListener("click", (event) => {
    if (event.target.classList.contains("audio-button__play")) {
      audio.classList.toggle("play");
      audioButtonPlay.classList.toggle("fa-play");
      audioButtonPlay.classList.toggle("fa-pause");

      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }

    const track = playlist[trackIndex];
    audioHeader.textContent = track.toUpperCase();

    if (event.target.classList.contains("audio-button__next")) {
      prevTrack();
    }

    if (event.target.classList.contains("audio-button__prev")) {
      nextTrack();
    }
  });

  audioPlayer.addEventListener("ended", () => {
    nextTrack();
    audioPlayer.play();
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const duration = audioPlayer.duration;
    const currentTime = audioPlayer.currentTime;
    const progress = (currentTime / duration) * 100;

    audioProgressTiming.style.width = progress + "%";

    const minutePassed = Math.floor(currentTime / 60) || "0";
    const secondsPassed = Math.floor(currentTime % 60) || "0";

    const minuteTotal = Math.floor(duration / 60) || "0";
    const secondsTotal = Math.floor(duration % 60) || "0";

    audioTimePassed.textContent = `${addZero(minutePassed)}:${addZero(secondsPassed)}`;
    audioTimeTotal.textContent = `${addZero(minuteTotal)}:${addZero(secondsTotal)}`;
  });

  audioProgress.addEventListener("click", (event) => {
    const x = event.offsetX;
    const allWidth = audioProgress.clientWidth;
    const progress = (x / allWidth) * audioPlayer.duration;
    audioPlayer.currentTime = progress;
  });
};
