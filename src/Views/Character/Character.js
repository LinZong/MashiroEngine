import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import './Character.less';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
class Character extends React.Component {
	constructor() {
		super(...arguments);
		//传入数组，通过数组长度计算Col 的span
		this.state = { EnterTransition: false, ColSpan: 24 / this.props.CharacterList.length };
		this.AdjustColSpan = this.AdjustColSpan.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.CharacterList && this.props.CharacterList) {
			let NeedAdjust = (nextProps.CharacterList.length > this.props.CharacterList.length);
			if(NeedAdjust){
				this.setState({EnterTransition:true,ColSpan:24 / nextProps.CharacterList.length});
			}
		}
	}
	AdjustColSpan() {
		this.setState({ ColSpan: 24 / this.props.CharacterList.length });
	}
	render() {
		return (
			<div className="CharacterContainer">
				<Row>
					<TransitionGroup appear={false} enter={true} exit={true}>
						{
							this.props.CharacterList ?
								this.props.CharacterList.map((it, idx) => (
									<CSSTransition
										key={it.Name}
										timeout={400}
										classNames="CharacterFade"
										onExited={this.AdjustColSpan}
									>
										<Col span={this.state.ColSpan} key={it.Name} >
											<div className={`CharacterImage`} >
												<img src={it.Path} alt={it.Name+"PlaceHolder"} className={it.Name} />
											</div>
										</Col>
									</CSSTransition>
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