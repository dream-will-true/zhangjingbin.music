<!--  -->

<template>
  <div class="music-content">
    <div class="music-content-left">
      <div class="content-left-list">
        <div class="list-box">
          <div class="left-list-item" v-for="item in starlist ||songs" :key="item.id">
            <div class="list-item-left"></div>
            <div class="list-item-mid" @click="getsong(item.id)">
              {{ item.name }}
            </div>
            <div
              :class="[
                'list-item-right',
                { hidden: item.mvid == 0 ? true : false },
              ]"
              @click="lookmv(item.mvid)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="music-content-mid">
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
            </div>
            <div class="item-right-buttom">
              {{ comment.content }}
            </div>
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
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
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
    getsong(id) {
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
          },
        })
        .then((res) => {
          this.hotcommment = res.data.hotComments;
        });
      // 请求图片

      this.$http
        .get("song/detail", {
          params: {
            ids: id,
          },
        })
        .then((res) => {
          console.log(res)
          this.picurl = res.data.songs[0].al.picUrl;
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
          overflow: hidden;
          text-overflow: ellipsis;
          height: 28px;
          line-height: 28px;
          width: 150px;
          color: #fff;
          text-align: center;
          cursor: pointer;
        }
        .hidden {
          opacity: 0;
        }

        .list-item-right {
          width: 30px;
          height: 20px;
          background: url("../assets/table.png") left -45px;
        }
      }
    }
  }

  .music-content-mid {
    width: 400px;
    border-right: 1px dotted var(--themeColor);
    height: 480px;
    position: relative;
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
          }

          .item-right-buttom {
            color: #fff;
            font-size: 12px;
            text-indent: 12px;
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