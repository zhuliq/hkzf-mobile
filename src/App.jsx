import React from 'react'
//导入antd-mobile中想要导入的组件
// import { Button } from 'antd-mobile'
import {useRoutes} from 'react-router-dom'
//导入路由表
import routers from './routes/index'
import './index.css'

export default function App() {
    // useRouters里面要求是数组，对应多个Route，数组里面为多个对象，每个对象对应一个Route里面的属性
    //根据路由表生成对应的路由规则
  const element = useRoutes(routers)
  return (
    <div className='App'>
      {/* 注册路由 */}
      {element}
    </div>
  )
}
