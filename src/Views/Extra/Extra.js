import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import NavBar from "../Modules/NavBar/NavBar"
import ExtraContent from './ExtraContent';
import "./Extra.less";
class Extra extends React.Component {
  constructor() {
    super(...arguments);
    this.CharacterList = window.electron.remote.getGlobal("Character").CharacterList;
  }
  render() {
    return (
      <div className="ExtraContainer" style={{ backgroundImage: "url('file:///../../res/Resources/Theme/UIResources/Framework/44975852_p0.jpg')" }}>
        <NavBar
          end={<NavLink to="/" >返回标题</NavLink>}
          brand={[<span style={{ fontSize: "2rem" }}>特典 Extra</span>]}
        >
          {
            this.CharacterList.map((it, idx) => {
              return <NavLink key={idx} to={`/extra/${idx}`}>{it.DisplayName}</NavLink>
            })
          }
        </NavBar>
        <Switch>
          <Route path="/extra/:character" component={ExtraContent} />
          <Redirect to={`/extra/0`} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Extra);