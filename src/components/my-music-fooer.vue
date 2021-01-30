<!--  -->
<template>
  <div class="music-footer">
    <button class="sj" @click="freeplay">随机播放</button>
    <button class="danqu" @click="sangleplay">单曲循环</button>
    <audio
      :src="sjsongUrl || sendsong"
      @pause="pausekey"
      @play="playkey"
      @ended="playtype"
      controls="controls"
      autoplay="autoplay"
      loop="loop"
    ></audio>
    <!-- loop='loop' -->
    <!-- -->
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    sendsong: {
      type: String,
      default: function () {
        return "";
      },
    },
    songidlist: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    //这里存放数据
    return {
      sjsongUrl: "",
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    freeplay() {
      alert("随机播放后将不能再选择歌曲播放");
      const audio = document.querySelector("audio");
      audio.removeAttribute("loop");
    },
    sangleplay() {
      alert("切换到单曲循环");
      this.sjsongUrl = "";
      const audio = document.querySelector("audio");

      audio.setAttribute("loop", "loop");
    },
    pausekey() {
      this.$emit("pausekey", false);
    },
    playkey() {
      this.$emit("playkey", true);
    },
    playtype() {
      let songidlist = this.songidlist;
      let randnum = parseInt(Math.random() * songidlist.length);
      this.$http
        .get("song/url", {
          params: {
            id: songidlist[randnum],
          },
        })
        .then((res) => {
          let sjsongUrl = res.data.data[0].url;
          if (sjsongUrl == null) {
            this.sjsongUrl =
              "http://m7.music.126.net/20210128202435/93c614d78532025d4b9895c767bb0e92/ymusic/5d63/5150/0851/5f226aac018cafc2cb248f7d28fbd5b4.mp3";
          } else {this.sjsongUrl = sjsongUrl;}
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
.music-footer {
  height: 100%;
  audio {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  button {
    position: absolute;

    border: none;
    width: 60px;
    height: 28px;
    font-size: 12px;
    outline: none;

    line-height: 28px;
    border-radius: 4px;
  }
  .sj {
    top: 27px;
    left: 449px;
    color: #fff;
    background-color: pink;
  }
  .danqu {
    top: 27px;
    left: 520px;
    color: red;
    background-color: yellowgreen;
  }
}
</style>