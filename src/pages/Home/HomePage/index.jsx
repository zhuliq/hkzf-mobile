import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Space, Swiper, SearchBar } from 'antd-mobile'
import { getCurCity } from '../../../utils'
// import axios from 'axios'
import { API } from '../../../utils/api'
//导入开发环境变量
import { BASE_URL } from '../../../utils/url'
//引入导航菜单图
import navImg1 from '../../../assets/images/nav-1.png'
import navImg2 from '../../../assets/images/nav-2.png'
import navImg3 from '../../../assets/images/nav-3.png'
import navImg4 from '../../../assets/images/nav-4.png'

import styles from './index.css'

export default function HomePage() {
  //设置imgs的状态为空数组
  const [imgs, setImgs] = useState([])
  //设置租房小组数据状态为空数组
  const [groups, setGroups] = useState([])
  //设置最新资讯数据状态为空数组
  const [news, setNews] = useState([])
  //设置城市为初始字符串
  const [myCity, setMyCity] = useState('上海')

  //导航菜单数据
  const navs = [
    {
      key: 0,
      title: '整租',
      img: navImg1,
    },
    {
      key: 1,
      title: '合租',
      img: navImg2,
    },
    {
      key: 2,
      title: '地图找图',
      img: navImg3,
    },
    {
      key: 3,
      title: '去出租',
      img: navImg4,
    },
  ]

  //获取轮播图数据的方法
  async function getWipers() {
    const res = await API.get('/home/swiper')
    //更新状态
    setImgs(res.data.body)
  }
  //获取租房小组数据的方法
  async function getGroups() {
    const res = await API.get('/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    setGroups(res.data.body)
  }
  //获取最新资讯数据的方法
  async function getNews() {
    const res = await API.get('/home/news', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    setNews(res.data.body)
  }
  //获取当前城市的方法
  async function getCity() {
    //通过封装百度地图api的函数获取所在城市
    const curCity = await getCurCity()
    //更新状态
    setMyCity(curCity)
  }

  //生命周期钩子,挂载完毕后调用函数
  useEffect(() => {
    getWipers()
    getGroups()
    getNews()
    getCity()
  }, [])

  //遍历imgs数组
  const imgsItems = imgs.map(item => (
    <Swiper.Item key={item.id}>
      <div
        className={styles.content}
        style={{ height: '554px' }}
      >
        <a href="https://mobile.ant.design/zh/components/swiper">
          <img src={BASE_URL + item.imgSrc} />
        </a>
      </div>
    </Swiper.Item>
  ))
  //遍历导航栏菜单数据
  const navsItems = navs.map(item => {
    return (
      <div className="navMenuItem" key={item.key}>
        <img src={item.img} />
        <span>{item.title}</span>
      </div>
    )
  })
  //遍历租房小组数据
  const groupsItems = groups.map(item => {
    return (
      <div className="groupsItem" key={item.id}>
        <div className="groupsItemWord">
          <span className="groupsItemTitle">{item.title}</span>
          <span className="groupsItemDesc">{item.desc}</span>
        </div>
        <div className="groupsItemImg">
          <img src={`http://localhost:8080${item.imgSrc}`} />
        </div>
      </div>
    )
  })
  //遍历最新资数据
  const newsItems = news.map(item => {
    return (
      <div className="newItem" key={item.id}>
        <div className="newItemImg">
          <img src={BASE_URL + item.imgSrc} />
        </div>
        <div className="newItemWord">
          <div className="newItemTitle">{item.title}</div>
          <div className="newItemWordBottom">
            <span className="newItemWordFrom">{item.from}</span>
            <span className="newItemWordDate">{item.date}</span>
          </div>
        </div>
      </div>
    )
  })

  return (
    <>
      {/* 轮播图 */}
      <Space direction='vertical' block>
        <Swiper
          defaultIndex={0}
          autoplay
          autoplayInterval={4500}
          loop
        >
          {imgsItems}
        </Swiper>
      </Space>

      {/* 导航菜单 */}
      <div className='navMenu'>
        {navsItems}
      </div>

      {/* 租房小组 */}
      <div className="groupWrap1">
        <div className="groupsTitle">
          租房小组
          <span className="groupsTitleMore">更多</span>
        </div>
      </div>
      <div className="groupWrap2">
        <div className="groups">
          {groupsItems}
        </div>
      </div>

      {/* 最新资讯 */}
      <div className="new">
        <div className="newTitle">
          最新资讯
        </div>
        <div className="news">
          {newsItems}
        </div>
      </div>

      {/* 顶部导航 */}
      <div className="navTopWrap">
        <div className="navTop">
          <div className="location">
            <Link to='/citylist'>
              <span>{myCity.label}</span>
              <i className='iconfont icon-arrow-down'></i>
            </Link>
          </div>
          <SearchBar
            placeholder='请输入小区或地址'
            style={{
              '--background': '#ffffff',
              '--border-radius': '0',
              'width': '630px'
            }}
          />
          <div className="map">
            <Link to='/map' className="iconfont icon-map"></Link>
          </div>
        </div>
      </div>
      {/* 指定路由呈现位置 */}
      <Outlet />
    </>
  )
}
