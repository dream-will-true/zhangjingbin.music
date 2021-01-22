<template>
  <div id="app">
    <div class="app-player">
      <div class="app-plalyer-header">
        <music-header @getlist="handleMusic" @clearstar='clearstar'> </music-header>
      </div>
      <div class="app-player-content">
        <music-content
          :songs="songList"
          :starlist='starmusic'
          :playingstatus="playingstatus"
          @getsong="handsong"
          @getmv="handlemvurl"
        ></music-content>
      </div>
      <div class="app-player-footer">
        <music-fooer
          :sendsong="songurl"
          @pausekey="handlepause"
          @playkey="handleplay"
        ></music-fooer>
      </div>
    </div>
    <div :class="['mask', { maskhidden: hiddenvideo }]">
      <div class="closemv" @click.stop="closemv">x</div>
      <div class="app-player-vedio">
        <video
          ref="video"
          :src="mvurl"
          controls="controls"
          loop="loop"
          autoplay="autoplay"
        ></video>
      </div>
      <div class="app-mask"></div>
    </div>
  </div>
</template>

<script>
import Header from "./components/my-music-header";
import Content from "./components/my-music-content";
import Footer from "./components/my-music-fooer";
// import axios from 'axios'
export default {
  name: "App",
  /* created(){     //发送请求的地方
        this.$http.get('https://apimusic.linweiqin.com/search?keywords="热门"').then(res=>{
          console.log(res)
        })
   }, */
  created() {
    this.$http
      .get("https://apimusic.linweiqin.com/search", {
        params: {
          keywords: "热门",
        }
      })
      .then((res) => {
       this.starmusic=res.data.result.songs
      });
  },
  components: {
    "music-header": Header,
    "music-content": Content,
    "music-fooer": Footer,
  },
  data: function () {
    return {
      songList: [],
      songurl: "",
      mvurl: "",
      hiddenvideo: true,
      playingstatus: false,
      starmusic:[]
    };
  },

  methods: {
    clearstar(clearstar){
      this.starmusic=clearstar

    },
    closemv() {
      this.hiddenvideo = true;
      this.$refs.video.pause();
    },
    handlemvurl(mvurl) {
      this.mvurl = mvurl;
      this.hiddenvideo = false;
    },
    handleMusic(songs) {
      this.songList = songs;
    },
    handsong(songurl) {
      this.songurl = songurl;
    },
    handleclass() {
      alert("shodff");
    },
    handlepause(val) {
      this.playingstatus = val;
    },
    handleplay(val) {
      this.playingstatus = val;
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  overflow: hidden;
  background: url(./assets/bg.jpg) no-repeat;
  background-size: 100% 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-width: 1320px;
  height: 100vh;
  min-height: 620px;

  --themeColor: #1baad5;
}
.app-player {
  width: 800px;
  height: 600px;
  /* margin: 50px auto; */
}
.app-player .app-plalyer-header {
  height: 60px;
  width: 100%;
  background-color: var(--themeColor);
}
.app-player .app-player-content {
  height: 480px;
  background-color: rgba(255, 255, 255, 0.3);
}
.app-player .app-player-footer {
  height: 60px;
  width: 100%;
  background-color: var(--themeColor);
}
.mask {
}
.maskhidden {
  display: none;
}
.closemv {
  position: fixed;
  right: 4%;
  top: 4%;
  z-index: 999;
  color: #fff;
  cursor: pointer;
}
video {
  width: 100%;
  height: 100%;
  outline: none;
}
.app-player-vedio {
  transform: translate(-50%, -50%);
  position: fixed;
  left: 50%;
  top: 50%;
  width: 700px;
  height: 500px;
  z-index: 9;
  background-color: #000;
}
.app-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-width: 1320px;
  height: 100vh;
  min-width: 620px;
  background-color: #000;
}
</style>
