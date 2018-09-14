import React from 'react';
import SaveDataCard from './VerticleCard/SaveDataCard';
import { Row, Col } from 'antd';
const { GetAllSaveData } = require('../../Engine/LoadSaveData');
const SaveDataViewInfo = window.electron.remote.getGlobal("Environment").SaveDataView;
class SaveDataPanel extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { RenderData: null };
		this.CardProvider = this.CardProvider.bind(this);
		this.PlaceHolder = window.electron.remote.getGlobal('Environment').UI.SaveDataPlaceHolder;
	}
	CardProvider(it, idx, begin) {
		return (it ?
			<Col span={24 / SaveDataViewInfo.Col} key={idx + begin}>
				<SaveDataCard type={this.props.type}
					key={idx + begin}
					Index={idx + begin}
					Cover={it.Cover}
					SaveTimeStamp={it.State.TimeStamp}
					Title={it.State.Text}
					data={it.State} exist />
			</Col>
			: <Col span={24 / SaveDataViewInfo.Col} key={idx + begin} >
				<SaveDataCard
					type={this.props.type}
					key={idx + begin}
					Index={idx + begin}
				/>
			</Col>);
	}
	RendeSavaDataCard(source) {
		const sav = GetAllSaveData(source.Page);
		let RenderData = [];
		for (let i = 0; i < SaveDataViewInfo.Row; ++i) {
			RenderData.push(
				<Row gutter={16} style={{ marginBottom: "16px" }}>
					{
						sav.slice(i * SaveDataViewInfo.Col, (i + 1) * SaveDataViewInfo.Col).map((it, idx) => (this.CardProvider(it, idx, source.Page * SaveDataViewInfo.Col)))
					}
				</Row>);
		}
		return RenderData;
	}
	componentDidMount() {
		this.setState({ RenderData: this.RendeSavaDataCard(this.props) });
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ RenderData: this.RendeSavaDataCard(nextProps) });
	}
	render() {
		return (
			<div className="SaveDataPanelContainer">
				{
					this.state.RenderData && this.state.RenderData.map(it=>it)
				}
			</div>);
	}
}

export default SaveDataPanel;

{/* <Row gutter={16} style={{ marginBottom: "16px" }}>
{
	AllSaveData.slice((this.props.Page - 1) * 9, (this.props.Page - 1) * 9 + 3).map((it, idx) => (this.CardProvider(it, idx, (this.props.Page - 1) * 9)), this)
}
</Row>
<Row gutter={16} style={{ marginBottom: "16px" }}>
{
	AllSaveData.slice((this.props.Page - 1) * 9 + 3, (this.props.Page - 1) * 9 + 6).map((it, idx) => (this.CardProvider(it, idx, (this.props.Page - 1) * 9 + 3)), this)
}
</Row>
<Row gutter={16}>
{
	AllSaveData.slice((this.props.Page - 1) * 9 + 6, (this.props.Page - 1) * 9 + 9).map((it, idx) => (this.CardProvider(it, idx, (this.props.Page - 1) * 9 + 6)), this)
}
</Row> */}