import React from "react";
import ReactDOM from 'react-dom';
import "./Modal.less";
import classnamez from "classnames";
const defaultButtons = [
    {
        Text: "确定",
        ExtraClassName: "success Confirm",
        Value: 0
    },
    { Text: "取消", Value: 1, ExtraClassName: "danger Cancel" }
];
//2个array，Background和Foreground,2个数，需要生成多少个Background和Foreground.
class Modal extends React.Component {
    render() {

        return this.props.visible&&ReactDOM.createPortal(
            <div
                className="ModalContainer"
                style={{
                    display: classnamez({
                        block: this.props.visible,
                        none: !this.props.visible
                    })
                }}
            >
                <div className="ModalMaskOn" />
                <div className="box MessageBox">
                    <span className="MessageBoxTitle">{this.props.title}</span>
                    <div className="MessageBoxChildren">{this.props.children}</div>
                    <div className="SelectionButtons">
                        {(this.props.buttons || defaultButtons).map((it, idx) => {
                            return (
                                <button
                                    className={`SelectionButton button is-${it.ExtraClassName}`}
                                    onClick={() =>
                                        this.props.clickfunc && this.props.clickfunc(it.Value)
                                    }
                                >
                                    {it.Text}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>, document.getElementsByTagName("body")[0]
        );
    }
}

export default Modal;
