import React from 'react';
import SaveDataCard from './VerticleCard/SaveDataCard';
import { Row, Col } from 'antd';
const { GetAllSaveData } = require('../../Engine/LoadSaveData');
class SaveDataPanel extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { AllSaveData: null };
		this.PlaceHolder = window.electron.remote.getGlobal('Environment').UI.SaveDataPlaceHolder;
	}
	componentDidMount() {
		let arr = GetAllSaveData();
		this.setState({ status:'success',AllSaveData: arr });
	}
	render() {
		const { AllSaveData } = this.state;
		return (
			<div style={{ margin: '24px 0', background: '#fff', padding: 16 }}>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					{this.state.status !=='success' ? "Loading" :
						<div>
							<Col span={8}>
								{
									AllSaveData.slice(0, 3).map((it, idx) => (it ?
										<SaveDataCard key={idx} Cover={it.Cover} SaveTimeStamp={it.State.TimeStamp} Title={it.Text} />
										: <SaveDataCard key={idx} Cover={this.PlaceHolder} SaveTimeStamp={"存档不存在"} Title={"所以也没办法显示文本"} />), this)
								}
							</Col>
							<Col span={8}>
								{
									AllSaveData.slice(3, 6).map((it, idx) => (it ?
										<SaveDataCard key={idx+3} Cover={it.Cover} SaveTimeStamp={it.State.TimeStamp} Title={it.Text} />
										: <SaveDataCard key={idx+3} Cover={this.PlaceHolder} SaveTimeStamp={"存档不存在"} Title={"所以也没办法显示文本"} />), this)
								}
							</Col>
							<Col span={8}>
								{
									AllSaveData.slice(6, 9).map((it, idx) => (it ?
										<SaveDataCard key={idx+6} Cover={it.Cover} SaveTimeStamp={it.State.TimeStamp} Title={it.Text} />
										: <SaveDataCard key={idx+6} Cover={this.PlaceHolder} SaveTimeStamp={"存档不存在"} Title={"所以也没办法显示文本"} />), this)
								}
							</Col>
						</div>

					}
				</Row>
			</div>);
	}
}

export default SaveDataPanel;