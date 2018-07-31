import React from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import ImageConfig from './ImageConfig'
import { Route, Switch, NavLink } from 'react-router-dom';
const { Content, Footer, Sider } = Layout;


class NavBar extends React.Component {
	render() {
		return (
			<Layout style={{ height: '100vh' }}>
				<Sider
					breakpoint="lg"
					collapsedWidth="0"
					onBreakpoint={(broken) => { console.log(broken); }}
					onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
				>
					<div className="logo" />
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
						<Menu.Item key="1">
							<NavLink className="nav-text" to='/NewSettings/ImageConfig'>
							<Icon type="desktop" />
							画面设置
							</NavLink>
						</Menu.Item>
						<Menu.Item key="2">
							<Icon type="file-text" />
							<span className="nav-text">文本设置</span>
						</Menu.Item>
						<Menu.Item key="3">
							<Icon type="sound" />
							<span className="nav-text">声音设置</span>
						</Menu.Item>
						<Menu.Item key="4">
							<Icon type="tool" />
							<span className="nav-text">控制设置</span>
						</Menu.Item>
						<Menu.Item key="5">
							<Icon type="select" />
							<span className="nav-text">游戏进行设置</span>
						</Menu.Item>
						<Menu.Item key="6">
							<Icon type="reload" />
							<span className="nav-text">恢复初始设置</span>
						</Menu.Item>
					</Menu>
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} selectable={false}>
						<Menu.Item key="7" onClick={() => message.info('成功保存设置', 1)}>
							<Icon type="save" />
							<span className="nav-text">保存</span>
						</Menu.Item>
						<Menu.Item key="8">
							<NavLink className="nav-text" to='/section'>
							<Icon type="to-top" />
								回到游戏
							</NavLink>
						</Menu.Item>
						<Menu.Item key="9">
							<NavLink className="nav-text" to='/'>
							<Icon type="arrow-left" />
							回到主菜单
							</NavLink>
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout>
					<Content style={{ margin: '24px 16px 0' }}>
						<Switch>
							<Route path='/NewSettings' component={ImageConfig} />
							<Route path='/NewSettings/ImageConfig' component={ImageConfig} />
						</Switch>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						年度笑话合集——傻逼galgame游戏引擎
     				 </Footer>
				</Layout>
			</Layout>
		);
	}
}


export default NavBar;
