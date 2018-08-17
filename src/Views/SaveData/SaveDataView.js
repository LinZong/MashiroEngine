import React from 'react';
import { Layout, Menu, Row, Col, Icon, Switch ,Pagination} from 'antd';
import { NavLink } from 'react-router-dom';
import './SaveDataView.css';
import SaveDataPanel from './SaveDataPanel';
const { Header, Content, Footer } = Layout;

class SaveDataView extends React.Component {
	constructor(props) {
		super(props);
		this.state = { type: null, delete: false ,PageNum:1};
		this.onChangePageNum=this.onChangePageNum.bind(this);
	}
	onChangePageNum(page,pageSize){
		//console.log(page,pageSize);
		this.setState({PageNum:page});
	}
	componentDidMount() {
		this.setState({ type: this.props.type || this.props.match.params.type });
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
						<Menu.Item key="1" style={{ fontSize: "2em" }}>存档选择</Menu.Item>
						<Menu.Item key="2">
							<NavLink className="nav-text" to='/'>
								<Icon type="arrow-left" />
								回到主菜单
						</NavLink>
						</Menu.Item>
						<Menu.Item key="3">
							{this.state.type === 'save' || this.props.match.params.from === 'ingame' ? 
							<NavLink className="nav-text" to='/section/prev'>
								<Icon type="to-top" />
								回到游戏
						</NavLink> : null}
						</Menu.Item>
						<Menu.Item key="4">
							<Switch checkedChildren="delete" unCheckedChildren={this.state.type} onChange={(checked) => this.setState({ delete: checked })} />	,
						</Menu.Item>
					</Menu>
				</Header>
				<Content style={{ padding: '0 50px' }}>
					<SaveDataPanel type={{ type: this.state.type, delete: this.state.delete }} Page={this.state.PageNum}/>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					<Pagination defaultCurrent={1} total={90} defaultPageSize={10} onChange={this.onChangePageNum}/>
				</Footer>
			</Layout>);
	}
}

export default SaveDataView;