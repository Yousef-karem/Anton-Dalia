/* Wedding invitation — countdown + music player */

const WEDDING_DATE = new Date("2026-08-01T18:00:00");

/* ===== Countdown ===== */
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  let diff = WEDDING_DATE - now;

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);

  const next = {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };

  setNum(daysEl, next.days);
  setNum(hoursEl, next.hours);
  setNum(minutesEl, next.minutes);
  setNum(secondsEl, next.seconds);
}

function setNum(el, value) {
  if (el.textContent !== value) {
    el.textContent = value;
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== Music player ===== */
const audio = document.getElementById("weddingAudio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const seekBar = document.getElementById("seekBar");
const muteBtn = document.getElementById("muteBtn");
const timeDisplay = document.getElementById("timeDisplay");

const PLAY_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const PAUSE_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>`;
const VOLUME_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const MUTE_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function updateTimeDisplay() {
  const current = formatTime(audio.currentTime);
  const total = formatTime(audio.duration);
  timeDisplay.textContent = `${current} / ${total}`;
}

function setPlayingUI(playing) {
  playBtn.classList.toggle("is-playing", playing);
  playIcon.innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
  playBtn.setAttribute("aria-label", playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى");
}

playBtn.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      await audio.play();
      setPlayingUI(true);
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  } catch {
    setPlayingUI(false);
    timeDisplay.textContent = "أضف ملف music.mp3";
  }
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  seekBar.value = String((audio.currentTime / audio.duration) * 100);
  updateTimeDisplay();
});

audio.addEventListener("loadedmetadata", updateTimeDisplay);
audio.addEventListener("ended", () => {
  setPlayingUI(false);
  seekBar.value = "0";
  updateTimeDisplay();
});

audio.addEventListener("error", () => {
  timeDisplay.textContent = "0:00 / —";
});

seekBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(seekBar.value) / 100) * audio.duration;
  updateTimeDisplay();
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  const icon = document.getElementById("volumeIcon");
  if (icon) {
    icon.outerHTML = audio.muted
      ? MUTE_SVG.replace("<svg", '<svg id="volumeIcon"')
      : VOLUME_SVG.replace("<svg", '<svg id="volumeIcon"');
  }
  muteBtn.setAttribute("aria-label", audio.muted ? "تشغيل الصوت" : "كتم الصوت");
});

/* Soft entrance for sections already handled via CSS animations */
