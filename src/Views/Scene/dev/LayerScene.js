import React from "react";
import ReactDOM from "react-dom";
//2个array，Background和Foreground,2个数，需要生成多少个Background和Foreground.
function FrameworkBuilder(frameName, num) {
  let result = [];
  for (let i = 0; i < num; ++i) {
    result.push(<div key={frameName + i} className={`${frameName}-${i}`} />);
  }
  return result;
}
function BuildRenderElement(ElementObj) {
  if (ElementObj.custom) {
    if (ElementObj.children) {
      if (ElementObj.children instanceof Object) {
        let children = BuildRenderElement(ElementObj.children);
        return React.createElement(ElementObj.type, ElementObj.props, children);
      } else {
        return React.createElement(
          ElementObj.type,
          ElementObj.props,
          ElementObj.children
        );
      }
    }
    return React.createElement(ElementObj.type, ElementObj.props);
  }
  return ElementObj;
}

function RenderChildrenElements(BGChildArr, FGChildArr) {
  /**
   * 预期的元素结构
   * {
   *    ElementObj:{
   *    },
   *     Layer:1
   * }
   */
  if (BGChildArr) {
    for (let i = 0; i < BGChildArr.length; ++i) {
      ReactDOM.render(
        BuildRenderElement(BGChildArr[i].ElementObj),
        document.getElementsByClassName(`Background-${BGChildArr[i].Layer}`)[0]
      );
    }
  }
  if (FGChildArr) {
    for (let i = 0; i < FGChildArr.length; ++i) {
      ReactDOM.render(
        BuildRenderElement(FGChildArr[i].ElementObj),
        document.getElementsByClassName(`Foreground-${FGChildArr[i].Layer}`)[0]
      );
    }
  }
}
// let TestRenderBG = [
//   { ElementObj: <p>测试样例</p>, Layer: 0 },
//   { ElementObj: <a href="http://www.baidu.com">点击前往百度</a>, Layer: 1 },
//   {
//     ElementObj: {
//       type: "p",
//       props: {
//         className: "TextP"
//       },
//       children: "测试p",
//       custom: true
//     },
//     Layer: 1
//   },
//   {
//     ElementObj: {
//       type: "div",
//       props: {
//         className: "TextP"
//       },
//       children: {
//         type: "p",
//         props: {
//           className: "TestP2",
//           children: "测试的Relax"
//         },
//         custom: true
//       },
//       custom: true
//     },
//     Layer: 2
//   }
// ];
class LayerScene extends React.Component {
  constructor() {
    super(...arguments);
    this.BackgroundGenerator = FrameworkBuilder("Background", 3);
    this.ForegroundGenerator = FrameworkBuilder("Foreground", 1);
  }
  componentDidMount() {
    RenderChildrenElements(this.props.Background,this.props.Foreground);
  }
  render() {
    return (
      <div className="SceneContainer">
        {this.BackgroundGenerator.map(it => it, this)}
        {this.ForegroundGenerator.map(it => it, this)}
      </div>
    );
  }
}

export default LayerScene;
