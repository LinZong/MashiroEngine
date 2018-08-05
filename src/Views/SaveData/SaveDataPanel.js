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
	componentDidMount() {
		let arr = GetAllSaveData();
		this.setState({ status: 'success', AllSaveData: arr });
	}
	CardProvider(it, idx, begin) {
		return (it ?
			<Col span={8} key={idx+begin}><SaveDataCard  type={this.props.type} key={idx + begin} Index={idx + begin} Cover={it.Cover} SaveTimeStamp={it.State.TimeStamp} Title={it.State.Text} data={it.State}/></Col>
			: <Col span={8} key={idx+begin} ><SaveDataCard type={this.props.type} key={idx + begin} Index={idx + begin} Cover={this.PlaceHolder} SaveTimeStamp={"存档不存在"} Title={"所以也没办法显示文本"} /></Col>);
	}

	render() {
		const { AllSaveData } = this.state;
		return (
			<div style={{ margin: '24px 0', background: '#fff', padding: 16 }}>
				<Row gutter={16} style={{ marginBottom: "16px" }}>
					{this.state.status !== 'success' ? "Loading" :
						AllSaveData.slice(0, 3).map((it, idx) => (this.CardProvider(it, idx, 0)), this)
					}
				</Row>
				<Row gutter={16} style={{ marginBottom: "16px" }}>
					{this.state.status !== 'success' ? "Loading" :

						AllSaveData.slice(3, 6).map((it, idx) => (this.CardProvider(it, idx, 3)), this)

					}
				</Row>
				<Row gutter={16}>
					{this.state.status !== 'success' ? "Loading" :
						AllSaveData.slice(6, 9).map((it, idx) => (this.CardProvider(it, idx, 6)), this)
					}
				</Row>
			</div>);
	}
}

export default SaveDataPanel;