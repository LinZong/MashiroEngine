import React from 'react';
import { Layout, Menu, Icon, Switch, Pagination } from 'antd';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './SaveDataView.css';
import SaveDataPanel from './SaveDataPanel';
const { Header, Content, Footer } = Layout;
const {Page} = window.electron.remote.getGlobal("Environment").SaveDataView;
class SaveDataView extends React.Component {
	constructor(props) {
		super(props);
		this.state = { type: (this.props.type || this.props.match.params.type), delete: false, PageNum: 1 };
		this.onChangePageNum = this.onChangePageNum.bind(this);
	}
	onChangePageNum(page) {
		this.setState({ PageNum: page });
	}
	render() {
		return (
			<Layout className="layout" style={{ height: '100vh' }}>
				<Header>
					<Menu
						theme="dark"
						mode="horizontal"
						style={{ lineHeight: '64px' }}
						selectable={false}
					>
						<Menu.Item key="1" style={{ fontSize: "2em" }}><FormattedMessage id='SELECTSAVEDATA' /></Menu.Item>
						<Menu.Item key="2">
							<NavLink className="nav-text" to='/'>
								<Icon type="arrow-left" />
								<FormattedMessage id='BACKTOMENU' />
							</NavLink>
						</Menu.Item>
						<Menu.Item key="3">
							{this.state.type === 'save' || this.props.match.params.from === 'ingame' ?
								<NavLink className="nav-text" to='/section/prev'>
									<Icon type="to-top" />
									<FormattedMessage id='BACKTOGAME' />
								</NavLink> : null}
						</Menu.Item>
						<Menu.Item key="4">
							<Switch checkedChildren="delete" unCheckedChildren={this.state.type} onChange={(checked) => this.setState({ delete: checked })} />
						</Menu.Item>
					</Menu>
				</Header>
				<Content style={{ padding: '0 50px' }}>
					<SaveDataPanel type={{ type: this.state.type, delete: this.state.delete }} Page={this.state.PageNum} />
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					<Pagination defaultCurrent={1} total={Page*10} defaultPageSize={10} onChange={this.onChangePageNum} />
				</Footer>
			</Layout>
		);
	}
}

export default SaveDataView;




			// <div>
			// 	<NavBar brand={<p style={{ fontSize: "2em" }}><FormattedMessage id='SELECTSAVEDATA' /></p>}>
			// 		<NavLink className="nav-text" to='/'>
			// 			<FormattedMessage id='BACKTOMENU' />
			// 		</NavLink>
			// 		{this.state.type === 'save' || this.props.match.params.from === 'ingame' ?
			// 			<NavLink className="nav-text" to='/section/prev'>
			// 				<Icon type="to-top" />
			// 				<FormattedMessage id='BACKTOGAME' />
			// 			</NavLink> : null}
			// 		<Switch checkedChildren="delete" unCheckedChildren={this.state.type} onChange={(checked) => this.setState({ delete: checked })} />
			// 	</NavBar>
			// 	<SaveDataPanel type={{ type: this.state.type, delete: this.state.delete }} Page={this.state.PageNum}/>
			// 	<Footer style={{ textAlign: 'center' }}>
			// 		<Pagination defaultCurrent={1} total={90} defaultPageSize={10} onChange={this.onChangePageNum}/>
			// 	</Footer>
			// </div>