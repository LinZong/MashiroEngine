 import React from 'react';
import { Link } from 'react-router-dom'
import 'bulma/css/bulma.css'
import './WelcomeView.css'
const electron = window.electron;
class WelcomeView extends React.Component {
    constructor(props){
        super(props);
        this.welcomeRef=React.createRef();
        this.WelcomeImageAnimator=this.WelcomeImageAnimator.bind(this);
    }
    WelcomeImageAnimator(){
        var count = 0;
        let IntervalHandler = setInterval(()=>{if(0<=count&&count<=60){count++;this.welcomeRef.current.style.opacity = 1-(count/60);}},32);
        setTimeout(()=>{this.welcomeRef.current.style.zIndex=0;clearInterval(IntervalHandler)},3000);
    }
    componentDidMount(){
        //this.WelcomeImageAnimator();
    }
    render() {
        return (<div>
            <div className="WelcomeBG" ref={this.welcomeRef} style={{ backgroundImage: "url(\"file:///../../../res/Resources/Theme/UIResources/Framework/WelcomeBG.png\")" }} />
            <aside className="menu welcomemenu">
                <ul className="menu-list nav_ul">
                    <li>
                        <Link to='/chapters'><li>初めから</li></Link>
                    </li>
                    <li>
                        <a>続きから</a>
                    </li>
                    <li>
                        <a>フローチャート</a>
                    </li>
                    <li>
                        <a>特典</a>
                    </li>
                    <li>
                        <Link to='/settings'><li>設定</li></Link>
                    </li>
                    <li>
                        <a onClick={() => {
                            const options = {
                                type: "info",
                                message: "終了しますか？",
                                title: "終了確認",
                                buttons: ["はい", "キャンセル"],
                                cancelId:1
                            };
                            electron.remote.dialog.showMessageBox(null, options,
                                (response) => {
                                    if (response === 0) electron.remote.getCurrentWindow().close()
                                });
                        }}>終了</a>
                    </li>
                </ul>
            </aside>
        </div>);
    }
}
export default WelcomeView;