import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import NavHeader from '../../components/NavHeader/index'
import { API } from '../../utils/api'
//轻提示
import { Toast } from 'antd-mobile'
//引入表单处理的高阶组件
import { withFormik, Form, Field, ErrorMessage } from 'formik'
//引入表单验证yup包
import * as Yup from 'yup'
import './index.css'


export default function Login() {
    //   const [username, setUsername] = useState({})
    //   const [password, setPassword] = useState({})

    //   async function handleSubmit(e) {
    //     e.preventDefault()
    //     console.log(`username:${username.username}, password:${password.password}`)
    //     //发送请求
    //     const res = await API.post('user/login', {
    //       username: username.username,
    //       password: password.password
    //     })
    //     const { body, description, status } = res.data
    //     console.log(props)
    //     if (status === 200) {
    //       //登录成功
    //       localStorage.setItem('hkzf_token', body.token)
    //     } else {
    //       //登录失败
    //       Toast.show({
    //         content: description,
    //         maskClickable: false,
    //         duration: 2000,
    //       })
    //     }
    //   }
    //   function getUsername(e) {
    //     setUsername({ username: e.target.value })
    //   }
    //   function getPassword(e) {
    //     setPassword({ password: e.target.value })
    //   }
    // const { handleSubmit, handleChange, errors, touched, handleBlur } = props
    return (
        <>
            {/*顶部导航栏  */}
            <NavHeader>
                账号登录
            </NavHeader>
            {/* 表单 */}
            <Form className='login-form'>
                <Field
                    className='input'
                    type="text"
                    name='username'
                    // value={values.username}
                    placeholder='请输入账号'
                    // onChange={handleChange}
                    // 失去焦点事件
                    // onBlur={handleBlur} 
                    />
                {/* 有错误信息同时失去焦点时进行提示 */}
                {/* {errors.username && touched.username && <div className='prompt'>{errors.username}</div>} */}
                <ErrorMessage name='username' className='prompt' component='div'/>
                <Field
                    className='input'
                    type='password'
                    name='password'
                    // value={values.password}
                    placeholder='请输入密码'
                    // onChange={handleChange}
                    // onBlur={handleBlur} 
                    />
                {/* {errors.password && touched.password && <div className='prompt'>{errors.password}</div>} */}
                <ErrorMessage name='password' className='prompt' component='div'/>
                <button className='button' type='submit'>
                    登  录
                </button>
            </Form>
            <div className='go-register'>
                <Link to='/register'>
                    还没有账号，前去注册~
                </Link>
                <Outlet />
            </div>
        </>
    )
}
//此处返回的是高阶组件包装后的组件
Login = withFormik({
    //提供状态
    mapPropsToValues: () => ({ username: '', password: '' }),
    handleSubmit: async (values) => {
        const { username, password } = values
        console.log(username, password)
        //发送请求
        const res = await API.post('user/login', {
            username,
            password
        })
        const { body, description, status } = res.data
        if (status === 200) {
            //登录成功
            localStorage.setItem('hkzf_token', body.token)
            //返回上一页
            window.history.back()
        } else {
            //登录失败
            Toast.show({
                content: description,
                maskClickable: false,
                duration: 2000,
            })
        }
    },
    // 创建yup的校验规则
    // shape:校验规则的样式
    validationSchema: Yup.object().shape({
        username: Yup.string().required('用户名是必填项').matches(/^\w{5,8}$/, '用户名长度为5到8位，只能出现数字、字母、下划线'),
        password: Yup.string().required('密码是必填项').matches(/^[A-z]\w{4,11}$/, '密码必须是5-12位，由数字，字母，下划线组成,以字母开头'),
    })
})(Login)

