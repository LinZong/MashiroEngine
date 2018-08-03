import React from 'react';
import { Radio, Row, Col, Divider, Select, Tooltip, Slider, InputNumber } from 'antd';
import safetouch from 'safe-touch';
import { LoadUserConfig } from '../../Engine/LoadConfig';
import { IMAGE_SETTING } from '../../Engine/actionTypes/SettingType';
import * as Status from '../../Engine/Status';
class ImageConfig extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { status: 'loading', Desc: null, Settings: null }
		this.ApplySettings = this.ApplySettings.bind(this);
		this.NodeInterpreter=this.NodeInterpreter.bind(this);
	}
	ApplySettings(value, idx,SelectedCol) {
		let refObj = this.state.Settings;
		refObj.SettingElement[SelectedCol][idx].Value = safetouch(value.target).value() || value;
		this.setState({ Settings: refObj });
	}
	componentDidMount() {
		var res = LoadUserConfig(IMAGE_SETTING);
		this.setState({ status: 'success', Desc: res.Desc, Settings: res.Settings });
	}
	NodeInterpreter(Desc,SelectedCol) {
		return (<Col span={12}>
			{Desc.SettingOptions[SelectedCol].map((Item, idx) => {
				switch (Item.Type) {
					case "RadioGroup": {
						return (
							<div style={{ textAlign: "center" }}>
								<Divider orientation="left">{Item.Description ?
									(<Tooltip title={Item.Description}>{Item.Title}</Tooltip>) :
									(Item.Title)}</Divider>
								<Radio.Group defaultValue={this.state.Settings.SettingElement[SelectedCol][idx].Value}
									buttonStyle="solid" onChange={(value) => this.ApplySettings(value, idx,SelectedCol)}>
									{Item.Selection.map((e, index) => {
										return (<Radio.Button value={e.Value}>{e.Title}</Radio.Button>);
									})}
								</Radio.Group>
							</div>);
					}
					case "Select": {
						return (
							<div style={{ textAlign: "center" }}>
								<Divider orientation="left">{Item.Description ?
									(<Tooltip title={Item.Description}>{Item.Title}</Tooltip>) :
									(Item.Title)}</Divider>
								<Select defaultValue={this.state.Settings.SettingElement[SelectedCol][idx].Value} style={{ width: 200 }}
									onChange={(value) => this.ApplySettings(value, idx,SelectedCol)}>
									{Item.Selection.map((e, index) => {
										return (<Select.Option value={e.Value}>{e.Title}</Select.Option>);
									})}
								</Select>
							</div>);
					}
					case "Slider": {
						return (
							<div style={{ textAlign: "center" }}>
								<Divider orientation="left">{Item.Description ?
									(<Tooltip title={Item.Description}>{Item.Title}</Tooltip>) :
									(Item.Title)}</Divider>
								<Col span={16}>
									<Slider min={Item.Min} max={Item.Max} onChange={(value) => this.ApplySettings(value, idx,SelectedCol)}
										value={this.state.Settings.SettingElement[SelectedCol][idx].Value} />
								</Col>
								<Col span={8}>
									<InputNumber
										min={Item.Min}
										max={Item.Max}
										style={{ marginLeft: 16 }}
										value={this.state.Settings.SettingElement[SelectedCol][idx].Value}
										onChange={(value) => this.ApplySettings(value, idx,SelectedCol)}
									/>
								</Col>
							</div>);
					}
					default: break;
				}
			},this)}
		</Col>)
	};
	render() {
		switch (this.state.status) {
			case Status.LOADING: {
				return "Loading";
			}
			case Status.SUCCESS: {
				return (<div style={{ padding: 24, background: '#fff' }}>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						{this.NodeInterpreter(this.state.Desc,'LeftCol')}
						{this.NodeInterpreter(this.state.Desc,'RightCol')}
					</Row>
				</div>)
			}
			default: return "Internal Error!!";
		}
	}
}


export default ImageConfig;
