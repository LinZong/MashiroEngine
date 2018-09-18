import React from "react";
import ReactDOM from 'react-dom';
import "./Modal.less";
import classnamez from "classnames";
//2个array，Background和Foreground,2个数，需要生成多少个Background和Foreground.
class Modal extends React.Component {
    constructor(){
        super(...arguments);
        this.MountStatus = this.props.visible;
    }
    componentDidMount() {
        if (this.props.showClose && !this.props.CloseHandler) {
            console.warn(
                'You should pass a control function to sync visible status when user press the "X" button.'
            );
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible){
            this.MountStatus = true;
        }
    }
    render() {
        return this.MountStatus&&ReactDOM.createPortal(
            <div
                className={classnamez("ModalContainer", {
                    ModalContainerEnable: this.props.visible,
                    ModalContainerDisable: !this.props.visible
                })}
            >
                <div className="ModalMaskOn" />
                <div className="ModalChildren">
                    {this.props.children}
                    {this.props.showClose && (
                        <button
                            className="modal-close is-large"
                            aria-label="close"
                            onClick={() =>
                                this.props.CloseHandler && this.props.CloseHandler()
                            }
                        />
                    )}</div>
            </div>, document.getElementsByTagName("body")[0]
        );
    }
}

export default Modal;
