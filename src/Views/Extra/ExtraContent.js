import React from "react";
import { Row, Col } from "react-flexbox-grid";
import ExtraCard from "./Card/ExtraCard";
import { Modal } from '../Modules/Modal/index';
import ExtraCardImage from './Card/ExtraCardImage';
import { GetRemoteUrlPath } from '../../Engine/Util';
class ExtraContent extends React.Component {
  constructor() {
    super(...arguments);
    this.state = { ShowImages: null, ModalVisible: false, CGList: null };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.LockedCGPlaceHolder = "file:///../../res/Resources/Theme/UIResources/Framework/CGLocked.png";
    this.ExtraImageView = window.electron.remote.getGlobal("Environment").ExtraView;
    this.CharacterList = window.electron.remote.getGlobal("Character").CharacterList;
  }
  handleClick(images) {
    //因为CG是一组，所以应该传入一组的Image给它
    this.setState({ ShowImages: images, ModalVisible: true });
  }
  handleClose() {
    this.setState({ ModalVisible: false });
  }
  SplitImageToGroups(imageArr) {
    let rows = [];
    let cols = [];
    let count = imageArr.length;
    let RowsNum = parseInt(count / this.ExtraImageView.Col, 10) + 1;
    for (let i = 1; i <= RowsNum * this.ExtraImageView.Col; ++i) {
      cols.push(imageArr[i - 1]);
      if (i !== 0 && ((i) % this.ExtraImageView.Col === 0)) {
        rows.push(cols);
        cols = [];
      }
    }
    if (cols.length !== 0) rows.push(cols);
    return rows;
  }
  LoadCharacterExtra(source) {
    let index = source.match.params.character;
    let resources = this.CharacterList[index].Extra.Scene;
    this.setState({ CGList: this.SplitImageToGroups(resources) });
  }
  componentDidMount() {
    this.LoadCharacterExtra(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.LoadCharacterExtra(nextProps);
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
              {
                this.state.CGList && this.state.CGList.map((it, idx) => {
                  return (<Row key={idx + "Row"} className="ExtraCGRow">
                    {
                      it.map((i, index) => (i ? (i.Unlocked ?
                        <Col key={index + this.ExtraImageView.Col * idx + "Col"} xs className="ExtraCGCol">
                          <ExtraCard unlocked onClick={this.handleClick} Images={i.Path} />
                        </Col> :
                        <Col key={index + this.ExtraImageView.Col * idx + "Col"} xs className="ExtraCGCol">
                          <ExtraCard Images={[this.LockedCGPlaceHolder]} /></Col>) :
                        <Col key={index + this.ExtraImageView.Col * idx + "Col"} xs className="ExtraCGCol"></Col>), this)
                    }
                  </Row>)
                }, this)
              }
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
