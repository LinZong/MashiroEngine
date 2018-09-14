import React from 'react';
import { Layout, Menu, Icon, Modal, message } from 'antd';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import {injectIntl,FormattedMessage} from 'react-intl';
import { IMAGE_SETTING, TEXT_SETTING, SOUND_SETTING, CONTROLLER_SETTING, INGAME_SETTING } from '../../Engine/actionTypes/SettingType';
const { ResetToDefaultConfig } = require('../../Engine/LoadConfig');
const { Content, Footer, Sider } = Layout;

class NavBar extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { visible: false };
		this.showModal = this.showModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleOk = this.handleOk.bind(this);

		this.state = { PanelPath: IMAGE_SETTING };
		
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
		ResetToDefaultConfig(this.state.PanelPath).done(() => message.success("恢复默认设置成功"), () => message.error("恢复默认设置失败"));
	}
	handleCancel(e) {
		e.stopPropagation();
		this.setState({
			visible: false,
		});
	}
	render() {
		return (
			<Layout style={{ height: '100vh' }}>
				<Sider
					breakpoint="lg"
					collapsedWidth="0"
				>
					<Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.PanelPath]}>
						<Menu.Item key={IMAGE_SETTING}>
							<NavLink
								className="nav-text"
								onClick={() => this.setState({ PanelPath: IMAGE_SETTING })}
								to={{ pathname: '/NewSettings/' + IMAGE_SETTING, state: { ingame: this.props.InGame } }}>
								<Icon type="desktop" />
								<FormattedMessage id='IMAGECONFIG' />
							</NavLink>
						</Menu.Item>
						<Menu.Item key={TEXT_SETTING}>
							<NavLink
								className="nav-text"
								onClick={() => this.setState({ PanelPath: TEXT_SETTING })}
								to={{ pathname: '/NewSettings/' + TEXT_SETTING, state: { ingame: this.props.InGame } }}>
								<Icon type="file-text" />
								<FormattedMessage id='TEXTCONFIG' />
							</NavLink>
						</Menu.Item>
						<Menu.Item key="3">
							<NavLink
								className="nav-text"
								onClick={() => this.setState({ PanelPath: SOUND_SETTING })}
								to={{ pathname: '/NewSettings/' + SOUND_SETTING, state: { ingame: this.props.InGame } }}>
								<Icon type="sound" />
								<FormattedMessage id='SOUNDCONFIG' />
							</NavLink>
						</Menu.Item>
						{/* <Menu.Item key="4">
							<Icon type="tool" />
							<FormattedMessage id='CONTROLCONFIG' />
						</Menu.Item>
						<Menu.Item key="5">
							<Icon type="select" />
							<FormattedMessage id='INGAMESETTING' />
						</Menu.Item> */}

					</Menu>
					<Menu theme="dark" mode="inline" selectable={false}>
						<Menu.Item key="6" onClick={()=>this.showModal()}>
							<Icon type="reload" />
							<FormattedMessage id='FACTORYRESET' />
						</Menu.Item>
						{this.props.InGame &&
							<Menu.Item key="8">
								<NavLink className="nav-text" to='/section/prev'>
									<Icon type="to-top" />
									<FormattedMessage id='BACKTOGAME' />
							</NavLink>
							</Menu.Item>
						}
						<Menu.Item key="9">
							<NavLink className="nav-text" to='/'>
								<Icon type="arrow-left" />
								<FormattedMessage id='BACKTOMENU' />
							</NavLink>
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout>
					<Content style={{ margin: '24px 16px 0' }}>
						<Modal
							title="确认框"
							visible={this.state.visible}
							onOk={this.handleOk}
							onCancel={this.handleCancel}
						>
							{this.props.intl.formatMessage({id: 'CONFIRMFACTORYRESET'})}
						</Modal>
						{this.props.children}
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						まだ記憶の中の日々、あどけない笑顔二つ
     				 </Footer>
				</Layout>
			</Layout>
		);
	}
}


export default withRouter(injectIntl(NavBar));
