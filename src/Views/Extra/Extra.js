import React from "react";
import {NavLink} from 'react-router-dom';
import NavBar from "../Modules/NavBar/NavBar"
class Extra extends React.Component {
  constructor() {
    super(...arguments);
    this.state = { visible: false };
  }
  render() {
    return (
      <div className="ExtraContainer">
        <NavBar
          end={<NavLink to="/">返回Title</NavLink>}
          brand={[<span style={{ fontSize: "2rem" }}>特典 Extra</span>]}
        >
          <a href="http://www.baidu.com">臭烔</a>
          <a href="http://www.baidu.com">屁明</a>
        </NavBar>

        
      </div>
    );
  }
}

export default Extra;