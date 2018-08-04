import React from 'react'
import { Col } from 'antd';
import './SaveDataCard.css'
class SaveDataCard extends React.Component {
	render() {
		const {Cover,SaveTimeStamp,Title} = this.props;
		if(Cover&&SaveTimeStamp){
			return (
				<div className="CardFramework">
					<Col span={12}>
						<div className="ScreenShorImg">
							<img alt="这是当前游戏画面的截图" src={"file:///"+Cover} style={{width:"100%",height:"78%"}}/>
						</div>
					</Col>
					<Col span={12}>
						<div className="SaveDataInfo">
							<p className="TimeStamp">{SaveTimeStamp}</p>
							<p className="Text">{Title}</p>
						</div>
					</Col>
				</div>
			);
		}
		else return ("Relax"); 
	}
}
export default SaveDataCard;