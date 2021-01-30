<!--  -->

<template>
  <div class="music-content">
    <div class="music-content-left">
      <div class="content-left-list">
        <div class="list-box">
          <div
            class="left-list-item"
            v-for="item in starlist || songs"
            :key="item.id"
          >
            <div class="list-item-left"></div>
            <div class="list-item-mid" @click="getsong(item.id)">
              <span class="songname"> {{ item.name }}</span>
              <span class="songart">{{ item.artists[0].name }}</span>
            </div>
            <div
              :class="[
                'list-item-right',
                { hidden: item.mvid == 0 ? true : false },
              ]"
              @click="lookmv(item.mvid)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="music-content-mid">
      <div class="selecttype">
        <span class="fengmian" @click="cutfengmian">封面</span>
        <span class="geci" @click="geci">歌词</span>
      </div>
      <div class="singwordface" style="display: none">
        <p class="singword-item" v-for="(item, index) in songlist" :key="index">
          {{ item }}
        </p>
      </div>
      <div class="fengmianface">
        <img
          :class="{ playing: playingstatus }"
          src="../assets/player_bar.png"
          alt=""
        />
        <img
          :class="{ autorotate: playingstatus }"
          src="../assets/disc.png"
          alt=""
        />
        <img :class="{ autorotate: playingstatus }" :src="picurl" alt="" />
      </div>
    </div>
    <div class="music-content-right">
      <h1>热门留言</h1>
      <div class="comment-list">
        <div
          class="comment-list-item"
          v-for="comment in hotcommment"
          :key="comment.commentId"
        >
          <div class="list-item-left">
            <img :src="comment.user.avatarUrl" alt="" />
          </div>
          <div class="list-item-right">
            <div class="item-right-top">
              {{ comment.user.nickname }}
              <span class="likecount">{{ comment.likedCount }}</span>
            </div>
            <div class="item-right-buttom">
              {{ comment.content }}
            </div>
            <div class="item-right-time">{{ comment.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  props: {
    //和data一样 可以直接将变量引入元素中
    songs: {
      type: Array,
      default: function () {
        return [];
      },
    },
    starlist: {
      type: Array,
      default: function () {
        return [];
      },
    },

    playingstatus: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  components: {},
  data() {
    //这里存放数据
    return {
      isAutoPlaying: false,
      hotcommment: [],
      picurl: "",
      songer: "",
      songlist: [],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    cutfengmian() {
      var feemgmian = document.querySelector(".fengmianface");
      var singwordface = document.querySelector(".singwordface");
      singwordface.style.display = "none";
      feemgmian.style.display = "block";
    },
    geci() {
      var feemgmian = document.querySelector(".fengmianface");
      var singwordface = document.querySelector(".singwordface");
      feemgmian.style.display = "none";
      singwordface.style.display = "block";
    },
    // 第一个请求 视频  使用async  await发送请求
    async lookmv(mvid) {
      let res = await this.$http.get("mv/url", {
        params: {
          id: mvid,
        },
      });
      let mvurl = res.data.data.url;
      this.$emit("getmv", mvurl);
    },

    // 第二个请求 音频  使用promise
    // 请求歌词
    getsong(id) {
      this.$http
        .get("/lyric", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          var reg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.+)/;
          var songWord = res.data.lrc.lyric.split("\n");
          var songlist = [];
          for (var i = 0; i < songWord.length; i++) {
            (function (index) {
              let songw = songWord[index];
              var matches = reg.exec(songw);
              if (matches != null) {
                songlist.push(matches[4]);
              }
            })(i);
          }
        
          this.songlist = songlist;
        });
      this.$http
        .get("song/url", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          let songUrl = res.data.data[0].url;
          this.$emit("getsong", songUrl);
        });
      // 请求评论
      this.$http
        .get("comment/hot", {
          params: {
            id: id,
            type: 0,
            limit:50,
          },
        })
        .then((res) => {
          let hotcommment = res.data.hotComments;
          hotcommment.map(function (item) {
            let time = item.time;
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDay() + 1;
            let huors = date.getHours();
            if (huors < 10) {
              huors = "0" + huors;
            }
            let minutes = date.getMinutes();
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            let seconds = date.getSeconds();
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            let counttime = `${year}年${month}月${day}日  ${huors}:${minutes}:${seconds}`;
            item.time = counttime;
          });
          this.hotcommment = hotcommment;
        });
      // this.hotcommment = res.data.hotComments;

      // 请求图片

      this.$http
        .get("song/detail", {
          params: {
            ids: id,
          },
        })
        .then((res) => {
          this.picurl = res.data.songs[0].al.picUrl;
          this.songer = res.data.songs[0].ar[0].name;
        });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang='less' scoped>
.music-content {
  display: flex;

  .music-content-left {
    width: 200px;
    border-right: 1px dotted var(--themeColor);
    height: 480px;
    .content-left-list {
      overflow-y: scroll;
      height: 480px;
      box-sizing: border-box;
      .left-list-item:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .left-list-item {
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        .list-item-left {
          width: 22px;
          height: 20px;
          background: url("../assets/table.png") -17px 43px;
        }

        .list-item-mid {
          display: flex;
          justify-content: space-between;
          height: 28px;
          line-height: 28px;
          width: 150px;
          color: #fff;
          text-align: center;
          cursor: pointer;
          .songname {
            width: 87px;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            text-align: left;
            text-indent: 10px;         
            font-weight: 700;
          }
          .songart {
            width: 45px;
            font-size: 12px;
            overflow: hidden;
            color: #000;
            font-weight: 700;
          }
        }
        .hidden {
          opacity: 0;
        }

        .list-item-right {
          // position: absolute;
          width: 30px;
          height: 20px;
          background: url("../assets/table.png") left -45px;
        }
      }
    }
  }

  .music-content-mid {
    box-sizing: border-box;
    width: 400px;
    border-right: 1px dotted var(--themeColor);
    height: 480px;
    position: relative;
    .selecttype {
      z-index: 888;
      position: absolute;
      left: 8px;
      top: 8px;

      span {
        cursor: pointer;
        display: inline-block;
        width: 80px;
        height: 28px;
        bottom: 1px solid #333;
        background-color: #000;
        color: hsl(64, 93%, 50%);
        font-size: 12px;
        line-height: 25px;
        font-weight: 700;
        border: 1px solid #ccc;
      }
      .fengmian {
        border-radius: 6px 0 0 6px;
        border-right: 1px solid #ccc;
      }

      .geci {
        border-radius: 0 6px 6px 0;
      }
    }
    .singwordface {
      background-color: #333;
      position: absolute;
z-index: 777;
      left: 75%;
      width: 600px;
      overflow-y: scroll;
      height: 100%;
      transform: translate(-50%, 0);
      .singword-item {
        color: #eee;
        line-height: 20px;
        font-size: 14px;
      }
      .singword-item:nth-child(1) {
        margin-top: 40px;
      }
    }
    .fengmianface {
      position: absolute;
      img:nth-child(1) {
        left: 200px;
        position: absolute;
        z-index: 8;
        transform: rotate(-25deg);
        transform-origin: 12px 12px;
        transition: all 2s;
      }
      .playing {
        transform: rotate(0deg) !important;
      }
      img:nth-child(2) {
        position: absolute;

        left: 100px;
        top: 100px;
        z-index: 7;
      }

      .autorotate {
        animation-name: running;
        animation-duration: 5s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }

      img:nth-child(3) {
        top: 156px;
        left: 156px;
        position: absolute;
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
    }
  }

  .music-content-right {
    width: 200px;
    height: 480px;
    overflow-y: scroll;
    h1 {
      text-indent: 12px;
      text-align: left;
      font-size: 18px;
      font-weight: 500;
      height: 30px;
      line-height: 30px;
    }

    .comment-list {
      .comment-list-item {
        display: flex;

        .list-item-left {
          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }

        .list-item-right {
          padding: 5px;
          .item-right-top {
            font-size: 12px;
            text-align: left;
            .likecount {
              position: relative;
              float: right;
           
            }
            .likecount::before {
              position: absolute;
              content: "";
              width: 27px;
              height: 28px;
              left: -21px;
              top: -8px;
              background: url("../assets/zan.png");
              background-size: 100% 100%;
            }
          }

          .item-right-buttom {
            color: #fff;
            font-size: 12px;
            text-indent: 12px;
            text-align: left;
          }
          .item-right-time {
            margin-top: 5px;
            color: #222;
            font-size: 12px;

            text-align: left;
          }
        }
      }
    }
  }
}

@keyframes running {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>