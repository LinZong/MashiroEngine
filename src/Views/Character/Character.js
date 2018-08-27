import React from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-addons-css-transition-group';
import { Row, Col } from 'antd';
import './Character.css';
class Character extends React.Component {
	constructor() {
		super(...arguments);
		//传入数组，通过数组长度计算Col 的span
		this.state={EnterTransition:false};
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.CharacterList&&this.props.CharacterList){
			this.setState({EnterTransition:(nextProps.CharacterList.length!==0&&this.props.CharacterList.length===0)});
		}
	}
	render() {
		return (
			<div className="CharacterContainer">
				<Row>
					<TransitionGroup
						transitionName="CharacterFade"
						transitionEnter={this.state.EnterTransition}
						transitionEnterTimeout={400}
						transitionLeave={true}
						transitionAppear={true}
						transitionAppearTimeout={400}
					>
						{
							this.props.CharacterList ?
								this.props.CharacterList.map((it, idx) => (
									<Col key={it.Name} span={24 / this.props.CharacterList.length}>
										<div className="CharacterImage" style={{backgroundImage:it.Path}}></div>
									</Col>
								), this)
								: null
						}
					</TransitionGroup>
				</Row>
			</div>
		);
	}
};
Character.propTypes = {
	Character: PropTypes.array.isRequired
}
export default Character;