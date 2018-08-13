import React, { Component } from 'react';
import SceneView from './SceneView.css';
const Scene = (props) =>

    (
        <div className="Scene" style={{ ...SceneView, backgroundImage: props.BG }} onClick={props.onClick}>
            <div className="SelectionMask" style={{ display: props.IsInSection ? "block" : "none" }} />
            <div className="ChildTextBox">{props.children}</div>
        </div >
        );


export default Scene;
