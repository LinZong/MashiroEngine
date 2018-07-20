import React, { Component } from 'react';
import SceneView from './SceneView.css';
class Scene extends Component {
    constructor(props) {
        super(props);
        this.state = { className: 'SceneIn',style:{...SceneView,backgroundImage: null}};
        this.FadeAnimationController=this.FadeAnimationController.bind(this);
    }
    FadeAnimationController(event){
        if(event.animationName==="BackGroundFadeOut"&&event.type==="webkitAnimationEnd"){
            this.setState({ style: { ...SceneView, backgroundImage: null }});
        }
    }
    componentDidMount() {
        this.setState({ style: { ...SceneView, backgroundImage: this.props.BG }});
        window.addEventListener('webkitAnimationStart',this.FadeAnimationController);
        window.addEventListener('webkitAnimationEnd',this.FadeAnimationController);
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.style.backgroundImage === null) {
            this.setState({ style: { ...SceneView, backgroundImage: nextProps.BG },childStyle:{display:'inline'}});
        }
        else if (this.props.BG !== nextProps.BG) {
            this.setState({ className: 'SceneOut',childStyle:{display:'none'} });
            setTimeout(() => { this.setState({ className: 'SceneIn', style: { ...SceneView, backgroundImage: nextProps.BG },childStyle:{display:'inline'}}); }, 1995);
        }
    }
    componentWillUnmount(){
        window.removeEventListener('webkitAnimationStart',this.FadeAnimationController);
        window.removeEventListener('webkitAnimationEnd',this.FadeAnimationController);
    }
    render() {
        return (<div className={this.state.className} style={this.state.style}>
            <div className='childElement' style={this.state.childStyle}>{this.props.children}</div>
        </div>);
    }
}
export default Scene;
