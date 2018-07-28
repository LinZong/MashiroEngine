import React from 'react';
import {Link} from 'react-router-dom';
import store from '../../Store';
var fs = window.electron.remote.require('fs');
class SettingsView extends React.Component{
    constructor(){
        super(...arguments);
        this.LocalPersistState=this.LocalPersistState.bind(this);
    }
    LocalPersistState(){
        console.log(store.getState());
        let star = store.getState().GameView.PrevState;
        let jsonObj = JSON.stringify(star);
        fs.writeFile('relax.txt',jsonObj,()=>console.log('OK'));

    }
    render(){
        return (<div>
            <Link to='/section'><li>回到游戏画面</li></Link>
            <Link to='/'><li>回到主界面</li></Link>
            <button className="button is-primary" onClick={this.LocalPersistState}>获取全Store状态</button>
            
        </div>)
    }
}
export default SettingsView;