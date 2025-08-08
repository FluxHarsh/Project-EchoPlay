let currentSong = new Audio();
let allSongs = [];

function formatSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const playMusic = (trackUrl) => {
  currentSong.pause();
  currentSong.currentTime = 0;
  currentSong.src = trackUrl;
  currentSong.play();

  const songName = trackUrl.split('/').pop().replace('.mp3', '');

  document.querySelector("#play").src = "Assests/pause.svg";
  document.querySelector(".songname").innerHTML = songName;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function loadPlaylistSongs(playlistName) {
  const response = await fetch("folder/songs.json");
  const data = await response.json();
  const songs = data[playlistName];

  allSongs = songs;
  const ul = document.querySelector(".songList ul");
  ul.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img class="invert" src="Assests/music.svg" alt="">
      <div class="info">${index + 1}. ${song.name} by ${song.artist}</div>
      <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="Assests/play.svg" alt="">
      </div>
    `;
    ul.appendChild(li);

    li.querySelector(".playNow").addEventListener("click", () => {
      playMusic(song.url);
    });
  });
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const playlistName = card.getAttribute("data-playlist");
    console.log("Clicked playlist:", playlistName);
    loadPlaylistSongs(playlistName);
  });
});

// Helper function to get the current song index
function getCurrentSongIndex() {
  const currentFile = decodeURIComponent(currentSong.src.split("/").pop());
  console.log("Current song index:", currentFile); 

  return allSongs.findIndex(song => song.url.split("/").pop() === currentFile);
}

// Play / Pause Button Logic
document.querySelector("#play").addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    document.querySelector("#play").src = "Assests/pause.svg";
  } else {
    currentSong.pause();
    document.querySelector("#play").src = "Assests/play.svg";
  }
});



// Previous button functionality
document.querySelector("#previous").addEventListener("click", () => {
  let index = getCurrentSongIndex();
  console.log("Previous button clicked. Current song index:", index);

  if (index > 0) {
    playMusic(allSongs[index - 1].url);
  } else {
    playMusic(allSongs[allSongs.length - 1].url);
  }
});

// Next button functionality
document.querySelector("#next").addEventListener("click", () => {
  let index = getCurrentSongIndex();
  console.log("Next button clicked. Current song index:", index); 

  if (index < allSongs.length - 1) {
    playMusic(allSongs[index + 1].url);
  } else {
    playMusic(allSongs[0].url);
  }
});

// Volume Control
document.querySelector(".range input").addEventListener("input", (e) => {
  currentSong.volume = e.target.value / 100;

});


currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`;

  // Update seekbar circle position based on current time
  const progress = (currentSong.currentTime / currentSong.duration) * 100;
  document.querySelector(".circle").style.left = `${progress}%`;  
});

document.querySelector(".seekbar").addEventListener("click", (e) => {
  const seekbarWidth = e.target.getBoundingClientRect().width;
  const offsetX = e.offsetX;  
  const percent = (offsetX / seekbarWidth) * 100;

  document.querySelector(".circle").style.left = `${percent}%`; 


  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

//Adding an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0 "
})

//Adding an event listener for close
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-130%"
})


//Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e => {
  console.log(e.target)
  console.log("changing", e.target.src)
  if (e.target.src.includes("Assests/volume.svg")) {
    e.target.src = e.target.src.replace("Assests/volume.svg", "Assests/mute.svg")
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else {
    e.target.src = e.target.src.replace("Assests/mute.svg", "Assests/volume.svg")
    currentSong.volume = .10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }
}
)