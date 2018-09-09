import React from 'react';
import store from '../../Store';
const { BacklogGenerator } = require('../../Engine/LoadSection');
class Backlog extends React.Component {
	constructor() {
		super(...arguments);
		this.state = { BacklogArr: null };
	}
	componentDidMount() {
		const CurrSection = store.getState().GameView.Section;
		if (CurrSection) {
			this.setState({ BacklogArr: BacklogGenerator(CurrSection) });
		}
	}
	render() {
		return (
			<div className="BacklogContainer">
				<p id="BacklogTitle">
					回顾
				</p>
				<div className="BacklogText">
					{
						this.state.BacklogArr ? this.state.BacklogArr.map((it, idx) => (<p key={idx} id="backlogtextp">{it}</p>), this) : null
					}
				</div>
			</div>
		)
	}
}

export default Backlog;