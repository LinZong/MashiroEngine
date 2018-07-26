import React, { Component } from 'react';
import SceneView from './SceneView.css';
class Scene extends Component {
    render() {
        return (
            <div className="Scene" style={{ ...SceneView, backgroundImage: this.props.BG }}>
                <div className="SelectionMask" style={{ display: this.props.IsInSection?"block":"none" }} />
                <div className="ChildTextBox">{this.props.children}</div>
            </div>);
    }
}
export default Scene;
