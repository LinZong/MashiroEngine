import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, MessageBox } from '../../Modules/Modal/index';
import { Row, Col } from 'react-flexbox-grid';
import './SaveDataCard.css';

const PlaceHolder = window.electron.remote.getGlobal('Environment').UI.SaveDataPlaceHolder;

function preventBrowserCache(state) {
    return state === PlaceHolder ? state : state + "?" + Math.random();
}
class SaveDataCardView extends React.Component {
    render() {
        return (
            <div>
                <Modal visible={this.props.visible}>
                    <MessageBox title="退出游戏" clickfunc={this.props.clickfunc}>
                        真的要退出游戏吗
                    </MessageBox>
                </Modal>
                <div className="SaveDataContainer" onClick={this.props.onClick}>
                    <Row style={{ width: "100%", height: "100%", margin: "0px 0px" }}>
                        <Col xs style={{ padding: "4px 4px" }}>
                            <div className="ScreenShot">
                                <img alt="这是当前游戏画面的截图" src={"file:///" + preventBrowserCache(this.props.Cover)} style={{ width: '100%' }} />
                            </div>
                        </Col>
                        <Col xs style={{ padding: "4px 4px" }}>
                            <div className="SaveDataInfo">
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