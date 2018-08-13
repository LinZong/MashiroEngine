import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
const ControlButtion = (props) => {
	return (
		<div className="ControlButton" style={{ display: "flex", justifyContent: "flex-end" }}>
			<ButtonGroup onClick={(e)=>e.stopPropagation()}>
				<Tooltip title="Q.Load"><Button icon='cloud-upload-o large' /></Tooltip>
				<Tooltip title="Q.Save"><Button icon='cloud-download-o large' /></Tooltip>
				<Tooltip title="Load"><NavLink to='/savedata/load'><Button icon='cloud-upload large'/></NavLink></Tooltip>
				<Tooltip title="Save"><NavLink to='/savedata/save'><Button icon='cloud-download large' /></NavLink></Tooltip>
				<Tooltip title="设置"><NavLink to='/NewSettings'><Button icon='tool large' /></NavLink></Tooltip>
				<Tooltip title="回到标题页"><NavLink to='/'><Button icon='desktop large' /></NavLink></Tooltip>
			</ButtonGroup>
			<br />
			<ButtonGroup>
				<Tooltip title="回到上一个选择肢"><Button icon='backward large' /></Tooltip>
				<Tooltip title="回到上一个小节"><Button icon='fast-backward large' /></Tooltip>
				<Tooltip title="上一句话"><Button icon='step-backward large' /></Tooltip>
				<Tooltip title="Backlog"><Button icon='caret-left large' /></Tooltip>
				<Tooltip title="Auto-Mode"><Button icon='caret-right large' /></Tooltip>
				<Tooltip title="下一句话"><Button icon='step-forward large' /></Tooltip>
				<Tooltip title="下一小节"><Button icon='fast-forward large' /></Tooltip>
				<Tooltip title="下个选择肢"><Button icon='forward large' /></Tooltip>
				<Tooltip title="隐藏TextBox"><Button icon='close large' /></Tooltip>
			</ButtonGroup>
		</div>);
}

export default withRouter(ControlButtion);