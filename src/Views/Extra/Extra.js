import React from "react";
import {NavLink} from 'react-router-dom';
import NavBar from "../Modules/NavBar/NavBar"
import ExtraContent from './ExtraContent';
import "./Extra.less";
class Extra extends React.Component {
  render() {
    return (
      <div className="ExtraContainer">
        <NavBar
          end={<NavLink to="/" >返回标题</NavLink>}
          brand={[<span style={{ fontSize: "2rem" }}>特典 Extra</span>]}
        >
          <a href="http://www.baidu.com">测试角色1</a>
          <a href="http://www.baidu.com">测试角色2</a>
          <a href="http://www.baidu.com">测试角色3</a>
        </NavBar>
        <ExtraContent />
      </div>
    );
  }
}

export default Extra;