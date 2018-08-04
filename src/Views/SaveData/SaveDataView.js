import React from 'react';
import { Layout, Menu, Row, Col, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import './SaveDataView.css';
import SaveDataPanel from './SaveDataPanel';
const { GetAllSaveData } = require('../../Engine/LoadSaveData');
const { Header, Content, Footer } = Layout;

class SaveDataView extends React.Component {
	constructor() {
		super(...arguments);
		this.TestScreenShot = this.TestScreenShot.bind(this);
	}
	TestScreenShot() {
		const contents = window.electron.remote.getCurrentWindow().webContents;
		console.log(contents);
		contents.capturePage((image) => {
			let png = image.toPNG();
			let fs = window.electron.remote.require('fs');
			fs.writeFile('screen.png', png, (err) => console.log("OK"));
		});
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
						<Menu.Item Key="1" style={{ fontSize: "15pt" }}>存档选择</Menu.Item>
						<Menu.Item Key="2">
							<NavLink className="nav-text" to='/'>
								<Icon type="arrow-left" />
								回到主菜单
						</NavLink>
						</Menu.Item>
						<Menu.Item Key="3">
							<NavLink className="nav-text" to='/section'>
								<Icon type="to-top" />
								回到游戏
						</NavLink>
						</Menu.Item>
					</Menu>
				</Header>
				<Content style={{ padding: '0 50px' }}>
					<SaveDataPanel />
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					你都不知道苏希烔多牛批，还不快努力学习打码
		</Footer>
			</Layout>);
	}
}

export default SaveDataView;