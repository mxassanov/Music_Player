const img = document.querySelector('img')
const title = document.getElementById('title')
const artist = document.getElementById('artist')
const music = document.querySelector('audio')
const durationElem = document.getElementById('duration')
const currentTimeElem = document.getElementById('current-time')
const progressContainer = document.getElementById('progress-container')
const progress = document.getElementById('progress')
const nextBtn = document.getElementById('next')
const prevBtn = document.getElementById('prev')
const playBtn = document.getElementById('play')

const songs = [
  {
    fileName: 'player-1',
    songName: 'Elysium',
    artist: 'Hans Zimmer'
  },
  {
    fileName: 'player-2',
    songName: 'Honor Him',
    artist: 'Hans Zimmer'
  },
  {
    fileName: 'player-3',
    songName: 'Now We Are Free',
    artist: 'Hans Zimmer'
  },
  {
    fileName: 'player-4',
    songName: 'STAY',
    artist: 'Hans Zimmer'
  },
]

let isPlaying = false

function playSong() {
  isPlaying = true
  /*Меняем иконку воспроизведения и подсказку*/
  playBtn.classList.replace('fa-play', 'fa-pause')
  playBtn.setAttribute('title', 'Пауза')

  music.play();
}

function pauseSong() {
  isPlaying = false
  playBtn.classList.replace('fa-pause', 'fa-play')
  playBtn.setAttribute('title', 'Воспроизвести')
  music.pause();
}

playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()))

/*Обновляем DOM */
function loadSong(song) {
  title.textContent = song.songName
  artist.textContent = song.artist
  music.src = `music/${song.fileName}.mp3`
  img.src = `img/${song.fileName}.jpg`
}

/* Инлекс текущей песни */
let currentSongIndex = 0

/* Следующая песня */
function nextSong() {
  currentSongIndex++;

  if(currentSongIndex > songs.length -1 ) {
    currentSongIndex = 0
  }
  loadSong(songs[currentSongIndex])
  playSong()
}

/* Предыдущая песня*/
function prevSong() {
  currentSongIndex--

  if(currentSongIndex < 0) {
    currentSongIndex = songs.length -1
  }
  loadSong(songs[currentSongIndex])
  playSong()
}

/* Обновляем прогресс */
function updateProgress(e) {
  if(isPlaying) {
    const {currentTime, duration} = e.srcElement
    /* Находим процент и меняем ширину прогресса с помощью стилей */
    const progressPercent = (currentTime / duration) * 100
    /*  Процент% вместе с переменной, иначе в CSS будет ошибка */
    progress.style.width = `${progressPercent}%`
    /* Длительность, полученную из свойств объекта события, переводим в минуты */
    const durationMinutes = Math.floor(duration / 60)
    let durationSeconds = Math.floor(duration % 60)
    /* Добавляем 0, если секунд меньше 10 */
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`
    }
    /* Задерживаем переключение длительности, пока не закончатся вычисления, чтобы избежать появления NaN */
    if (durationSeconds) {
      durationElem.textContent = `${durationMinutes} : ${durationSeconds}`
    }
    /* Текущее время, полученное из свойств объекта события, переводим в минуты */
    const currentMinutes = Math.floor(currentTime / 60)
    let currentSeconds = Math.floor(currentTime % 60)
    /* Добавляем 0, если секунд меньше 10 */
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`
    }
    currentTimeElem.textContent = `${currentMinutes} : ${currentSeconds}`
  }
}

/* Находим место клика по координате X, ширину контейнера прогресса, продолжительность песни, и вычисляем текущее
*   время, чтобы установить его как атрибут объекту песни (в сек.)   */
function setProgress(e) {
  const width = this.clientWidth
  const clickX = e.offsetX
  const { duration } = music
  music.currentTime = (clickX / width) * duration
}

nextBtn.addEventListener('click', nextSong)
prevBtn.addEventListener('click', prevSong)
music.addEventListener('ended', nextSong)
music.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)

loadSong(songs[0])