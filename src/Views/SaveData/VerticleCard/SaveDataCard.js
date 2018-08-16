import React from 'react'
import { Col, message, Modal } from 'antd';
import * as Actions from '../../../Engine/actions/SectionActions';
import store from '../../../Store';
import { withRouter } from 'react-router';
import './SaveDataCard.css'

const { CreateSaveData, DeleteSaveData } = require('../../../Engine/LoadSaveData');
class SaveDataCard extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			Exist: false,
			visible: false,
			Cover: this.props.Cover,
			SaveTimeStamp: this.props.SaveTimeStamp,
			Title: this.props.Title
		};

		if (this.props.data) this.state.Exist = true;

		this.onClickSlot = this.onClickSlot.bind(this);
		this.showModal = this.showModal.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.LoadSaveData = this.LoadSaveData.bind(this);
		this.DeleteSaveData = this.DeleteSaveData.bind(this);
		this.SaveToSlot = this.SaveToSlot.bind(this);
		this.AlertTextArr = ['确定要加载这个存档?', '确定要删除这个存档?', '确定要覆盖这个存档?', '确定要在此新建存档?'];
		this.ActionArr = [this.LoadSaveData, this.DeleteSaveData, this.SaveToSlot];
		this.AlertText = null;
		this.ActionFunc = null;
		this.PlaceHolder = window.electron.remote.getGlobal('Environment').UI.SaveDataPlaceHolder;
	}
	DeleteSaveData() {
		DeleteSaveData(this.props.Index).then((ok) => {
			message.success(ok);
			this.setState({ Cover: this.PlaceHolder, SaveTimeStamp: "存档不存在", Title: "所以也没办法显示文本", Exist: false });
		}, (reason) => {
			console.log(reason);
		});
	}
	LoadSaveData() {
		store.dispatch(Actions.ClearGameViewState());
		this.props.history.push('/section/save', { SaveInfo: this.props.data });
	}
	SaveToSlot() {
		let data = store.getState().GameView.PrevState;
		const closehandle = message.loading("正在保存");
		CreateSaveData(this.props.Index, data, (ok) => {
			closehandle();
			message.success('成功保存存档', 1);
			this.setState({ Cover: ok.Cover, SaveTimeStamp: ok.State.TimeStamp, Title: ok.State.Text, Exist: true });
		},(err)=>{
			console.log('存档失败',err);
		});
	}
	showModal() {
		if (!this.state.visible)
			this.setState({
				visible: true,
			});
	}
	handleOk(e) {
		e.stopPropagation();
		this.setState({
			visible: false,
		});
		this.ActionFunc();
	}
	handleCancel(e) {
		e.stopPropagation();
		this.setState({
			visible: false,
		});
	}
	onClickSlot(event) {
		if (this.props.type.delete && this.state.Exist) {
			this.AlertText = this.AlertTextArr[1];
			this.ActionFunc = this.ActionArr[1];
			this.showModal();
		}
		else if (this.props.type.type === 'load' && this.state.Exist) {
			this.AlertText = this.AlertTextArr[0];
			this.ActionFunc = this.ActionArr[0];
			this.showModal();
		}
		else if (this.props.type.type === 'save' && this.state.Exist) {
			this.AlertText = this.AlertTextArr[2];
			this.ActionFunc = this.ActionArr[2];
			this.showModal();
		}
		else if (this.props.type.type === 'save') {
			this.AlertText = this.AlertTextArr[3];
			this.ActionFunc = this.ActionArr[2];
			this.showModal();
		}
	}
	render() {
		return (
			<div className="CardFramework" onClick={this.onClickSlot}>
				<Modal
					title="确认框"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					{this.AlertText}
				</Modal>
				<Col span={12}>
					<div className="ScreenShotImg">
						<img alt="这是当前游戏画面的截图" src={"file:///" + this.state.Cover + "?" + Math.random()} style={{ width: '100%' }} />
					</div>
				</Col>
				<Col span={12}>
					<div className="SaveDataInfo">
						<p className="TimeStamp">{this.state.SaveTimeStamp}</p>
						<p className="Text">{this.state.Title}</p>
					</div>
				</Col>
			</div>
		);
	}
}
export default withRouter(SaveDataCard);