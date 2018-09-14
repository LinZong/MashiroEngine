import React from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../Modules/Modal/Modal';
import { Row, Col } from 'react-flexbox-grid';
import './SaveDataCard.css';

const PlaceHolder = window.electron.remote.getGlobal('Environment').UI.SaveDataPlaceHolder;

function preventBrowserCache(state) {
    return state === PlaceHolder ? state : state + "?" + Math.random();
}
class SaveDataCardView extends React.Component {
    componentDidMount() {
        let PicStyle = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this._PicRef), null);
        this._InfRef.style.height = PicStyle.height;
    }
    render() {
        return (
            <div>
                <Modal title="确认框" visible={this.props.visible} clickfunc={this.props.clickfunc}>
                    {this.props.AlertText}
                </Modal>
                <div className="SaveDataContainer" onClick={this.props.onClick}>
                    <Row style={{ width: "100%", height: "100%", margin: "0px 0px" }}>
                        <Col xs style={{ padding: "4px 4px" }}>
                            <div className="ScreenShot" ref={(r) => this._PicRef = r}>
                                <img alt="这是当前游戏画面的截图" src={"file:///" + preventBrowserCache(this.props.Cover)} style={{ width: '100%' }} />
                            </div>
                        </Col>
                        <Col xs style={{ padding: "4px 4px" }}>
                            <div className="SaveDataInfo" ref={(r) => this._InfRef = r}>
                                <p className="TimeStamp">{this.props.SaveTimeStamp}</p>
                                <p id="OriginalText">{this.props.Title}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default SaveDataCardView;