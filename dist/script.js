(()=>{"use strict";var e=function e(){var t=document.querySelector(".radio"),o=document.querySelector(".radio-cover__img"),n=document.querySelector(".radio-header__big"),a=document.querySelector(".radio-navigation"),c=document.querySelectorAll(".radio-item"),u=document.querySelector(".radio-stop"),r=document.querySelector(".radio-volume"),l=document.querySelector(".radio-volume-up"),i=document.querySelector(".radio-volume-down"),s=new Audio;s.type="audio/aac",u.disabled=!0;var d=function(){s.paused?(t.classList.remove("play"),u.classList.add("fa-play"),u.classList.remove("fa-stop")):(t.classList.add("play"),u.classList.add("fa-stop"),u.classList.remove("fa-play"))};a.addEventListener("change",(function(e){var t,a=e.target.closest(".radio-item");t=a,c.forEach((function(e){return e.classList.remove("select")})),t.classList.add("select");var r=a.querySelector(".radio-name").textContent;n.textContent=r;var l=a.querySelector(".radio-img").src;o.src=l,u.disabled=!1,s.src=e.target.dataset.radioStation,s.play(),d()})),u.addEventListener("click",(function(){s.paused?s.play():s.pause(),d()}));var v=function(){s.volume=r.value/100,l.onclick=function(){s.volume=1,r.value=100},i.onclick=function(){s.volume=0,r.value=0},console.log(r)};r.addEventListener("input",v),v(),e.stop=function(){s.pause(),d()}},t=function(e){return e<10?"0"+e:e},o=function e(){var o=document.querySelector(".video-player"),n=document.querySelector(".video-button__play"),a=document.querySelector(".video-button__stop"),c=document.querySelector(".video-time__passed"),u=document.querySelector(".video-progress"),r=document.querySelector(".video-time__total"),l=document.querySelector(".video-volume"),i=document.querySelector(".video-fullscreen"),s=document.querySelector(".video-volume-up"),d=document.querySelector(".video-volume-down");i.addEventListener("click",(function(){o.requestFullscreen()})),console.dir(o);var v=function(){o.paused?(n.classList.remove("fa-pause"),n.classList.add("fa-play")):(n.classList.remove("fa-play"),n.classList.add("fa-pause"))},m=function(){o.paused?o.play():o.pause(),v()};o.addEventListener("click",m),n.addEventListener("click",m),o.addEventListener("fullscreenchange",(function(){document.fullscreenElement?o.removeEventListener("click",m):o.addEventListener("click",m)})),o.addEventListener("play",v),o.addEventListener("pause",v),a.addEventListener("click",(function(){o.pause(),o.currentTime=0})),o.addEventListener("timeupdate",(function(){var e=o.currentTime,n=o.duration;console.log(e),console.log(n),u.value=e/n*100;var a=Math.floor(e/60),l=Math.floor(e%60),i=Math.floor(n/60),s=Math.floor(n%60);c.textContent=t(a)+":"+t(l),r.textContent=t(i)+":"+t(s)})),u.addEventListener("change",(function(){var e=o.duration,t=u.value;o.currentTime=t*e/100}));var p=function(){var e=l.value;o.volume=e/100,s.onclick=function(){o.volume=1,l.value=100},d.onclick=function(){o.volume=0,l.value=0},console.log(l.value)};l.addEventListener("input",p),o.addEventListener("volumechange",(function(){l.value=Math.round(100*o.volume)})),console.log(o.volume),p(),console.log(o.volume),e.stop=function(){o.pause(),v()}},n=function e(){var o=document.querySelector(".audio"),n=document.querySelector(".audio-img"),a=document.querySelector(".audio-header"),c=document.querySelector(".audio-player"),u=document.querySelector(".audio-navigation"),r=document.querySelector(".audio-button__play"),l=document.querySelector(".audio-progress"),i=document.querySelector(".audio-progress__timing"),s=document.querySelector(".audio-time__passed"),d=document.querySelector(".audio-time__total"),v=document.querySelector(".audio-volume"),m=document.querySelector(".audio-volume-up"),p=document.querySelector(".audio-volume-down");console.dir(c);var y=["Anata-Wa Korosareta","Barking Barrels","Be Rich or Snitch","Beat Coin","Become Juicy","Blah-call-it","Cash-In-Garage","Final Lynch","FluteInc.-feat-Tony-Montana","Ideal Job","Konoha In Action","Lip-Slip","MonTony x Ru1zy - Cash","Murda-Priest","Rubbish-Gangstas","Still Flute +","Streets-In-Souls","Sweat-_-Blood","Tangle-Club","Thonnie","Tight Style reinc"],f=0,L=function(){var e=c.paused,t=y[f];n.src="./audio/hello.jpg",a.textContent=t.toUpperCase(),c.src="./audio/".concat(t,".mp3"),console.log(c.src),e?c.pause():c.play()},S=function(){f===y.length-1?f=0:f++,L()};u.addEventListener("click",(function(e){e.target.classList.contains("audio-button__play")&&(o.classList.toggle("play"),r.classList.toggle("fa-play"),r.classList.toggle("fa-pause"),c.paused?c.play():c.pause());var t=y[f];a.textContent=t.toUpperCase(),e.target.classList.contains("audio-button__next")&&S(),e.target.classList.contains("audio-button__prev")&&(0!==f?f--:f=y.length-1,L())})),c.addEventListener("ended",(function(){S(),c.play()})),c.addEventListener("timeupdate",(function(){var e=c.duration,o=c.currentTime,n=o/e*100;i.style.width=n+"%";var a=Math.floor(o/60)||"0",u=Math.floor(o%60)||"0",r=Math.floor(e/60)||"0",l=Math.floor(e%60)||"0";s.textContent="".concat(t(a),":").concat(t(u)),d.textContent="".concat(t(r),":").concat(t(l))})),l.addEventListener("click",(function(e){var t=e.offsetX/l.clientWidth*c.duration;c.currentTime=t})),console.log(f);var g=function(){c.volume=v.value/100,m.onclick=function(){c.volume=1,v.value=100},p.onclick=function(){c.volume=0,v.value=0},console.log(v)};v.addEventListener("input",g),g(),e.stop=function(){c.pause(),o.classList.remove("play"),r.classList.remove("fa-pause"),r.classList.add("fa-play")}},a=document.querySelectorAll(".player-btn"),c=document.querySelectorAll(".player-block"),u=document.querySelector(".temp");a.forEach((function(t,r){t.addEventListener("click",(function(){u.style.display="none",a.forEach((function(e){e.classList.remove("active")})),c.forEach((function(e){e.classList.remove("active")})),e.stop(),o.stop(),n.stop(),t.classList.add("active"),c[r].classList.add("active")}))})),o(),e(),n()})();