import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tachie from './Tachie/Tachie';
import './Character.less';
const Character = (props) => {
	return (
		<div className="CharacterContainer">
			<Row>
				<TransitionGroup appear={true} exit={true} enter={true}>
					{
						props.CharacterList.map((it)=>(
							it&&it.Name&&it.Path?<CSSTransition timeout={400} classNames={it.ClassName?it.ClassName:"defaultTachie"}>
							<Col span={8}>
								<Tachie IMGClassName={it.Name} Path={it.Path} />
							</Col>
						</CSSTransition> :<Col span={8} />
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