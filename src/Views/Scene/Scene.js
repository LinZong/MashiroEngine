import React from 'react';
import classNames from 'classnames';
import TransitionGroup from 'react-addons-css-transition-group';
import './SceneView.css';
const Scene = (props) => {
    let MaskClass = classNames({
        'SelectionMask': !props.EnableMask,
        'SelectionMaskOn': props.EnableMask
    });
    return (
        <div className="Scene" onClick={props.onClick}>
            <div className={MaskClass} />
            <TransitionGroup
                transitionName="SceneBGFade"
                transitionEnterTimeout={500}
                transitionLeave={true}
                transitionAppear={true}
                transitionAppearTimeout={500}
            >
                {
                    <div className="SceneBackground" key={props.BG} style={{backgroundImage: props.BG}} />
                }
            </TransitionGroup>
            <div className="ChildElement">{props.children}</div>
        </div >
    );
}

export default Scene;
