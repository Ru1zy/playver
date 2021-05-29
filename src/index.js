import { radioPlayerInit } from "./stuff/radioPlayer.js";
import { videoPlayerInit } from "./stuff/videoPlayer.js";
import { musicPlayerInit } from "./stuff/musicPlayer.js";

const playerBtn = document.querySelectorAll(".player-btn");
const playerBlock = document.querySelectorAll(".player-block");
const temp = document.querySelector(".temp");

const deactivationPlayer = () => {
  temp.style.display = "none";
  playerBtn.forEach((item) => {
    item.classList.remove("active");
  });
  playerBlock.forEach((item) => {
    item.classList.remove("active");
  });

  radioPlayerInit.stop();
  videoPlayerInit.stop();
  musicPlayerInit.stop();
};

playerBtn.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    deactivationPlayer();
    btn.classList.add("active");
    playerBlock[i].classList.add("active");
  });
});

videoPlayerInit();
radioPlayerInit();
musicPlayerInit();
