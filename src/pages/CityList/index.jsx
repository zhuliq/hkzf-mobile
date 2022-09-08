import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SideBar, Toast } from 'antd-mobile'
//引入顶部导航栏组件
import NavHeader from '../../components/NavHeader'
//引入封装城市定位的函数
import { getCurCity } from '../../utils/index'
// import axios from 'axios'
import {API} from '../../utils/api'
//导入List组件,autoaizer高阶组件
import { List, AutoSizer } from 'react-virtualized'
import './index.css'

export default function CityList() {
  const navigate = useNavigate()
  //设置groupObj的状态为空对象
  const [groupObj, setGroupObj] = useState({})  //格式[A:[{}, {}], ...]
  //设置indexArr的状态为空数组
  const [indexArr, setIndexArr] = useState([])
  //设置activeKey的状态为0,即SiderBar组件当前激活的item的key默认为0
  const [activeKey, setActiveKey] = useState('0')
  //创建ref对象
  const cityListComponent = useRef()
  //索引高度
  const TITLE_HEIGHT = 100
  //每个城市名称的高度
  const NAME_HEIGHT = 100
  //有房源的城市
  const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

  // 生命周期钩子,挂载完毕后调用函数
  useEffect(() => {
    getCityList()
  }, [])

  //处理城市数据
  function formatCityData(data) {
    const groupObj = {}
    //处理groupObj
    //遍历数组获取首字母，并判断groupObj中是否包含该首字母的数据
    data.forEach(item => {
      //获取首字母并大写
      const firstWord = item.short.slice(0, 1).toUpperCase()
      //判断
      if (groupObj[firstWord]) {
        //有就push对象
        groupObj[firstWord].push(item)
      } else {
        //没有就写入数组
        groupObj[firstWord] = [item]
      }
    })
    //处理indexArr,返回值是新数组
    const indexArr = Object.keys(groupObj).sort()
    //返回值
    return {
      groupObj,
      indexArr
    }
  }

  //获取城市列表数据的方法
  async function getCityList() {
    //获取城市数据
    const res = await API.get('/area/city', {
      params: {
        level: 1
      }
    })
    //获取groupObj和indexArr
    const { groupObj, indexArr } = formatCityData(res.data.body)
    //获取热门城市数据
    const hotRes = await API.get('/area/hot')
    //向groupObj中写入键为hot的数据
    groupObj['hot'] = hotRes.data.body
    //将索引增加到indexArr开头
    indexArr.unshift('hot')
    //获取当前城市数据
    const curCity = await getCurCity()
    //向groupObj中写入键为#的数据
    groupObj['#'] = [curCity]
    //将索引增加到indexArr开头
    indexArr.unshift('#')
    //更新状态
    setGroupObj(groupObj)
    setIndexArr(indexArr)
  }

  //更改索引名称的方法
  function formatIndex(letter) {
    switch (letter) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'
      default:
        return letter
    }
  }

  //动态设置每行高度
  function getRowHeight({ index }) {
    return TITLE_HEIGHT + groupObj[indexArr[index]].length * NAME_HEIGHT
  }
  //渲染每一行数据的渲染函数
  //函数的返回值就表示最终渲染在页面中的内容
  function rowRenderer({
    key, // Unique key within array of rows
    index, // 索引
    // isScrolling, // 当前项是否在滚动中，布尔值
    // isVisible, // 当前项在List中是否可见，布尔值
    style, // 指定每一行的位置，每一行数据要增加该样式
  }) {
    //获取每一行的字母索引
    const letter = indexArr[index]
    return (
      <div key={key} style={style} className='listItem'>
        <div className="title" style={{
          height: TITLE_HEIGHT + 'px',
          lineHeight: TITLE_HEIGHT + 'px',
          fontSize: '30px',
          paddingLeft: '25px',
          color: 'rgb(171, 168, 168)',
        }}>{formatIndex(letter)}</div>
        {/* 遍历对象中的数组 */}
        {
          groupObj[letter].map(item => <div className='name' key={item.value}
            //绑定点击事件，点击切换城市
            onClick={() => {
              changeCity(item)
            }}
            style={{
              height: NAME_HEIGHT + 'px',
              lineHeight: NAME_HEIGHT + 'px',
              fontSize: '37px',
              paddingLeft: '25px',
              borderBottom: '1px solid rgba(189, 189, 189, 0.54)',
              fontWeight: 545
            }}>{item.label}</div>)
        }
      </div>
    );
  }
  //用于获取List组件中渲染行的信息
  function onRowsRendered({ startIndex }) {
    //更新active,滚动列表时同步改变sidebar高亮的key值
    if (activeKey !== startIndex) {
      setActiveKey(startIndex + '')
    }
  }
  //切换城市函数
  function changeCity({ label, value }) {
    //判断是否有房源，有就存到本地并返回上一级，没有就弹窗
    if (HOUSE_CITY.includes(label)) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      navigate(-1)
    } else {
      //轻提示
      Toast.show({
        content: '该城市暂无房源数据',
        maskClickable: true,
        duration: 1500,
      })
    }
  }

  return (
    <div className='cityList'>
      {/* 顶部导航栏 */}
      <NavHeader>
        城市选择
      </NavHeader>
      {/* 城市列表 */}
      {/* 这边减101因为是100的话页面会出现滚动条 */}
      <div className="list" style={{ height: document.body.clientHeight - 101 + 'px' }}>
        <AutoSizer>
          {
            ({ height, width }) => (
              <List
                ref={cityListComponent}
                width={width}
                height={height}
                // 行数
                rowCount={indexArr.length}
                rowHeight={getRowHeight}
                //渲染每一行数据
                rowRenderer={rowRenderer}
                onRowsRendered={onRowsRendered}
                //控制滚动到行的对齐方式，start:将行对齐到列表顶部
                scrollToAlignment='start'
              />
            )
          }
        </AutoSizer>
      </div>
      {/* 侧边导航 */}
      <SideBar
        style={{ '--background-color': 'white' }}
        // 当前激活item的key
        activeKey={activeKey}
        onChange={(key) => {
          cityListComponent.current.scrollToRow(key)
        }}
      >
        {indexArr.map((item, index) => (
          // 遍历时将hot改为热
          <SideBar.Item
            key={index}
            title={item === 'hot' ? '热' : item} />
        ))}
      </SideBar>
    </div>
  )
}
