//封装顶部导航栏NavHeader组件
import React from 'react'
import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import './index.css'

export default function NavHeader({ children, onBack }) {   //从props中解构出children，可以获取组件的开始标签和结束标签之间的内容
    const navigate = useNavigate()
    //默认点击行为
    const defaultHandler = () => {
        navigate(-1)
    }

    return (
        <NavBar
            // 返回上一级
            onBack={onBack || defaultHandler}  //实现自定义点击事件
            style={{
                '--height': '100px',
                '--border-bottom': '1px #eee solid',
            }}>
            {children}
        </NavBar>

    )
}
