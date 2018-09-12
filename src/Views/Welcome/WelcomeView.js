import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import 'bulma/css/bulma.css';
import './WelcomeView.less';
import store from '../../Store';
import { LeaveGameView } from '../../Engine/actions/SectionActions';
import WelcomeScreen from 'electron-react-welcome';
const electron = window.electron;
class WelcomeView extends React.Component {
    constructor() {
        super(...arguments);
        const { FirstRun } = electron.remote.getGlobal('MyEngine');
        this.state = {
            WelcomePicsArr: ["url(\"file:///../../../res/Resources/Theme/UIResources/Framework/Pic0.png\")", "url(\"file:///../../../res/Resources/Theme/UIResources/Framework/Pic1.jpg\")"]
            ,  Fr: FirstRun
        };
        if (FirstRun) electron.remote.getGlobal('MyEngine').FirstRun = false;
    }
    componentDidMount() {
        let GameViewData = store.getState().GameView;
        if (GameViewData.Section) {
            store.dispatch(LeaveGameView());
        }
        ReactDOM.unmountComponentAtNode(document.getElementById('music'));
    }
    render() {
        return (
            <WelcomeScreen on={false} last={2500} ScreenArray={this.state.WelcomePicsArr}>
                <div className="WelcomeContainer">
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
                                <a id='EXITGAME' onClick={() => {
                                    const options = {
                                        type: "info",
                                        message: "終了しますか？",
                                        title: "終了確認",
                                        buttons: ["はい", "キャンセル"],
                                        cancelId: 1
                                    };
                                    electron.remote.dialog.showMessageBox(null, options,
                                        (response) => {
                                            if (response === 0) electron.remote.getCurrentWindow().close()
                                        });
                                }}>退出游戏</a>
                            </li>
                        </ul>
                    </aside>
                </div>
            </WelcomeScreen>);
    }
}
export default WelcomeView;