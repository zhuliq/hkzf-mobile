import React from 'react'
import {Outlet, useNavigate, useLocation} from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {
  MessageOutline,
  UserOutline,
} from 'antd-mobile-icons'
import './index.css'

export default function Home() {
  //通过useNavigate实现编程式路由导航
  const navigate = useNavigate()
  const location = useLocation()
  // console.log(location.pathname)
  function setRouteActive (value){
    navigate(value)
  }
  //TabBar数据
  const tabs = [
    {
      key: '/home/homepage',
      title: '首页',
      icon: <i className='iconfont icon-iconindexnor adm-tab-bar-item-icon'/>,
    },
    {
      key: '/home/houselist',
      title: '找房',
      icon: <i className='iconfont icon-find adm-tab-bar-item-icon'/>,
    },
    {
      key: '/home/news',
      title: '资讯',
      icon:<MessageOutline style={{fontSize:'40px'}}/>,
    },
    {
      key: '/home/profile',
      title: '我的',
      icon: <UserOutline style={{fontSize:'40px'}}/>,
    },
  ]
  return (
    <div>
        {/* TabBar activeKey和item.key得对应,不然无法高亮*/}
        <TabBar onChange={value => setRouteActive(value)} activeKey={location.pathname}>
          {tabs.map(item => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </TabBar>
        <Outlet />

    </div>
  )
}
