import { AudioVisualizer } from "./visualizer.js";

export const radioPlayerInit = () => {
  const radio = document.querySelector(".radio");
  const radioCoverImg = document.querySelector(".radio-cover__img");
  const radioHeaderBig = document.querySelector(".radio-header__big");
  const radioNavigation = document.querySelector(".radio-navigation");
  const radioItems = document.querySelectorAll(".radio-item");
  const radioStop = document.querySelector(".radio-stop");
  const radioVolume = document.querySelector(".radio-volume");
  const radioVolumeUp = document.querySelector(".radio-volume-up");
  const radioVolumeDown = document.querySelector(".radio-volume-down");
  const visualizerCanvas = document.getElementById("radioVisualizer");

  let visualizer = null;
  if (visualizerCanvas) {
    visualizer = new AudioVisualizer(visualizerCanvas);
  }

  const audio = new Audio();
  audio.crossOrigin = 'anonymous';

  radioStop.disabled = true;

  const changeIconPlay = () => {
    if (audio.paused) {
      radio.classList.remove("play");
      radioStop.classList.add("fa-play");
      radioStop.classList.remove("fa-stop");
      if (visualizer) visualizer.stop();
    } else {
      radio.classList.add("play");
      radioStop.classList.add("fa-stop");
      radioStop.classList.remove("fa-play");
      if (visualizer) visualizer.start(audio);
    }
  };

  const selectItem = (elem) => {
    radioItems.forEach((item) => item.classList.remove("select"));
    elem.classList.add("select");
  };

  radioNavigation.addEventListener("change", (event) => {
    const parent = event.target.closest(".radio-item");
    if (!parent) return;

    selectItem(parent);

    const title = parent.querySelector(".radio-name").textContent;
    radioHeaderBig.textContent = title;

    const img = parent.querySelector(".radio-img").src;
    radioCoverImg.src = img;

    radioStop.disabled = false;

    const streamUrl = event.target.dataset.radioStation;
    audio.src = streamUrl;
    audio.play().then(() => {
      changeIconPlay();
    }).catch(err => {
      console.warn("Radio playback error/policy:", err);
      changeIconPlay();
    });
  });

  radioStop.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => changeIconPlay()).catch(() => changeIconPlay());
    } else {
      audio.pause();
      changeIconPlay();
    }
  });

  const changeValue = () => {
    audio.volume = radioVolume.value / 100;
  };

  if (radioVolume) {
    radioVolume.addEventListener("input", changeValue);
  }
  if (radioVolumeUp) {
    radioVolumeUp.addEventListener("click", () => {
      audio.volume = 1;
      if (radioVolume) radioVolume.value = 100;
    });
  }
  if (radioVolumeDown) {
    radioVolumeDown.addEventListener("click", () => {
      audio.volume = 0;
      if (radioVolume) radioVolume.value = 0;
    });
  }

  radioPlayerInit.stop = () => {
    audio.pause();
    changeIconPlay();
  };
};