//除了主要部件之外，这个插件负责显示特殊效果
import React from 'react';
import * as CustomViewComponent from '../../AdditionalModule/Views/index';
function BuildRenderElement(ElementObj) {
    let Type = CustomViewComponent[ElementObj.type]||ElementObj.type;
    if (ElementObj.children) {
        if (ElementObj.children instanceof Object) {
            let children = BuildRenderElement(ElementObj.children);
            return React.createElement(Type, ElementObj.props, children);
        } else {
            return React.createElement(
                Type,
                ElementObj.props,
                ElementObj.children
            );
        }
    }
    return React.createElement(Type, ElementObj.props);
}
//此函数可以循环展开用于经典React.createElement的Object，递归渲染出HTML元素
//预期接受一个数组，里面全部都是React like的元素
class CustomView extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { RenderElement: [] };
        this.BuildRenderArray = this.BuildRenderArray.bind(this);
    }
    componentDidMount() {
        this.props.custom&&this.setState({ RenderElement: this.BuildRenderArray(this.props.custom) });
    }
    BuildRenderArray(BuildSource) {
        let ElementArray = [];
        BuildSource.forEach(e => {
            ElementArray.push(BuildRenderElement(e));
        });
        return ElementArray;
    }
    componentWillReceiveProps(nextProps) {
        this.props.custom&&this.setState({ RenderElement: this.BuildRenderArray(nextProps.custom) });
    }
    render() {
        return (<div className="CustomViewComponentContainer" style={{position:"absolute",zIndex:this.props.zIndex}}>
            {
                this.props.custom?this.state.RenderElement.map(i => i):null
            }
        </div>);
    }
}
export default CustomView;