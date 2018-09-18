import React from 'react';
import SaveDataCard from './VerticleCard/SaveDataCard';
import {Row,Col} from 'react-flexbox-grid';
const { GetAllSaveData } = require('../../Engine/LoadSaveData');
const SaveDataViewInfo = window.electron.remote.getGlobal("Environment").SaveDataView;
class SaveDataPanel extends React.Component {
	constructor() {
		super(...arguments);
		this.CardProvider = this.CardProvider.bind(this);
	
	}
	CardProvider(it, idx, begin) {
		return (it ?
			<Col xs key={idx + begin}>
				<SaveDataCard type={this.props.type}
					key={idx + begin}
					Index={idx + begin}
					Cover={it.Cover}
					SaveTimeStamp={it.State.TimeStamp}
					Title={it.State.Text}
					data={it.State} exist />
			</Col>
			: <Col xs key={idx + begin} >
				<SaveDataCard
					type={this.props.type}
					key={idx + begin}
					Index={idx + begin}
				/>
			</Col>);
	}
	RendeSavaDataCard(source) {
		let row = SaveDataViewInfo.Row;
		let col = SaveDataViewInfo.Col;
		const sav = GetAllSaveData(source.Page);
		let RenderData = [];
		let beginKey = row*col*(source.Page-1);
		for (let i = 0; i < SaveDataViewInfo.Row; ++i) {
			RenderData.push(
				<Row style={{ marginBottom: (i!==SaveDataViewInfo.Row-1)&&"16px" }}>
					{
						sav.slice(i * SaveDataViewInfo.Col, (i + 1) * SaveDataViewInfo.Col).map((it, idx) => this.CardProvider(it, idx, beginKey))
					}
				</Row>);
			beginKey+=col;
		}
		return RenderData;
	}
	render() {
		return (
			<div className="SaveDataPanelContainer">
				{
					this.RendeSavaDataCard(this.props)	
				}
			</div>);
	}
}

export default SaveDataPanel;
