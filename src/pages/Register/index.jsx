import React from 'react'
import NavHeader from '../../components/NavHeader'
import { Form, Field, ErrorMessage, withFormik } from 'formik'
import * as Yup from 'yup'
import { Toast } from 'antd-mobile'
import { API } from '../../utils/api'
import './index.css'

export default function Register(props) {
    // console.log(props)
    return (
        <>
            {/* 顶部导航栏 */}
            <NavHeader>
                注册账号
            </NavHeader>
            {/* 表单 */}
            <Form className='register-form'>
                <Field className='reg-input'
                    type='text'
                    name='username'
                    placeholder='请输入注册用户名' />
                <ErrorMessage name='username' component='div' className='reg-prompt' />
                <Field className='reg-input'
                    type='password'
                    name='password'
                    placeholder='请输入注册密码' />
                <ErrorMessage name='password' component='div' className='reg-prompt' />
                <Field className='reg-input'
                    type='password'
                    name='againPassword'
                    placeholder='请确认输入注册密码' />
                <ErrorMessage name='againPassword' component='div' className='reg-prompt' />
                <button className='reg-button' type='submit'>
                        注册
                </button>
            </Form>
        </>
    )
}
// 表单验证
Register = withFormik({
    mapPropsToValues: () => ({ username: '', password: '', againPassword: '' }),
    handleSubmit: async (values) => {
        const { username, password, againPassword } = values
        if (password == againPassword) {
            //发注册请求
            const res = await API.post('/user/registered', {
                username,
                password
            })
            // console.log(res)

            const { body, description, status } = res.data
            if (status === 200) {
                localStorage.setItem('hkzf_token', body.toke)
                Toast.show({
                    content: '注册成功~ 请登录账号',
                    duration: 2000,
                })
                window.history.back()
            } else {
                Toast.show({
                    content: description,
                    maskClickable: false,
                    duration: 2000,
                })
            }
        } else {
            //登陆失败
            Toast.show({
                content: '两次密码输入不一致',
                maskClickable: false,
                duration: 2000,
            })
        }
    },
    //创建yup的校验规则
    validationSchema: Yup.object().shape({
        username: Yup.string().required('用户名是必填项').matches(/^\w{5,8}$/, '用户名长度为5到8位，只能出现数字、字母、下划线'),
        password: Yup.string().required('密码是必填项').matches(/^[A-z]\w{4,11}$/, '密码必须是5-12位，由数字，字母，下划线组成,以字母开头'),
        againPassword: Yup.string().required('密码是必填项').matches(/^[A-z]\w{4,11}$/, '密码必须是5-12位，由数字，字母，下划线组成,以字母开头'),
    })

})(Register)

