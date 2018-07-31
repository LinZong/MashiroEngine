import React from 'react';
import { Radio, Row, Col, Divider, Select } from 'antd';
class ImageConfig extends React.Component {
	render() {
		return (

			<div style={{ padding: 24, background: '#fff' }}>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">显示模式</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="a">窗口模式</Radio.Button>
								<Radio.Button value="b">全屏模式</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">画面比例</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="a">4:3</Radio.Button>
								<Radio.Button value="b">16:9</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">动画效果</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="a">有</Radio.Button>
								<Radio.Button value="b"> 无</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">使窗口永远位于顶端</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="a">是的</Radio.Button>
								<Radio.Button value="b">不用了我不想暴露属性</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">说话人的表情随着文字变更</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="a">开</Radio.Button>
								<Radio.Button value="b">关</Radio.Button>
							</Radio.Group>
						</div>
					</Col>
					<Col span={12}>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">膜苏希烔巨佬</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="a">是</Radio.Button>
								<Radio.Button value="b">是</Radio.Button>
							</Radio.Group>
						</div>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">游戏界面语言</Divider>
							<Select
								showSearch
								defaultValue="Chinese"
								style={{ width: 200 }}
								placeholder="Select a person"
								optionFilterProp="children"
								filterOption={(input, option) => {return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;}}
							>
								<Select.Option value="Chinese">中文(简体)</Select.Option>
								<Select.Option value="English">English</Select.Option>
								<Select.Option value="Japanese">日本語</Select.Option>
							</Select>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}


export default ImageConfig;
