import React from 'react';
import { InputNumber, Row, Col, Divider, Slider,Radio,Tooltip } from 'antd';
class TextConfig extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { inputValue: 50 };
		this.onChange = this.onChange.bind(this);
	}
	onChange(value) {
		this.setState({
			inputValue: value,
		})
	};
	render() {
		return (
			<div style={{ padding: 24, background: '#fff' }}>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={12}>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left" title="就是说文本出现的时候那个打字机效果的打字速度">文本速度</Divider>
							<Col span={16}>
								<Slider min={1} max={100} onChange={this.onChange} value={this.state.inputValue} />
							</Col>
							<Col span={8}>
								<InputNumber
									min={1}
									max={100}
									style={{ marginLeft: 16 }}
									value={this.state.inputValue}
									onChange={this.onChange}
								/>
							</Col>
						</div>
						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">自动播放速度</Divider>
							<Col span={16}>
								<Slider min={1} max={100} onChange={this.onChange} value={this.state.inputValue} />
							</Col>
							<Col span={8}>
								<InputNumber
									min={1}
									max={100}
									style={{ marginLeft: 16 }}
									value={this.state.inputValue}
									onChange={this.onChange}
								/>
							</Col>
						</div>

						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">自动播放模式</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="4of3"><Tooltip title="文本和语音同时出现，等待语音结束后才开始下一段文本和语音">正常模式</Tooltip></Radio.Button>
								<Radio.Button value="16of9"><Tooltip title="文本和语音同时出现，但文本不等待配音结束，打字机效果完成后立刻中段语音，开始下一段文本和语音">文本优先模式</Tooltip></Radio.Button>
								<Radio.Button value="16of10"><Tooltip title="有语音的文本段落，文本等语音结束后才开始，没语音的段落按自动模式速度播放">音声优先模式</Tooltip></Radio.Button>
							</Radio.Group>
						</div>

						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">选择选项后Skip模式状态</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="4of3">维持Skip模式</Radio.Button>
								<Radio.Button value="16of9">退出Skip模式</Radio.Button>
							</Radio.Group>
						</div>

						<div style={{ textAlign: "center" }}>
							<Divider orientation="left">选择选项后自动播放模式状态</Divider>
							<Radio.Group defaultValue="a" buttonStyle="solid">
								<Radio.Button value="4of3">维持自动播放模式</Radio.Button>
								<Radio.Button value="16of9">退出自动播放模式</Radio.Button>
							</Radio.Group>
						</div>
					</Col>
					<Col span={12}>
					</Col>
				</Row>
			</div>
		);
	}
}


export default TextConfig;
