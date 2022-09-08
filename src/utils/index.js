// import axios from "axios"
import { API } from "./api"
//封装获取城市定位的函数getCurCity
export function getCurCity() {
    //首先要判断本地存储中是否有城市数据
    const judgeLocal = JSON.parse(localStorage.getItem('hkzf_city'))
    //没有数据，通过百度地图api获取，存储到本地并返回城市数据
    if (!judgeLocal) {
        return new Promise((resolve, reject) => {
            //通过百度地图api获取所在城市
            const curCity = new window.BMapGL.LocalCity()
            curCity.get(async res => {
                try {
                    const result = await API.get(`/area/info?name=${res.name}`)
                    //存储到本地中
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    resolve(result.data.body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    } else {  //如果有数据，直接返回本地存储中的数据，因为上面返回值为promise对象，所以这边要一致
        //因为此处的promise没有失败，所以返回一个成功的promise即可
        // console.log(2)
        return Promise.resolve(judgeLocal)
    }
}
