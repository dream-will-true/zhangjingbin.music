<!--  -->
<template>
<div class='music-header'>
    <div class="music-header-left">
    越来越牛逼的音乐盒
    </div>
    <div class="music-header-right">
        <input type="text" @keydown.enter='handlerSave'
      placeholder="请输入歌曲名字或者关键字"   v-model="inputVal" name="" id="">
      <button @click="handlerSave">Go</button>
    </div>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
    inputVal:''

};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  async  handlerSave(){
        if(!this.inputVal){
            return false
        }
        // console.log('发送请求')
  /*       this.$http.get('https://apimusic.linweiqin.com/search',{
            params:{
                keywords:this.inputVal
            },
        }).then(res=>{
            console.log(res)
        }) */

        //  async 异步变同步代码
      let res=await  this.$http.get('https://apimusic.linweiqin.com/search',{
            params:{
                keywords:this.inputVal
            },
        })

         this.$emit('getlist',res.data.result.songs)
          this.$emit('clearstar',0)



    }

},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less"  scoped>
.music-header {
    height: 60px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 5px;
    align-items: center;
  .music-header-left {
      color: #fff;

  }

  .music-header-right {
    input {
        outline: none;
        width: 300px;
        height: 30px;
        border: 0;
        border-radius: 20px;
        text-indent: 15px;


    }
    button{
        border: none;
        outline: none;
        margin-left: 10px;
        margin-right: 10px;
        border-radius: 30px;
        width: 70px;
        height: 30px;
        font-size: 16px;
        color: #fff;
        background-color: #feae1b;
    }
  }
}
</style>