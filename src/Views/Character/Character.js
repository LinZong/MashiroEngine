import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { CSSTransition } from 'react-transition-group';
import Tachie from './Tachie/Tachie';
import { GetSettingValue } from '../../Engine/LoadConfig';
import './Character.less';
const CheckCharacterExist = (obj) => (obj && obj.Name && obj.Path);
const CheckCharacterClassName = (obj) => (CheckCharacterExist(obj) && obj.ClassName);
class Character extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { ExistStatus: [false, false, false] };
		this.ShouldRenderCharacter = [];
		this.LastRenderCharacter = [];
		this.BuildRenderArray = this.BuildRenderArray.bind(this);
		this.CharacterViewAdapter = this.CharacterViewAdapter.bind(this);
		//this.AnimationEffect = GetSettingValue("ANIMATIONEFFECTS");
	}
	BuildRenderArray(arraySource) {
		this.LastRenderCharacter = this.ShouldRenderCharacter;
		this.ShouldRenderCharacter = [];
		let exists = [];
		for (let i = 0; i < arraySource.length; ++i) {
			if (CheckCharacterExist(arraySource[i])) {
				this.ShouldRenderCharacter.push(arraySource[i]);
				exists.push(true);
			}
			else {
				this.ShouldRenderCharacter.push(null);
				exists.push(false);
			}
		}
		this.setState({ ExistStatus: exists });
	}
	componentDidMount() {
		this.BuildRenderArray(this.props.CharacterList);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.CharacterList !== this.props.CharacterList) {
			this.BuildRenderArray(nextProps.CharacterList);
		}
	}
	CharacterViewAdapter(list, oldList, i, other) {
		return (<CSSTransition in={this.state.ExistStatus[i]} timeout={400}
			classNames={(CheckCharacterClassName(list[i]) ? list[i].ClassName :
				(CheckCharacterClassName(oldList[i]) ? oldList[i].ClassName : "defaultTachie"))} key={i}>
			{!other ? <Col span={8} key={list[i] ? `${i}ex` : `${i}lea`}>
				{list[i] ? <Tachie EnableFade={true} IMGClassName={list[i].Name} Path={list[i].Path} /> : null}
				{oldList[i] ? <Tachie EnableFade={false} IMGClassName={oldList[i].Name} Path={oldList[i].Path} /> : null}
			</Col> : <div key={list[i] ? `${i}ex` : `${i}lea`}>
					{list[i] ? <Tachie EnableFade={true} IMGClassName={list[i].Name} Path={list[i].Path} /> : null}
					{oldList[i] ? <Tachie EnableFade={false} IMGClassName={oldList[i].Name} Path={oldList[i].Path} /> : null}
				</div>}
		</CSSTransition>)
	}
	render() {
		const list = this.ShouldRenderCharacter;
		const oldList = this.LastRenderCharacter;
		return (
			<div className="CharacterContainer">
				<Row>
					{
						list.slice(0, 3).map((it, idx) => this.CharacterViewAdapter(list, oldList, idx, false))
					}
					{
						list.slice(3, list.length).map((it, idx) => this.CharacterViewAdapter(list, oldList, idx, true))
					}
				</Row>
			</div>
		);
	};
}

Character.propTypes = {
	Character: PropTypes.array.isRequired
}
export default Character;
