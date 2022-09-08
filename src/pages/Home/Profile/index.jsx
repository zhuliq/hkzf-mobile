import React, { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { hasToken, removeToken, getToken } from '../../../utils/token'
import { API } from '../../../utils/api'
import { Modal } from 'antd-mobile'
import './index.css'
export default function Profile() {
  //初始化isLogin,userInfo状态
  const [isLogin, setISLogin] = useState(hasToken())
  const [userInfo, setUserInfo] = useState('游客')

  useEffect(() => {
    //判断是否登录，如果登录发送请求
    if (isLogin) {
      getUserInfo()
    }
  }, [])

  async function getUserInfo() {
    const res = await API.get('/user', {
      headers: {
        authorization: getToken()
      }
    })
    if (res.status === 200) {
      setUserInfo(res.data.body.nickname)
    } else if (res.status === 400) {
      //token无效
      setISLogin(false)
    }
  }
  //退出登录
  async function logout(){
    const result = await Modal.confirm({
      content: '确认退出登录吗？',
      confirmText:'取消',
      cancelText:'确认',
      bodyStyle:{width:'450px', display:'flex'},
      onCancel:async()=>{
        //发送请求
        await API.post('/user/logout')
        //删除token
        removeToken()
        //重置状态
        setISLogin(false)
        setUserInfo('游客')
      }
    })  }
  return (
    <>
      <div className='userinfo'>
        {userInfo}
      </div>

      {isLogin ? (
        <>
          <div className='go-login' onClick={logout}>
              退 出
          </div>
        </>
      ) : (
        <>
          <div className='go-login'>
            <Link to='/login' >
              去登录
            </Link>
            <Outlet />
          </div>
        </>
      )}

    </>
  )
}
