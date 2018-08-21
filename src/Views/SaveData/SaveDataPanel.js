import React from 'react';
import SaveDataCard from './VerticleCard/SaveDataCard';
import { Row, Col } from 'antd';
const { GetAllSaveData } = require('../../Engine/LoadSaveData');
class SaveDataPanel extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { AllSaveData: null };
		this.CardProvider = this.CardProvider.bind(this);
		this.PlaceHolder = window.electron.remote.getGlobal('Environment').UI.SaveDataPlaceHolder;
	}
	CardProvider(it, idx, begin) {
		return (it ?
			<Col span={8} key={idx+begin}><SaveDataCard  type={this.props.type} key={idx + begin} Index={idx + begin} Cover={it.Cover} SaveTimeStamp={it.State.TimeStamp} Title={it.State.Text} data={it.State}/></Col>
			: <Col span={8} key={idx+begin} ><SaveDataCard type={this.props.type} key={idx + begin} Index={idx + begin} Cover={this.PlaceHolder} SaveTimeStamp={"存档不存在"} Title={"所以也没办法显示文本"} /></Col>);
	}
	componentWillMount(){
		this.AllSaveData = GetAllSaveData();
	}
	componentWillUpdate(){
		this.AllSaveData = GetAllSaveData();
	}
	render() {
		const AllSaveData = this.AllSaveData;
		return (
			<div style={{ margin: '24px 0', background: '#fff', padding: 16 }}>
				<Row gutter={16} style={{ marginBottom: "16px" }}>
					{
						AllSaveData.slice((this.props.Page-1)*9, (this.props.Page-1)*9+3).map((it, idx) => (this.CardProvider(it, idx, (this.props.Page-1)*9)), this)
					}
				</Row>
				<Row gutter={16} style={{ marginBottom: "16px" }}>
					{

						AllSaveData.slice((this.props.Page-1)*9+3, (this.props.Page-1)*9+6).map((it, idx) => (this.CardProvider(it, idx, (this.props.Page-1)*9+3)), this)

					}
				</Row>
				<Row gutter={16}>
					{
						AllSaveData.slice((this.props.Page-1)*9+6, (this.props.Page-1)*9+9).map((it, idx) => (this.CardProvider(it, idx, (this.props.Page-1)*9+6)), this)
					}
				</Row>
			</div>);
	}
}

export default SaveDataPanel;