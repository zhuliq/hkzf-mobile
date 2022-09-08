import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import CityList from "../pages/CityList";
import HomePage from '../pages/Home/HomePage/index'
import HouseList from '../pages/Home/HouseList/index'
import News from '../pages/Home/News/index'
import Profile from '../pages/Home/Profile/index'
import Map from "../pages/Map";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default [
    {
        path:'/home',
        element:<Home/>,
        children:[
            {
                path:'homepage',
                element:<HomePage/>,   
            },
            {
                path:'houselist',
                element:<HouseList/>,   
            },
            {
                path:'news',
                element:<News/>,   
            },
            {
                path:'profile',
                element:<Profile/>,   
            },
            {
                path:'',
                element:<HomePage/>
            }

        ]
    },
    {
        path:'/citylist',
        element:<CityList/>
    },
    {
        path:'/map',
        element:<Map/>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/',
        element:<Navigate to='/home'/>
    }
]