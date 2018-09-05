import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import 'bulma/css/bulma.css'
import './WelcomeView.less'
import store from '../../Store';
import { LeaveGameView } from '../../Engine/actions/SectionActions';
import TransitionGroup from 'react-addons-css-transition-group';
const electron = window.electron;
class WelcomeView extends React.Component {
    constructor() {
        super(...arguments);
        this.WelcomeContainerRef = React.createRef();
        this.WelcomeImageAnimator = this.WelcomeImageAnimator.bind(this);
        this.state = {
            WelcomePicsArr: ["url(\"file:///../../../res/Resources/Theme/UIResources/Framework/Pic0.png\")", "url(\"file:///../../../res/Resources/Theme/UIResources/Framework/Pic1.jpg\")"]
            , CurrentWelcomePic: null
        };
    }
    WelcomeImageAnimator(PicNum) {
        if(PicNum<this.state.WelcomePicsArr.length){
            this.setState({CurrentWelcomePic:this.state.WelcomePicsArr[PicNum]});
            setTimeout(()=>{
                this.setState({CurrentWelcomePic:""});
                setTimeout(()=>{
                    this.WelcomeImageAnimator(PicNum+1);
                },800);
            },2700);
        }
        else{
            document.getElementById("WelcomePics").style.display="none";
            this.WelcomeContainerRef.current.style.display="block";
            window.electron.remote.getGlobal('MyEngine').FirstRun=false;
        }
    }
    componentDidMount() {
        let GameViewData = store.getState().GameView;
        if (GameViewData.Section) {
            store.dispatch(LeaveGameView());
        }
        ReactDOM.unmountComponentAtNode(document.getElementById('music'));
        const {FirstRun} = window.electron.remote.getGlobal('MyEngine');
        if(FirstRun){
            this.WelcomeImageAnimator(0);
        }
        else{
            document.getElementById("WelcomePics").style.display="none";
            this.WelcomeContainerRef.current.style.display="block";
        }
    }
    render() {
        return (<div className="WelcomeRoot">
            <TransitionGroup
                transitionName="WelcomeBGFade"
                transitionEnterTimeout={700}
                transitionLeave={true}
                transitionAppear={false}
                transitionAppearTimeout={700}
            >
                {
                    <div id="WelcomePics" key={this.state.CurrentWelcomePic+"DiffPrev"} style={{ backgroundImage: this.state.CurrentWelcomePic }} />
                }
            </TransitionGroup>
            <div className="WelcomeContainer" ref={this.WelcomeContainerRef}>
                <div className="WelcomeBG" style={{ backgroundImage: "url(\"file:///../../../res/Resources/Theme/UIResources/Framework/WelcomeBG.png\")" }} />
                <aside className="menu welcomemenu">
                    <ul className="menu-list nav_ul" id="MenuButton">
                        <li>
                            <NavLink to='/chapters'><FormattedMessage id='START' /></NavLink>
                        </li>
                        <li>
                            <NavLink to='/savedata/load'><FormattedMessage id='LOADSAVEDATA' /></NavLink>
                        </li>
                        <li>
                            <a><FormattedMessage id='FLOWCHART' /></a>
                        </li>
                        <li>
                            <a><FormattedMessage id='EXTRA' /></a>
                        </li>
                        <li>
                            <NavLink to='/NewSettings'><li><FormattedMessage id='SETTING' /></li></NavLink>
                        </li>
                        <li>
                            <a onClick={() => {
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
        </div>);
    }
}
export default WelcomeView;