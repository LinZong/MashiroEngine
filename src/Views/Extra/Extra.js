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
          end={<NavLink to="/">返回Title</NavLink>}
          brand={[<span style={{ fontSize: "2rem" }}>特典 Extra</span>]}
        >
          <a href="http://www.baidu.com">臭烔</a>
          <a href="http://www.baidu.com">屁明</a>
          <a href="http://www.baidu.com">健哥哥</a>
        </NavBar>
        <ExtraContent />
      </div>
    );
  }
}

export default Extra;