import React from "react";
import { Row, Col } from "react-flexbox-grid";
import ExtraCard from "./Card/ExtraCard";
import {Modal} from '../Modules/Modal/index';
import ExtraCardImage from './Card/ExtraCardImage';
class ExtraContent extends React.Component {
  constructor(){
    super(...arguments);
    this.state={ShowImages:null,ModalVisible:false};
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClick(images){
        //因为CG是一组，所以应该传入一组的Image给它
    this.setState({ShowImages:images,ModalVisible:true});
  }
  handleClose(){

    this.setState({ModalVisible:false});
  }
  render() {
    return (
      <div className="ContentContainer">
      <Modal visible={this.state.ModalVisible} showClose CloseHandler={this.handleClose}>
        <ExtraCardImage Images={this.state.ShowImages} />
      </Modal>
        <Row className="ContentContainerRow">
          <Col xs={10} className="ExtraCGList">
            <div className="ExtraCGContainer">
              <Row className="ExtraCGRow">
                <Col xs className="ExtraCGCol">
                  <ExtraCard onClick={this.handleClick} Images={["file:///../../res/Resources/Character/Xuange/Extra/TestExtra.png","file:///../../res/Resources/Character/Xuange/Extra/TestExtra2.png"]} />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard onClick={this.handleClick} Images={["https://uploads.codesandbox.io/uploads/user/88687e13-c646-45b5-95d1-a6059788baf9/iQ6H-WelcomeBG.png"]} />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard onClick={this.handleClick} Images={["https://uploads.codesandbox.io/uploads/user/88687e13-c646-45b5-95d1-a6059788baf9/iQ6H-WelcomeBG.png"]} />
                </Col>
                <Col xs className="ExtraCGCol">
                </Col>
              </Row>
            </div>
          </Col>
          <Col>
            <div className="BorderLine" />
          </Col>
          <Col xs>
            <div className="BGM" style={{ textAlign: "center" }}>
              <span style={{ fontSize: "1.6rem" }}>BGM</span>
              <div className="BGMList">
                <p>Song1</p>
                <p>Song2</p>
                <p>Song3</p>
                <p>Song4</p>
                <p>Song5</p>
                <p>Song6</p>
                <p>Song7</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ExtraContent;
