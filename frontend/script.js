let songs = [];
let currentIndex = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const list = document.getElementById("songList");
const playBtn = document.getElementById("playBtn");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

/* FETCH SONGS */
fetch("https://songs-back.onrender.com/api/songs")
  .then(res => res.json())
  .then(data => {
    songs = data;
    renderSongs(songs);
    if (songs.length > 0) loadSong(0);
  });

/* RENDER LIST */
function renderSongs(data) {
  list.innerHTML = "";
  data.forEach((song, i) => {
    const li = document.createElement("li");
    li.innerText = song.title;
    li.onclick = () => loadSong(i);
    list.appendChild(li);
  });
}

/* LOAD SONG */
function loadSong(index) {
  currentIndex = index;

  document.querySelectorAll("#songList li")
    .forEach(li => li.classList.remove("active"));
  list.children[index].classList.add("active");

  title.innerText = songs[index].title;
  artist.innerText = songs[index].artist || "";
  cover.src = songs[index].cover
    ? `https://songs-back.onrender.com/uploads/${songs[index].cover}`
    : "";

  audio.src = `https://songs-back.onrender.com/uploads/${songs[index].file}`;
  audio.play();

  playBtn.innerHTML = "⏸";
  currentTimeEl.innerText = "0:00";
  durationEl.innerText = "0:00";
}

/* PLAY / PAUSE */
function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = "⏸";
  } else {
    audio.pause();
    playBtn.innerHTML = "▶";
  }
}

/* NEXT / PREV */
function next() {
  loadSong((currentIndex + 1) % songs.length);
}

function prev() {
  loadSong((currentIndex - 1 + songs.length) % songs.length);
}

/* FORMAT TIME */
function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

/* DURATION */
audio.onloadedmetadata = () => {
  durationEl.innerText = formatTime(audio.duration);
};

/* PROGRESS */
audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.innerText = formatTime(audio.currentTime);
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

/* AUTO NEXT */
audio.onended = next;

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(value)
  );
  renderSongs(filtered);
});
