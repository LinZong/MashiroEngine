import React, { Component } from 'react';
import classNames from 'classnames';
import SceneView from './SceneView.css';
const Scene = (props) =>
{
    var MaskClass = classNames({
        'SelectionMask': !props.EnableMask,
        'SelectionMaskOn': props.EnableMask
      });    
    return (
        <div className="Scene" style={{ ...SceneView, backgroundImage: props.BG }} onClick={props.onClick}>
            <div className={MaskClass} />
            <div className="ChildTextBox">{props.children}</div>
        </div >
    );
}

export default Scene;
