import React from 'react';
import './Selection.css';
const Selection = (props) => {
	const { SelectionArray, onLoadSectionRes } = props;
	return (<div className="SelectionFlow">
		{SelectionArray.map((item, idx) =>
			(
				<button key={idx} className="button" onClick={() => {
					const { Chapter, Branch, Section } = item.JumpTo;
					onLoadSectionRes(Chapter, Branch, Section);
				}}>{item.Text}</button>
			)
		)}
	</div>)
};

export default Selection;