import React from 'react';
import { Col, Select, Slider, InputNumber, Divider, Row } from 'antd';
import store from '../../Store';
import { GetRemoteUrlPath } from '../../Engine/Util';
import {SaveCustomProfile} from '../../Engine/LoadConfig';
const { Option } = Select;

class CHARACTERVOLUME extends React.Component {
    constructor() {
        super(...arguments);
        //props will receive 3 params: name,title and path.
        let da = store.getState().Setting[this.props.name][0].CharacterList;
        this.state = {
            current: 0,
            data: da
        }
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.ChangeValue = this.ChangeValue.bind(this);
    }
    ChangeSelect(value) {
        this.setState({ current: value });
    }
    ChangeValue(v) {
        let NewData = this.state.data;
        NewData[this.state.current].VoiceVolume = v;
        this.setState({ data: NewData },()=>{
            SaveCustomProfile(this.props.name,this.props.path,[{CharacterList:this.state.data}]);
        });
    }
    render() {
        return (
            <div>
                <Divider orientation="left">{this.props.title}</Divider>
                <Row>
                    <Col span={8}>
                        <Select defaultValue={this.state.current} style={{ minWidth: "7vw" }} onChange={this.ChangeSelect}>
                            {
                                this.state.data.map((it, idx) => {
                                    return <Option key={idx} value={idx}>{it.DisplayName}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Slider min={1} max={100} onChange={this.ChangeValue} value={this.state.data[this.state.current].VoiceVolume} />
                    </Col>
                    <Col span={8}>
                        <InputNumber
                            min={1}
                            max={100}
                            value={this.state.data[this.state.current].VoiceVolume}
                            onChange={this.ChangeValue}
                        />
                    </Col>
                </Row>

                <Row>
                    <img alt="默认立绘预览" style={{ maxHeight: "40vh" }} src={GetRemoteUrlPath(this.state.data[this.state.current].DefaultTachie, true)} />
                </Row>

            </div>);
    }
}

export default CHARACTERVOLUME;