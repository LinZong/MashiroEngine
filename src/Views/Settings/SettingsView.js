import React from 'react';
import {Link} from 'react-router-dom';
class SettingsView extends React.Component{

    render(){
        return (<div>
            <Link to='/section'><li>回到游戏画面</li></Link>
            <Link to='/'><li>回到主界面</li></Link>
        </div>)
    }
}
export default SettingsView;