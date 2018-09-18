import React from 'react'
import { message } from 'antd';
import * as Actions from '../../../Engine/actions/SectionActions';
import store from '../../../Store';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import SaveDataCardView from './SaveDataCardView';
import {Modal,MessageBox} from '../../Modules/Modal/index';
const PlaceHolder = window.electron.remote.getGlobal('Environment').UI.SaveDataPlaceHolder;
const { CreateSaveData, DeleteSaveData } = require('../../../Engine/LoadSaveData');
class SaveDataCard extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			Exist: this.props.exist,
			visible: false,
			Cover: this.props.Cover || PlaceHolder,
			SaveTimeStamp: this.props.SaveTimeStamp,
			Title: this.props.Title
		};

		this.onClickSlot = this.onClickSlot.bind(this);
		this.showModal = this.showModal.bind(this);
		this.handleButton = this.handleButton.bind(this);
		this.LoadSaveData = this.LoadSaveData.bind(this);
		this.DeleteSaveData = this.DeleteSaveData.bind(this);
		this.SaveToSlot = this.SaveToSlot.bind(this);

		this.ActionArr = [this.LoadSaveData, this.DeleteSaveData, this.SaveToSlot];
		this.AlertText = null;
		this.ActionFunc = null;
	}
	DeleteSaveData() {
		DeleteSaveData(this.props.Index).then((ok) => {
			message.success(ok);
			this.setState({ Cover: PlaceHolder, SaveTimeStamp: null, Title: null, Exist: false });
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
		}, (err) => {
			console.log('存档失败', err);
		});
	}
	showModal() {
		if (!this.state.visible)
			this.setState({
				visible: true,
			});
	}
	handleButton(v) {
		switch (v) {
			case 0: {
				this.setState({ visible: false });
				this.ActionFunc();
				break;
			}
			default: {
				this.setState({ visible: false });
				break;
			}
		}
	}
	onClickSlot() {
		const { intl } = this.props;
		if (this.props.type.delete) {
			if (this.state.Exist) {
				this.AlertText = intl.formatMessage({ id: 'CONFIRMDELETESAVEDATA' });
				this.ActionFunc = this.ActionArr[1];
				this.showModal();
			}
			else return;
		}
		else if (this.props.type.type === 'load' && this.state.Exist) {
			this.AlertText = intl.formatMessage({ id: 'CONFIRMLOADSAVEDATA' });
			this.ActionFunc = this.ActionArr[0];
			this.showModal();
		}
		else if (this.props.type.type === 'save' && this.state.Exist) {
			this.AlertText = intl.formatMessage({ id: 'CONFIRMCOVERSAVEDATA' });
			this.ActionFunc = this.ActionArr[2];
			this.showModal();
		}
		else if (this.props.type.type === 'save') {
			this.AlertText = intl.formatMessage({ id: 'CONFIRMCREATESAVEDATA' });
			this.ActionFunc = this.ActionArr[2];
			this.showModal();
		}
	}

	render() {
		return (
				<SaveDataCardView onClick={this.onClickSlot}
					visible={this.state.visible}
					clickfunc={this.handleButton}
					AlertText={this.AlertText}
					SaveTimeStamp={this.state.SaveTimeStamp}
					Title={this.state.Title}
					Exist={this.state.Exist}
					Cover={this.state.Cover}
					Index={this.props.Index} />
		);
	}
}
export default withRouter(injectIntl(SaveDataCard));