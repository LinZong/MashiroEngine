import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Button, Tooltip, Popover, message } from 'antd';
import { ControlFunctionContext } from '../../GameView/GameView';
import { IMAGE_SETTING } from '../../../Engine/actionTypes/SettingType';
import { injectIntl } from 'react-intl';
import "./ControlButton.less"
const ButtonGroup = Button.Group;
const { GetQuickSaveData, CreateQuickSaveData } = require('../../../Engine/LoadSaveData');
class ControlButtion extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			ShowQuickSave: null,
			defQuickSave: (<div className="QLoadContent">
				<p>这里什么都没有噢</p>
			</div>)
		}
		this.BuildQsaveContent = this.BuildQsaveContent.bind(this);
		this.DoQuickSave = this.DoQuickSave.bind(this);
		this.LoadQuickSave = this.LoadQuickSave.bind(this);

	}
	BuildQsaveContent(qsavedata) {
		return (<div className="QLoadContent">
			<p className="QSaveTimeStamp">{qsavedata.TimeStamp}</p>
			<p className="QSaveTitle">{qsavedata.Text}</p>
		</div>)
	}
	componentDidMount() {
		let qsavedata = GetQuickSaveData();
		this.setState({
			ShowQuickSave: qsavedata ?
				this.BuildQsaveContent(qsavedata) :
				this.state.defQuickSave
		});
	}
	LoadQuickSave() {
		let qsavedata = GetQuickSaveData();
		this.props.match.params.load = "save";
		this.props.location.state = { SaveInfo: qsavedata };
		this.Func.LoadSaveData(qsavedata);
	}
	DoQuickSave() {
		let data = this.Func.SaveState();
		CreateQuickSaveData(data).then((ok) => {
			message.success('成功完成快速存档', 2);
			this.setState({
				ShowQuickSave:
					this.BuildQsaveContent(data)
			});
		}, (err) => {
			return console.warn(err);
		})
	}
	render() {
		return (
			<ControlFunctionContext.Consumer>
				{Func => {
					this.Func = Func;
					const { intl } = this.props;
					return (
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<ButtonGroup onClick={(e) => e.stopPropagation()}>
								<Popover content={this.state.ShowQuickSave} title={intl.formatMessage({ id: 'QLOAD' })}>
									<Button className="ControlButtonStyle" icon='cloud-upload-o large' onClick={this.LoadQuickSave} />
								</Popover>
								<Tooltip title={intl.formatMessage({ id: 'QSAVE' })}>
									<Button className="ControlButtonStyle" icon='cloud-download-o large' onClick={this.DoQuickSave} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'LOADSAVEDATA' })}>
									<NavLink to='/savedata/load/ingame'>
										<Button className="ControlButtonStyle" icon='cloud-upload large' />
									</NavLink>
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'CREATESAVEDATA' })}>
									<NavLink to='/savedata/save/ingame'>
										<Button className="ControlButtonStyle" icon='cloud-download large' />
									</NavLink>
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'SETTING' })}>
									<NavLink to={{ pathname: '/NewSettings/' + IMAGE_SETTING, state: { ingame: true } }} >
										<Button className="ControlButtonStyle" icon='tool large' />
									</NavLink>
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'BACKTOMENU' })}>
									<NavLink to='/'>
										<Button className="ControlButtonStyle" icon='desktop large' />
									</NavLink>
								</Tooltip>
							</ButtonGroup>

							<ButtonGroup onClick={(e) => e.stopPropagation()}>
								<Tooltip title={intl.formatMessage({ id: 'PREVSELECTION' })}>
									<Button className="ControlButtonStyle" icon='backward large' onClick={() => Func.GetPrevSelection(true)} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'PREVSCENE' })}>
									<Button className="ControlButtonStyle" icon='fast-backward large' onClick={() => Func.GetPrevSection(true)} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'PREVTEXT' })}>
									<Button className="ControlButtonStyle" icon='step-backward large' onClick={() => Func.GetNewTextNode(-1)} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'BACKLOG' })}>
									<Button className="ControlButtonStyle" icon='caret-left large' onClick={Func.OpenBacklog} />
								</Tooltip>
								<Tooltip title={classNames('AutoMode', { 'On': this.props.AutoMode, 'Off': !this.props.AutoMode })}>
									<Button className="ControlButtonStyle" icon={classNames({ 'caret-right': this.props.AutoMode, 'right': !this.props.AutoMode }, 'large')}
										onClick={() => Func.SetAutoModeStatus(!this.props.AutoMode)} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'NEXTTEXT' })}>
									<Button className="ControlButtonStyle" icon='step-forward large' onClick={() => Func.GetNewTextNode(1)} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'NEXTSCENE' })}>
									<Button className="ControlButtonStyle" icon='fast-forward large' onClick={() => Func.GetNextSection(true)} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'NEXTSELECTION' })}>
									<Button className="ControlButtonStyle" icon='forward large' onClick={() => Func.GetNextSelection(true)} />
								</Tooltip>
								<Tooltip title={intl.formatMessage({ id: 'HIDETEXTBOX' })}>
									<Button className="ControlButtonStyle" icon='close large' onClick={(e) => { Func.SetTextBoxVisible(false) }} />
								</Tooltip>
							</ButtonGroup>
						</div>);
				}}
			</ControlFunctionContext.Consumer>);
	}
}

export default withRouter(injectIntl(ControlButtion));