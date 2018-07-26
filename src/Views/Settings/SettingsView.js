import React from 'react';
import {Link} from 'react-router-dom';
class SettingsView extends React.Component{

    render(){
        return (<Link to='/section'><li>回到游戏画面</li></Link>)
    }
}
export default SettingsView;