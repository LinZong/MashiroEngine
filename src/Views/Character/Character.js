import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tachie from './Tachie/Tachie';
import './Character.less';
const CheckCharacterExist = (obj) => (obj&&obj.Name&&obj.Path);
const Character = (props) => {
	let tachiearr = [null, null, null];
	for (let i = 0; i < props.CharacterList.length; ++i) {
		i > 2 ?
			tachiearr.push(props.CharacterList[i]) :
			tachiearr[i] = (props.CharacterList[i]);
	}
	return (
		<div className="CharacterContainer">
			<Row>
				<TransitionGroup appear={true} exit={true} enter={true}>
					{
						tachiearr.slice(0, 3).map((it, idx) => (
							CheckCharacterExist(it) ? <CSSTransition timeout={400} onEnter={() => {
								document.getElementById("TAKEPLACE" + idx) && (document.getElementById("TAKEPLACE" + idx).style.display = "none")
							}} unmountOnExit={true} onExit={()=>{
								document.getElementById("TAKEPLACE" + idx)&&(document.getElementById("TAKEPLACE" + idx).style.display="none")
							}} onExited={() => document.getElementById("TAKEPLACE" + idx) && (document.getElementById("TAKEPLACE" + idx).style.display = "block")}
								classNames={it.ClassName ? it.ClassName : "defaultTachie"} key={idx}>
								<Col span={8} key={idx}>
									<Tachie IMGClassName={it.Name} Path={it.Path} />
								</Col>
							</CSSTransition> : <Col span={8} key={"TAKEPLACE" + idx} id={"TAKEPLACE" + idx} style={{ display: CheckCharacterExist(tachiearr[idx]) ? "none" : "block" }} />
						))
					}
					{
						tachiearr.slice(3, props.CharacterList.length).map((it) => (
							it && it.Name && it.Path ? <CSSTransition timeout={400} unmountOnExit={true} classNames={it.ClassName ? it.ClassName : "defaultTachie"}>
								<Tachie IMGClassName={it.Name} Path={it.Path} />
							</CSSTransition> : null
						))
					}
				</TransitionGroup>
			</Row>
		</div>
	);
}

Character.propTypes = {
	Character: PropTypes.array.isRequired
}
export default Character;
