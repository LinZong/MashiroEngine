import React from 'react';
import { notification } from 'antd';
const {GetSettingValue}=require('../../Engine/LoadConfig');
class Audio extends React.Component {
	constructor() {
		super(...arguments);
		//on ended on play , BGM ,character(is array),effects
		this.SetAllVolume = this.SetAllVolume.bind(this);
		this.openNotification = this.openNotification.bind(this);
		this.ShowBGMChanged = true;
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
			node.volume = GetSettingValue('BGMVolume')/100;
			node.play();
			this.ShowBGMChanged && this.openNotification(this.props.BGM.Name);
			this.ShowBGMChanged = false;
		}
		if (this.props.Character) {
			let node = document.getElementById('CharacterVoice');
			node.volume = 1//这里应该去获取设置
			node.play();
		}
		const SetArrayVolumeAndPlay = (arr) => {
			arr.forEach(ele => {
				let node = document.getElementById(ele.Name);
				node.volume = GetSettingValue('EffectsVolume')/100;
				node.play();
			})
		};
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
	shouldComponentUpdate(nextProps,nextState){
		return this.props.BGM!==nextProps.BGM||this.props.Character!==nextProps.Character;
	}
	componentDidUpdate() {
		this.SetAllVolume();
	}
	render() {
		return (
			<div className="InGameSound">
				{
					this.props.BGM ?
						<audio key={0} id="BGM" src={this.props.BGM.Path} autoPlay={false} loop={true} onEnded={() => this.props.onEnded && this.props.OnEnded('BGM')} />
						:
						null
				}
				{
					this.props.Character ?
						<audio key={1} id="CharacterVoice" src={this.props.Character.File} autoPlay={false} onEnded={() => this.props.onEnded && this.props.onEnded(this.props.Character.File)} />
						: null
				}
				{
					this.props.Effects ? this.props.Effects.map((it, idx) => {
						return <audio key={idx + 99} id={it.Name} src={it.File} autoPlay={false} onEnded={() => this.props.onEnded && this.props.onEnded(it.Name)} />
					}) : null
				}
			</div>);
	}
}
export default Audio;