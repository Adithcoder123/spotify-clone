async function getsongs() {
    try {
        const response = await fetch("songs.json");
        const songs = await response.json();
    let list = document
    .querySelector(".songlist")
      .getElementsByTagName("ul")[0];
      
    for (let s of songs) {
        list.innerHTML =
        list.innerHTML +
        `<li>
                <img class="invert" src="musicicon.png" alt="" />
                <div class="info">
                <div class="songname">${s.name}</div>
                <div>adith</div>
                </div>
                <div class="flex">
                    <span class="play-now">
                      <span>play</span>
                      <span>now</span>
                    </span>
                  <div><img class="invert" src="playbutton.webp" alt="" /></div>
                </div>
              </li>`;
            }
            return songs;
  } catch (error) {
    console.error("Could not load songs.json:", error);
  }
}
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

let currentsong = null;
let currentSongIndex = 0;
const play = document.querySelector(".play");
//function used to play the song clicked
const playmusic = (track, songs) => {
  const songIndex = songs.findIndex((song) => song.name === track);

  if (songIndex === -1) {
    return;
  }

  currentSongIndex = songIndex;

  if (currentsong) {
    currentsong.pause();
  }

  currentsong = new Audio(songs[currentSongIndex].url);
  currentsong.play();
  play.src = "play.webp";

  document.querySelector(".songinfo").textContent =
    songs[currentSongIndex].name;
};
async function main() {
    const songs = await getsongs();
    if (!songs || songs.length === 0) {
        return;
    }
    
    //first song
    currentsong = new Audio(songs[0].url);
    
    document.querySelector(".songinfo").textContent = songs[0].name;
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").textContent =
        `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
        //for seekbar
        document.querySelector(".circle").style.left=(currentsong.currentTime / currentsong.duration)*100+"%";
    });
    //for click wherever we want
    document.querySelector(".seekbar").addEventListener("click",(e)=> {
        const seekbar = e.currentTarget;
        let percent = e.offsetX / seekbar.clientWidth;
        document.querySelector(".circle").style.left=`${percent * 100}%`;;
        currentsong.currentTime = percent * currentsong.duration;
    })
    //for are list
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")
).forEach((e) => {
    e.addEventListener("click", () => {
        console.log(e.querySelector("div").firstElementChild.innerHTML);
        let track=e.querySelector("div").firstElementChild.innerHTML
        playmusic(track,songs);
    })
})
//previous and next songs
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");
//previous
previousButton.addEventListener("click", () => {
currentSongIndex =(currentSongIndex - 1 + songs.length) % songs.length;
playmusic(songs[currentSongIndex].name,songs)})
// next
nextButton.addEventListener("click", () => {
currentSongIndex=((currentSongIndex + 1)%songs.length);
playmusic(songs[currentSongIndex].name,songs);
})



play.addEventListener("click", () => {
    if (!currentsong) {
    return;
  }

  if (currentsong.paused) {
    currentsong.play();
      play.src = "play.webp";
  } else {
    currentsong.pause();
    play.src = "playbutton.webp";
  }});

}

main();
