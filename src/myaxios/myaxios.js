// 创建一个axios实例
import axios from 'axios'
const instance= axios.create({
    baseURL:"https://apimusic.linweiqin.com/"
});
export default instance;