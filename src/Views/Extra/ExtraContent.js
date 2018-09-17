import React from "react";
import ReactDOM from 'react-dom';
import { Row, Col } from "react-flexbox-grid";
import ExtraCard from "./Card/ExtraCard";
class ExtraContent extends React.Component {
  // componentDidMount(){
  //   this.UpdateSize();
  //   window.addEventListener('resize', () => this.UpdateSize());
  // }
  // componentWillUnmount(){
  //   window.removeEventListener('resize', () => this.UpdateSize());
  // }
  // UpdateSize() {
  //     const ContainerDom = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this._ExtraContainerRef));
  //     let ResizeTarget = ReactDOM.findDOMNode(this._ExtraCGListRef);
  //     ResizeTarget.style.height = ContainerDom.height;
  //     console.log("重设为",ResizeTarget.style.height);
  // }
  render() {
    return (
      <div className="ContentContainer">
        <Row className="ContentContainerRow">
          <Col xs={10} className="ExtraCGList">
            <div className="ExtraCGContainer">
              <Row className="ExtraCGRow">
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
              </Row>
              <Row className="ExtraCGRow">
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
              </Row>
              <Row className="ExtraCGRow">
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
              </Row>
              <Row className="ExtraCGRow">
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
              </Row>
              <Row className="ExtraCGRow">
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
                </Col>
                <Col xs className="ExtraCGCol">
                  <ExtraCard />
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
                <p>Song1Song1</p>
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
