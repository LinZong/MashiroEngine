import React from "react";
import classnamez from "classnames";
import "./NavBar.less";
class NavBar extends React.Component {
  constructor() {
    super(...arguments);
    this.handleSelectedEffects = this.handleSelectedEffects.bind(this);
    this.state = { selected: this.props.defaultSelectedIndex };
    //defaultSelectedIndex is an object.
  }

  handleSelectedEffects(clickedIndex) {
    this.setState({ selected: clickedIndex });
  }
  checkSelected(childIdx) {
    return childIdx === this.state.selected;
  }
  render() {
    const props = this.props;
    return (
      <nav className="NavBar">
        <div className="NavBarBrand">
          {props.brand &&
            (props.brand instanceof Array ? (
              props.brand.map((it, idx) => (
                <div key={"brand" + idx} className={classnamez("NavBarItem")}>
                  {it}
                </div>
              ))
            ) : (
              <div key={"brand" + 0} className={classnamez("NavBarItem")}>
                {props.brand}
              </div>
            ))}
        </div>
        <div className="NavBarMenu">
          {props.children instanceof Array ? (
            props.children.map((it, idx) => (
              <div
                onClick={() => this.handleSelectedEffects(it.props.index)}
                key={"Menu" + idx}
                className={classnamez("NavBarItem", {
                  NavBarItemSelected: this.checkSelected(it.props.index)
                })}
              >
                {it}
              </div>
            ))
          ) : (
            <div
              key={"Menu" + 0}
              onClick={() => this.handleSelectedEffects(it.index)}
              className={classnamez("NavBarItem", {
                NavBarItemSelected: this.checkSelected(it.index)
              })}
            >
              {props.children}
            </div>
          )}
        </div>
        <div className="NavBarMenuEnd">
          {props.end instanceof Array ? (
            props.end.map((it, idx) => (
              <div key={"End" + idx} className="NavBarItem">
                {it}
              </div>
            ))
          ) : (
            <div key={"End" + 0} className="NavBarItem">
              {props.end}
            </div>
          )}
        </div>
      </nav>
    );
  }
}

export default NavBar;
