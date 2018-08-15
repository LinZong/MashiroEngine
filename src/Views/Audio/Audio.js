// import React from 'react';

// class Audio extends React.Component{

// 	render(){
// 		return <audio id="AudioObj" src={this.props.BGM} autoPlay={true} />
// 	}
// }

// export default Audio;
import React from 'react';
import { createPortal } from "react-dom";
import { notification } from 'antd';
class Audio extends React.Component {
	constructor() {
		super(...arguments);
		//on ended on play , BGM ,character(is array),effects
		this.SetAllVolume = this.SetAllVolume.bind(this);
		this.openNotification = this.openNotification.bind(this);
		this.ShowBGMChanged = 1;
	}
	openNotification(name) {
		const args = {
			message: '♪正在播放的背景音乐',
			description: name,
			duration: 2,
		};
		notification.open(args);
	};
	SetAllVolume() {
		if (this.props.BGM) {
			let node = document.getElementById('BGM');
			node.volume = 1//这里应该去获取设置
			node.play();
			this.ShowBGMChanged && this.openNotification(this.props.BGM.Name);
			this.ShowBGMChanged = false;
		}
		const SetArrayVolumeAndPlay = (arr) => {
			arr.forEach(ele => {
				let node = document.getElementById(ele.Name);
				node.volume = 0.9//这个也是要查设置
				node.play();
			})
		};
		this.props.Character && SetArrayVolumeAndPlay(this.props.Character);
		this.props.Effects && SetArrayVolumeAndPlay(this.props.Effects);
	}
	componentDidMount() {
		this.SetAllVolume();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.BGM !== this.props.BGM) {
			this.ShowBGMChanged = true;
		}
	}
	componentDidUpdate() {
		this.SetAllVolume();
	}
	render() {
		return (
			<div className="InGameSound">
				{
					this.props.BGM ?
						<audio id="BGM" src={this.props.BGM.Path} autoPlay={false} onEnded={() => this.props.onEnded && this.props.OnEnded('BGM')} />
						:
						null
				}
				{
					this.props.Character ? this.props.Character.map((it, idx) => {
						return <audio key={idx} id={it.Name} src={it.File} autoPlay={false} onEnded={() => this.props.onEnded && this.props.onEnded(it.Name)} />
					}) : null
				}
				{
					this.props.Effects ? this.props.Effects.map((it, idx) => {
						return <audio key={idx + 99} id={it.Name} src={it.File} autoPlay={false} onEnded={() => this.props.onEnded && this.props.onEnded(it.Name)} />
					}) : null
				}
			</div>);
	}
}
// export default ({BGM,Character,Effects,onEnded}) =>
// 	createPortal(
// 		<Audio BGM={BGM} Character={Character} Effects={Effects} onEnded={onEnded} />,
// 		document.getElementById('music')
// 	);

export default Audio;