import React from "react";
//react18新特性
import {createRoot} from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './assets/fonts/iconfont.css'
import './index.css'
//导入react-virtualized组件的样式
import 'react-virtualized/styles.css'
//注意：我们自己写的全局样式需要放在组件库样式后面导入，这样样式才会生效，因为后面的样式会覆盖前面同名的样式
import App from './App'


createRoot(document.getElementById('root')).render(
<BrowserRouter>
    <App/>
</BrowserRouter>
)
