import React from 'react';
import { Layout, Menu, Row, Col, Icon,Switch } from 'antd';
import { NavLink } from 'react-router-dom';
import './SaveDataView.css';
import SaveDataPanel from './SaveDataPanel';
const { Header, Content, Footer } = Layout;

class SaveDataView extends React.Component {
	constructor(props){
		super(props);
		this.state={type:null,delete:false};
	}
	componentDidMount(){
		this.setState({type:this.props.type || this.props.match.params.type});
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
						<Menu.Item Key="1" style={{ fontSize: "2em" }}>存档选择</Menu.Item>
						<Menu.Item Key="2">
							<NavLink className="nav-text" to='/'>
								<Icon type="arrow-left" />
								回到主菜单
						</NavLink>
						</Menu.Item>
						<Menu.Item Key="3">
							{this.state.type==='save'?<NavLink className="nav-text" to='/section/prev'>
								<Icon type="to-top" />
								回到游戏
						</NavLink>:null}
						</Menu.Item>
						<Menu.Item Key="4">
							<Switch checkedChildren="delete" unCheckedChildren={this.state.type} onChange={(checked)=>this.setState({delete:checked})} />	,
						</Menu.Item>
					</Menu>
				</Header>
				<Content style={{ padding: '0 50px' }}>
					<SaveDataPanel type={{type:this.state.type,delete:this.state.delete}}/>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					你都不知道苏希烔多牛批，还不快努力学习打码
		</Footer>
			</Layout>);
	}
}

export default SaveDataView;