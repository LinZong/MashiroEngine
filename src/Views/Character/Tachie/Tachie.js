import React from 'react';
import CrossfadeImage from '../Crossfade';
class Tachie extends React.Component {
    render() {
        return (
            <div className={`CharacterImage`}>
                    <CrossfadeImage ImgClassName={this.props.IMGClassName} src={this.props.Path} />
            </div>);
    }
}


export default Tachie;