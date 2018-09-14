import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import 'bulma/css/bulma.css';
import './WelcomeView.less';
import store from '../../Store';
import { LeaveGameView } from '../../Engine/actions/SectionActions';
import WelcomeScreen from 'electron-react-welcome';
import Modal from '../Modules/Modal/Modal';
const electron = window.electron;
class WelcomeView extends React.Component {
    constructor() {
        super(...arguments);
        const { FirstRun } = electron.remote.getGlobal('MyEngine');
        this.state = {
            WelcomePicsArr: ["file:///../../../res/Resources/Theme/UIResources/Framework/Pic0.png", "url(\"file:///../../../res/Resources/Theme/UIResources/Framework/Pic1.jpg\")"]
            ,  Fr: FirstRun,ModalVisible:false
        };
        this.handleClose=this.handleClose.bind(this);
        if (FirstRun) electron.remote.getGlobal('MyEngine').FirstRun = false;//获取是不是第一次运行
    }
    componentDidMount() {
        let GameViewData = store.getState().GameView;
        if (GameViewData.Section) {
            store.dispatch(LeaveGameView());
        }
        ReactDOM.unmountComponentAtNode(document.getElementById('music'));
    }
    handleClose(v){
        if(v===0){
            electron.remote.getCurrentWindow().close()
        }
        this.setState({ModalVisible:false});
    }
    render() {
        return (
            <WelcomeScreen on={false} last={2500} ScreenArray={this.state.WelcomePicsArr}>
                <div className="WelcomeContainer">
                    <Modal visible={this.state.ModalVisible} title="退出游戏" clickfunc={this.handleClose}>
                        真的要退出游戏吗
                    </Modal>
                    <div className="WelcomeBG" style={{ backgroundImage: "url(\"file:///../../../res/Resources/Theme/UIResources/Framework/WelcomeBG.png\")" }} />
                    <aside className="menu WelcomeMenu">
                        <ul className="menu-list nav_ul WelcomeMenuList">
                            <li>
                                <NavLink to='/chapters' id='START'><FormattedMessage id='START' /></NavLink>
                            </li>
                            <li>
                                <NavLink to='/savedata/load' id='LOADSAVEDATA'><FormattedMessage id='LOADSAVEDATA' /></NavLink>
                            </li>
                            <li>
                                <a id='FLOWCHART'><FormattedMessage id='FLOWCHART' /></a>
                            </li>
                            <li>
                                <a id='EXTRA'><FormattedMessage id='EXTRA' /></a>
                            </li>
                            <li>
                                <NavLink to='/NewSettings' id='SETTING'><li><FormattedMessage id='SETTING' /></li></NavLink>
                            </li>
                            <li>
                                <a id='EXITGAME' onClick={()=>this.setState({ModalVisible:true})}>退出游戏</a>
                            </li>
                        </ul>
                    </aside>
                </div>
            </WelcomeScreen>);
    }
}
export default WelcomeView;