import { addZero } from "./addZero.js";
import { AudioVisualizer } from "./visualizer.js";
import { getCustomTracks, saveCustomTrack, deleteCustomTrack } from "./db.js";

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

  // Playlist drawer elements
  const playlistToggleBtn = document.getElementById("playlistToggleBtn");
  const playlistPanel = document.getElementById("audioPlaylistPanel");
  const playlistCloseBtn = document.getElementById("playlistCloseBtn");
  const playlistList = document.getElementById("playlistList");
  const playlistCount = document.getElementById("playlistCount");
  const badgeCustomCount = document.getElementById("badgeCustomCount");
  const playlistSearchInput = document.getElementById("playlistSearchInput");
  const playlistTabs = document.querySelectorAll(".playlist-tab");
  const audioFileInput = document.getElementById("audioFileInput");
  const playlistDropZone = document.getElementById("playlistDropZone");

  let visualizer = null;
  if (visualizerCanvas) {
    visualizer = new AudioVisualizer(visualizerCanvas);
  }

  const BUILTIN_NAMES = [
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

  const builtinTracks = BUILTIN_NAMES.map((name, i) => ({
    id: `builtin_${i}`,
    name,
    formattedName: name.replace(/[-_]/g, " ").toUpperCase(),
    src: `./audio/${encodeURIComponent(name)}.mp3`,
    isCustom: false,
  }));

  let customTracks = [];
  let allTracks = [...builtinTracks];
  let currentTrackIndex = 0;
  let currentBlobUrl = null;
  let activeTab = "all"; // 'all' | 'builtin' | 'custom'
  let searchQuery = "";

  const updateMarquee = () => {
    if (!audioHeader) return;
    audioHeader.classList.remove("marquee-scrolling");
    audioHeader.style.transform = "";
    // Force browser reflow to reset CSS animation
    void audioHeader.offsetWidth;

    const container = audioHeader.parentElement;
    const containerWidth = container ? container.clientWidth : 320;
    const textWidth = audioHeader.scrollWidth;

    if (textWidth > containerWidth + 6) {
      const distance = textWidth - containerWidth + 24;
      const duration = Math.max(5.5, Math.min(16, distance / 22));
      audioHeader.style.setProperty("--marquee-distance", `${distance}px`);
      audioHeader.style.setProperty("--marquee-duration", `${duration}s`);
      audioHeader.classList.add("marquee-scrolling");
    }
  };

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
    highlightActiveInPlaylist();
  };

  const loadTrackByIndex = (index, shouldPlay = true) => {
    if (!allTracks.length) return;

    if (index < 0) index = allTracks.length - 1;
    if (index >= allTracks.length) index = 0;
    currentTrackIndex = index;

    const track = allTracks[currentTrackIndex];

    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }

    audioImg.src = "./audio/hello.jpg";
    audioHeader.textContent = track.formattedName;
    updateMarquee();

    if (track.isCustom) {
      currentBlobUrl = URL.createObjectURL(track.blob);
      audioPlayer.src = currentBlobUrl;
    } else {
      audioPlayer.src = track.src;
    }

    if (shouldPlay) {
      audioPlayer.play().then(() => {
        updatePlayState(true);
      }).catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    } else {
      updatePlayState(false);
    }

    highlightActiveInPlaylist();
  };

  const prevTrack = () => {
    loadTrackByIndex(currentTrackIndex - 1, true);
  };

  const nextTrack = () => {
    loadTrackByIndex(currentTrackIndex + 1, true);
  };

  const highlightActiveInPlaylist = () => {
    if (!playlistList) return;
    const currentTrack = allTracks[currentTrackIndex];
    const items = playlistList.querySelectorAll(".playlist-item");
    items.forEach((item) => {
      const id = item.getAttribute("data-id");
      const isCurrent = currentTrack && id === currentTrack.id;
      item.classList.toggle("active", isCurrent);
      const icon = item.querySelector(".playlist-item-status");
      if (icon) {
        if (isCurrent && !audioPlayer.paused) {
          icon.className = "fa fa-volume-up playlist-item-status";
        } else if (isCurrent) {
          icon.className = "fa fa-pause playlist-item-status";
        } else {
          icon.className = "fa fa-play playlist-item-status";
        }
      }
    });
  };

  const renderPlaylist = () => {
    if (!playlistList) return;

    // Filter tracks
    const filtered = allTracks.filter((track) => {
      if (activeTab === "builtin" && track.isCustom) return false;
      if (activeTab === "custom" && !track.isCustom) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return track.name.toLowerCase().includes(q) || track.formattedName.toLowerCase().includes(q);
      }
      return true;
    });

    if (playlistCount) {
      playlistCount.textContent = `${allTracks.length} трек${allTracks.length === 1 ? '' : allTracks.length < 5 ? 'а' : 'ов'}`;
    }
    if (badgeCustomCount) {
      badgeCustomCount.textContent = `(${customTracks.length})`;
    }

    if (!filtered.length) {
      playlistList.innerHTML = `
        <li style="padding: 1.5rem 1rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">
          ${searchQuery ? 'Треки не найдены по запросу' : 'Список треков пуст'}
        </li>
      `;
      return;
    }

    const currentTrack = allTracks[currentTrackIndex];

    playlistList.innerHTML = filtered.map((track, i) => {
      const isActive = currentTrack && track.id === currentTrack.id;
      const isPlaying = isActive && !audioPlayer.paused;
      const tagText = track.isCustom ? 'Свой трек (IndexedDB)' : 'Ru1zy Beats • 320k';

      return `
        <li class="playlist-item ${isActive ? 'active' : ''}" data-id="${track.id}">
          <div class="playlist-item-left">
            <span class="playlist-item-index">${addZero(i + 1)}</span>
            <i class="fa ${isPlaying ? 'fa-volume-up' : isActive ? 'fa-pause' : 'fa-play'} playlist-item-status" style="font-size: 0.8rem; color: var(--neon-cyan); width: 14px;"></i>
            <div class="playlist-item-info">
              <span class="playlist-item-name" title="${track.formattedName}">${track.formattedName}</span>
              <span class="playlist-item-tag">${tagText}</span>
            </div>
          </div>
          <div class="playlist-item-right">
            ${track.isCustom ? `
              <button type="button" class="playlist-item-delete fa fa-trash" data-delete-id="${track.id}" title="Удалить из IndexedDB"></button>
            ` : ''}
          </div>
        </li>
      `;
    }).join('');
  };

  // Process user audio files into IndexedDB
  const handleAddFiles = async (files) => {
    if (!files || !files.length) return;

    const audioFiles = Array.from(files).filter(file => 
      file.type.startsWith("audio/") || file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i)
    );

    if (!audioFiles.length) {
      alert("Пожалуйста, выберите аудиофайлы (.mp3, .wav, .ogg)");
      return;
    }

    let firstAddedId = null;

    for (const file of audioFiles) {
      try {
        const saved = await saveCustomTrack(file);
        const customItem = {
          id: saved.id,
          name: saved.name,
          formattedName: saved.name.toUpperCase(),
          blob: saved.blob,
          isCustom: true,
        };
        customTracks.push(customItem);
        allTracks.push(customItem);
        if (!firstAddedId) firstAddedId = saved.id;
      } catch (err) {
        console.error("Failed to save audio track:", err);
      }
    }

    renderPlaylist();

    // Play the newly uploaded track
    if (firstAddedId) {
      const newIndex = allTracks.findIndex(t => t.id === firstAddedId);
      if (newIndex !== -1) {
        loadTrackByIndex(newIndex, true);
      }
    }
  };

  // Initialize custom tracks from IndexedDB
  getCustomTracks().then((records) => {
    if (records && records.length) {
      customTracks = records.map((rec) => ({
        id: rec.id,
        name: rec.name,
        formattedName: rec.name.toUpperCase(),
        blob: rec.blob,
        isCustom: true,
      }));
      allTracks = [...builtinTracks, ...customTracks];
    }
    renderPlaylist();
    // Refresh marquee for initial load
    updateMarquee();
  }).catch((err) => {
    console.warn("Could not load IndexedDB custom tracks:", err);
  });

  // UI Event Listeners for Playlist
  if (playlistToggleBtn && playlistPanel) {
    playlistToggleBtn.addEventListener("click", () => {
      const isHidden = playlistPanel.classList.toggle("hide");
      playlistToggleBtn.classList.toggle("active", !isHidden);
      if (!isHidden) {
        renderPlaylist();
        highlightActiveInPlaylist();
      }
    });
  }

  if (playlistCloseBtn && playlistPanel) {
    playlistCloseBtn.addEventListener("click", () => {
      playlistPanel.classList.add("hide");
      if (playlistToggleBtn) playlistToggleBtn.classList.remove("active");
    });
  }

  playlistTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      playlistTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.getAttribute("data-tab");
      renderPlaylist();
    });
  });

  if (playlistSearchInput) {
    playlistSearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderPlaylist();
    });
  }

  if (audioFileInput) {
    audioFileInput.addEventListener("change", (e) => {
      handleAddFiles(e.target.files);
      e.target.value = "";
    });
  }

  if (playlistList) {
    playlistList.addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".playlist-item-delete");
      if (deleteBtn) {
        e.stopPropagation();
        const idToDelete = deleteBtn.getAttribute("data-delete-id");
        if (idToDelete) {
          await deleteCustomTrack(idToDelete);
          const wasPlayingDeleted = allTracks[currentTrackIndex]?.id === idToDelete;
          customTracks = customTracks.filter((t) => t.id !== idToDelete);
          allTracks = allTracks.filter((t) => t.id !== idToDelete);
          renderPlaylist();
          if (wasPlayingDeleted) {
            loadTrackByIndex(currentTrackIndex, true);
          }
        }
        return;
      }

      const item = e.target.closest(".playlist-item");
      if (!item) return;

      const trackId = item.getAttribute("data-id");
      const targetIndex = allTracks.findIndex((t) => t.id === trackId);
      if (targetIndex !== -1) {
        if (targetIndex === currentTrackIndex) {
          if (audioPlayer.paused) {
            audioPlayer.play();
            updatePlayState(true);
          } else {
            audioPlayer.pause();
            updatePlayState(false);
          }
        } else {
          loadTrackByIndex(targetIndex, true);
        }
      }
    });
  }

  // Drag and Drop files
  if (playlistDropZone) {
    playlistDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      playlistDropZone.classList.add("drag-over");
    });

    playlistDropZone.addEventListener("dragleave", () => {
      playlistDropZone.classList.remove("drag-over");
    });

    playlistDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      playlistDropZone.classList.remove("drag-over");
      if (e.dataTransfer && e.dataTransfer.files) {
        handleAddFiles(e.dataTransfer.files);
      }
    });
  }

  // Navigation controls
  audioNavigation.addEventListener("click", (event) => {
    if (event.target.classList.contains("audio-button__play")) {
      if (audioPlayer.paused) {
        if (!audioPlayer.src || audioPlayer.src.endsWith("/")) {
          loadTrackByIndex(currentTrackIndex, true);
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
  audioPlayer.addEventListener("ended", () => nextTrack());

  audioPlayer.addEventListener("timeupdate", () => {
    const duration = audioPlayer.duration || 0;
    const currentTime = audioPlayer.currentTime || 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (audioProgressTiming) {
      audioProgressTiming.style.width = `${progress}%`;
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

  // Pre-fill initial track title and compute marquee
  audioHeader.textContent = builtinTracks[0].formattedName;
  setTimeout(() => updateMarquee(), 150);

  // Recalculate marquee when window resizes
  window.addEventListener("resize", () => {
    updateMarquee();
  });

  musicPlayerInit.stop = () => {
    audioPlayer.pause();
    updatePlayState(false);
  };
};
