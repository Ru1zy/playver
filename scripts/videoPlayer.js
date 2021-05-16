import { addZero } from "./addZero.js";

export const videoPlayerInit = () => {
  //получаем элементы с html файла
  const videoPlayer = document.querySelector(".video-player");
  const videoButtonPlay = document.querySelector(".video-button__play");
  const videoButtonStop = document.querySelector(".video-button__stop");
  const videoTimePassed = document.querySelector(".video-time__passed");
  const videoProgress = document.querySelector(".video-progress");
  const videoTimeTotal = document.querySelector(".video-time__total");
  const videoVolume = document.querySelector(".video-volume");
  const videoFullScreen = document.querySelector(".video-fullscreen");
  const videoVolumeUp = document.querySelector(".video-volume-up");
  const videoVolumeDown = document.querySelector(".video-volume-down");
//нажатие на иконку = фуллскрин
  videoFullScreen.addEventListener('click',()=>{
    videoPlayer.requestFullscreen();
  });
  
  console.dir(videoPlayer);
//смена иконки (пауза, плей)
  const toggleIcon = () => {
    if (videoPlayer.paused) {
      videoButtonPlay.classList.remove("fa-pause");
      videoButtonPlay.classList.add("fa-play");
    } else {
      videoButtonPlay.classList.remove("fa-play");
      videoButtonPlay.classList.add("fa-pause");
    }
  };
//работа плей/пауза по клику мыши
  const togglePlay = () => {
    if (videoPlayer.paused) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }

    toggleIcon();
  };
//иконка квадрата провоцирует паузу и перематывает в начало
  const stopPlay = () => {
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  };

  videoPlayer.addEventListener("click", togglePlay);
  videoButtonPlay.addEventListener("click", togglePlay);
//у плеера фуллскрина свой функционал, поэтому считывает два раза паузу по клику, от чего видео возобновляется
  videoPlayer.addEventListener("fullscreenchange", () => {
    if(document.fullscreenElement){
      videoPlayer.removeEventListener("click", togglePlay);
    } else {
      videoPlayer.addEventListener("click", togglePlay);
    }
  });
  videoPlayer.addEventListener("play", toggleIcon);
  videoPlayer.addEventListener("pause", toggleIcon);

  videoButtonStop.addEventListener("click", stopPlay);

  videoPlayer.addEventListener("timeupdate", () => {
    const currentTime = videoPlayer.currentTime;
    const durationTime = videoPlayer.duration;
    console.log(currentTime);
    console.log(durationTime);

    videoProgress.value = (currentTime / durationTime) * 100;

    let minutePassed = Math.floor(currentTime / 60);
    let secondsPassed = Math.floor(currentTime % 60);

    let minuteTotal = Math.floor(durationTime / 60);
    let secondsTotal = Math.floor(durationTime % 60);

    videoTimePassed.textContent = addZero(minutePassed) + ":" + addZero(secondsPassed);
    videoTimeTotal.textContent = addZero(minuteTotal) + ":" + addZero(secondsTotal);
  });

  videoProgress.addEventListener("change", () => {
    const duration = videoPlayer.duration;
    const value = videoProgress.value;

    videoPlayer.currentTime = (value * duration) / 100;
  });
  
  const changeValue = () => {
    const value = videoVolume.value;
    videoPlayer.volume = value / 100;
    videoVolumeUp.onclick = function () {
      videoPlayer.volume = 1;
      videoVolume.value = 100;
    }
    videoVolumeDown.onclick = function () {
      videoPlayer.volume = 0;
      videoVolume.value = 0;
    }
    console.log (videoVolume.value);
  }

  videoVolume.addEventListener("input",changeValue);
  
  videoPlayer.addEventListener("volumechange",()=>{
    videoVolume.value = Math.round(videoPlayer.volume*100);
  });

  console.log (videoPlayer.volume);
  changeValue();
  console.log (videoPlayer.volume);
};