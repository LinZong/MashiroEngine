import React from 'react';
import CrossFade from '../../Character/Crossfade';
class ExtraCardImage extends React.Component{
    constructor(){
        super(...arguments);
        this.handleImageSwitch=this.handleImageSwitch.bind(this);
        this.state = {CurrentShowImage:0}//CurrentShow是ImageArray的Index;
    }
    componentDidMount(){
        if(!(this.props.Images)||(!(this.props.Images instanceof Array))){
            throw Error("必须传入需要显示的图片路径数组");
        }
    }
    handleImageSwitch(){
        this.setState({CurrentShowImage:(this.state.CurrentShowImage+1)%this.props.Images.length});
    }
    render(){
        return this.props.Images&&<CrossFade onClick={this.handleImageSwitch} src={this.props.Images[this.state.CurrentShowImage]} />;
    }
}

export default ExtraCardImage;