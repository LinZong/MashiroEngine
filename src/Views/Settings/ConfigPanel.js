import React from 'react';
import { Radio, Row, Col, Divider, Select, Tooltip, Slider, InputNumber, message } from 'antd';
import safetouch from 'safe-touch';
import { LoadUserConfig, SaveUserConfig } from '../../Engine/LoadConfig';
import * as Status from '../../Engine/Status';
const electron = window.electron;
class ConfigPanel extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { status: 'loading', Desc: null, Settings: null, Changed: false }
		this.ApplySettings = this.ApplySettings.bind(this);
		this.NodeInterpreter = this.NodeInterpreter.bind(this);
		this.LoadConfigPanel = this.LoadConfigPanel.bind(this);
	}
	ApplySettings(value, idx, SelectedCol) {
		//探测系统设置
		let refObj = this.state.Settings;
		let Value = safetouch(value.target).value() || value;
		let ConfigName = refObj.SettingElement[SelectedCol][idx].Name;
		switch (ConfigName) {
			case 'WindowMode': {
				Value = safetouch(value.target).value();
				electron.remote.getCurrentWindow().setFullScreen(Value);
				break;
			}
			case 'WindowRatio': {
				message.info("将根据您当前分辨率确定窗口纵横比", 2);
				let currWindow = electron.remote.getCurrentWindow();
				let sizearr = currWindow.getSize();
				let newWidth = sizearr[0];
				switch (Value) {
					case '4of3': {
						electron.remote.getCurrentWindow().setSize(newWidth,parseInt(newWidth*(3 / 4)));
						break;
					}
					case '16of9': {
						electron.remote.getCurrentWindow().setSize(newWidth,parseInt(newWidth*(9 / 16)));
						break;
					}
				}
				break;
			}
			case 'KeepWindowAtTop':{
				Value = safetouch(value.target).value();
				electron.remote.getCurrentWindow().setAlwaysOnTop(Value);
				break;		
			}
			case 'BGMVolume':{
				let node = document.getElementById('BGM');
				node&&(node.volume=Value/100);
				break;
			}
		}
		refObj.SettingElement[SelectedCol][idx].Value = Value;
		this.setState({ Settings: refObj, Changed: true });
		window.electron.remote.getGlobal('SettingsNode')[this.props.match.params.id] = refObj;
	}
	LoadConfigPanel(id) {
		let res = LoadUserConfig(id);
		this.setState({ status: 'success', Desc: res.Desc, Settings: res.Settings, Changed: false });
	}
	componentDidMount() {
		this.LoadConfigPanel(this.props.match.params.id);
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.Changed) { SaveUserConfig(this.props.match.params.id, this.state.Settings).done((data) => message.success(data, 1), (reason) => message.error(reason, 1)); }
		this.LoadConfigPanel(nextProps.match.params.id);
	}
	componentWillUnmount() {
		if (this.state.Changed) { SaveUserConfig(this.props.match.params.id, this.state.Settings).done((data) => message.success(data, 1), (reason) => message.error(reason, 1)); }
	}
	NodeInterpreter(Desc, SelectedCol) {
		return (<Col span={12}>
			{Desc.SettingOptions[SelectedCol].map((Item, idx) => {
				switch (Item.Type) {
					case "RadioGroup": {
						return (
							<div key={idx} style={{ textAlign: "center" }}>
								<Divider orientation="left">{Item.Description ?
									(<Tooltip title={Item.Description}>{Item.Title}</Tooltip>) :
									(Item.Title)}</Divider>
								<Radio.Group value={this.state.Settings.SettingElement[SelectedCol][idx].Value}
									buttonStyle="solid" onChange={(value) => this.ApplySettings(value, idx, SelectedCol)}>
									{Item.Selection.map((e, index) => {
										return (<Radio.Button key={index} value={e.Value}>{e.Title}</Radio.Button>);
									})}
								</Radio.Group>
							</div>);
					}
					case "Select": {
						return (
							<div key={idx} style={{ textAlign: "center" }}>
								<Divider orientation="left">{Item.Description ?
									(<Tooltip title={Item.Description}>{Item.Title}</Tooltip>) :
									(Item.Title)}</Divider>
								<Select defaultValue={this.state.Settings.SettingElement[SelectedCol][idx].Value} style={{ width: 200 }}
									onChange={(value) => this.ApplySettings(value, idx, SelectedCol)}>
									{Item.Selection.map((e, index) => {
										return (<Select.Option key={index} value={e.Value}>{e.Title}</Select.Option>);
									})}
								</Select>
							</div>);
					}
					case "Slider": {
						return (
							<div key={idx} style={{ textAlign: "center" }}>
								<Divider orientation="left">{Item.Description ?
									(<Tooltip title={Item.Description}>{Item.Title}</Tooltip>) :
									(Item.Title)}</Divider>
								<Col span={16}>
									<Slider min={Item.Min} max={Item.Max} onChange={(value) => this.ApplySettings(value, idx, SelectedCol)}
										value={this.state.Settings.SettingElement[SelectedCol][idx].Value} />
								</Col>
								<Col span={8}>
									<InputNumber
										min={Item.Min}
										max={Item.Max}
										style={{ marginLeft: 16 }}
										value={this.state.Settings.SettingElement[SelectedCol][idx].Value}
										onChange={(value) => this.ApplySettings(value, idx, SelectedCol)}
									/>
								</Col>
							</div>);
					}
					default: break;
				}
			}, this)}
		</Col>)
	};
	render() {
		switch (this.state.status) {
			case Status.LOADING: {
				return "Loading";
			}
			case Status.SUCCESS: {
				return (<div className={this.props.match.params.id} style={{ padding: 24, background: '#fff' }}>
					<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
						{this.NodeInterpreter(this.state.Desc, 'LeftCol')}
						{this.NodeInterpreter(this.state.Desc, 'RightCol')}
					</Row>
				</div>)
			}
			default: return "Internal Error!!";
		}
	}
}


export default ConfigPanel;
