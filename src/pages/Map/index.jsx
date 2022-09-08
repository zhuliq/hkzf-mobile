import React from 'react'
import NavHeader from '../../components/NavHeader'
import { Toast } from 'antd-mobile'
// import axios from 'axios'
import { API } from '../../utils/api'

import './index.css'

// 解决脚手架中全局变量访问的问题
const BMapGL = window.BMapGL
//获取当前城市
const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class Map extends React.Component {
    //初始化状态
    state = { cityNum: value, zoom: 12, level: 1, houseList: [], showHouseList: false, isCloseAnimation:false }
    //生命周期钩子,挂载完毕后调用函数
    componentDidMount() {
        this.initMap()
        //进入地图先渲染一次覆盖物
        this.creatCircle(value, 13)
    }
    //状态更新调用
    componentDidUpdate(prevProps, prevState) {
        //当cityNum前后状态改变，进入判断
        if (this.state.cityNum !== prevState.cityNum) {
            switch (this.state.level) {
                case 2:
                    this.creatCircle(this.state.cityNum, 16)
                    break;
                case 3:
                    this.creatRect(this.state.cityNum)
                    break;
            }
        }
    }
    //初始化地图
    initMap() {
        // 创建地图实例
        const map = new BMapGL.Map('container')
        // 作用：能够在其他方法中通过 this 来获取到地图对象
        this.map = map
        //增加比例尺控件
        map.addControl(new BMapGL.ScaleControl());
        //增加缩放控件
        map.addControl(new BMapGL.ZoomControl());
        //开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true)
        //监听缩放，并更新状态
        map.addEventListener('zoomend', () => {
            let newZoom = this.map.getZoom()
            this.setState({ zoom: newZoom })
        })
        //创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, point => {
            if (point) {
                //设置地图展示级别
                this.map.centerAndZoom(point, this.state.zoom);
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
        //给地图绑定移动事件，移动隐藏房屋列表
        map.addEventListener('dragstart', () => {
            if (this.state.showHouseList) {
                //更新状态
                this.setState({ showHouseList: false, isCloseAnimation: true })
                // //通过ref获取元素
                // const { wrap } = this
                // //结束动画
                // wrap.style.animation = '0.8s ease-in-out 0s 1 reverse forwards running houseList'
            }
        })

    }
    //创建大区或镇覆盖物
    async creatCircle(value, nextZoom) {
        //增加loading效果
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
        })
        const res = await API.get(`/area/map?id=${value}`)
        const data = res.data.body
        data.forEach(item => {
            const { coord: { longitude, latitude }, count, label: areaName, value } = item
            const circlePoint = new BMapGL.Point(longitude, latitude)
            //自定义文本标注
            var opts = {
                position: circlePoint, // 指定文本标注所在的地理位置
                offset: new BMapGL.Size(-60, -60) // 设置文本偏移量
            };
            // 创建文本标注对象,设置setContent后，第一个参数设置的文本就失效了，直接清空即可
            var circleObj = new BMapGL.Label('', opts);
            //给对象增加一个唯一标识
            circleObj.id = value
            //设置房源覆盖物内容
            circleObj.setContent(`
                <div class='name'>${areaName}</div>
                <div class='number'>${count}套</div>
                `)
            // 自定义文本标注样式
            circleObj.setStyle({
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'white',
                fontWeight: '350',
                whiteSpace: 'nowrap',
                border: '0px',
                borderRadius: '50%',
                backgroundColor: 'rgba(11, 161, 94, 0.9)',
                padding: '0px',
                fontSize: '18px',
                height: '120px',
                width: '120px',
                fontFamily: '微软雅黑'
            });
            //增加单击事件
            circleObj.addEventListener('click', () => {
                //计数
                let i = this.state.level
                i++
                this.map.clearOverlays(circleObj)
                this.map.centerAndZoom(circlePoint, nextZoom);
                this.setState({ cityNum: value, level: i })
            })
            //取消loading效果            
            Toast.clear()
            //增加覆盖物
            this.map.addOverlay(circleObj);

        })
    }
    //创建小区覆盖物，房源列表
    async creatRect(value) {
        Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
        })
        const res = await API.get(`/area/map?id=${value}`)
        const data = res.data.body
        data.forEach(item => {
            const { coord: { longitude, latitude }, count, label: areaName, value } = item
            const circlePoint = new BMapGL.Point(longitude, latitude)
            //自定义文本标注
            var opts = {
                position: circlePoint, // 指定文本标注所在的地理位置
                offset: new BMapGL.Size(-60, -60) // 设置文本偏移量
            };
            // 创建文本标注对象,设置setContent后，第一个参数设置的文本就失效了，直接清空即可
            var circleObj = new BMapGL.Label('', opts);
            //给对象增加一个唯一标识
            circleObj.id = value
            //设置房源覆盖物内容
            circleObj.setContent(`
                <div class='name'>${areaName}</div>
                <div class='number'>${count}套</div>
                `)
            // 自定义文本标注样式
            circleObj.setStyle({
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'white',
                fontWeight: '350',
                whiteSpace: 'nowrap',
                border: '0px',
                borderRadius: '15%',
                backgroundColor: 'rgba(11, 161, 94, 0.9)',
                padding: '0px',
                fontSize: '18px',
                height: '70px',
                minWidth: '150px',
                fontFamily: '微软雅黑',
                padding: '0 5px',
            });
            //取消loading效果            
            Toast.clear()
            //增加覆盖物
            this.map.addOverlay(circleObj);

            //增加单击事件
            circleObj.addEventListener('click', async (event) => {
                Toast.show({
                    icon: 'loading',
                    content: '加载中…',
                    duration: 0,
                })
                const resHouseList = await API.get(`/houses?cityId=${circleObj.id}`)
                //更新状态
                this.setState({ houseList: resHouseList.data.body.list, showHouseList: true })
                //获取点击元素
                const target = event.target.domElement
                //将元素移到屏幕中央
                this.map.panBy(
                    (window.innerWidth / 2) - target.offsetLeft,
                    ((window.innerHeight - 100) / 4) - target.offsetTop
                )
                //取消loading效果            
                Toast.clear()

            })
        })
    }
    render() {
        //遍历房屋列表数据
        const houseListData = this.state.houseList.map((item) => {
            return (
                <div key={item.houseCode}>
                    <div className="houseList">
                        <div className="houseListItem-Left">
                            <img src={`http://localhost:8080${item.houseImg}`} />
                        </div>
                        <div className="houseListItem-Right">
                            <div className="houseListItem-Right-Title">{item.title}</div>
                            <div className="houseListItem-Right-Desc">{item.desc}</div>
                            <div className="houseListItem-Right-Tags">
                                {item.tags.map((tag, index) => {
                                    return (
                                        <div className={`tag tagStyle-${index}`} key={index}>
                                            {tag}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="houseListItem-Right-Price">
                                <p className='priceNum'>{item.price} </p>元/月
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            )
        })
        return (
            <>
                {/* 顶部导航栏 */}
                <NavHeader
                //自定义点击事件
                // onBack={() => { console.log('返回上一级') }}
                >
                    地图找房
                </NavHeader>
                {/* 地图容器 */}
                <div id="container"></div>
                {/* 房屋列表 */}
                <div className="houseList-Wrap" ref={c => { this.wrap = c }} style={{
                    // 样式判断，showHouseList为true增加列表出现动画，为false同时isCloseAnimation为true增加列表消失动画
                    animation: this.state.showHouseList ? 'houseList 0.8s ease-in-out forwards': 
                    this.state.isCloseAnimation ? 'closeHouseList 0.6s ease-in-out forwards' : ''
                }}>
                    <div className="houseListTitle">
                        <div className="houseListTitle-Left">房屋列表</div>
                        <div className="houseListTitle-Right">更多房源</div>
                    </div>
                    <div className="houseListContent">
                        {houseListData}
                    </div>
                </div>
            </>
        )
    }
}