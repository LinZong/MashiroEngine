import React from 'react';
import '../GameView/GameView.css';
import * as Status from '../../Engine/Status';
import {GetAllChapter} from '../../Engine/StatusMachine';
import { Link } from 'react-router-dom';
class AllChapterView extends React.Component {
    constructor(){
        super(...arguments);
        this.state = {WelcomeViewStatus:'loading',ChapterList:null};
    }
    componentDidMount() {
        let allchapter = GetAllChapter();
        this.setState({WelcomeViewStatus:'success',ChapterList:allchapter});
    }
    render() {
        switch (this.state.WelcomeViewStatus) {
            case Status.SUCCESS: {
                return (
                    <div className="App">
                        <header className="App-header">
                            <h1 className="App-title">全部章节</h1>
                        </header>
                        <div>
                            {this.state.ChapterList.map((item, idx) =>
                                (<Link key={idx} to=
                                    {{ pathname: '/section/new', state: { Chapter: item, Branch: 1, Section: 0, TextNodeBegin: 0 } }}>
                                    <li>{item.Name}</li></Link>
                                ))}
                                <button onClick={()=>this.props.history.push('/',{Test:"Relax"})}>大概是返回吧</button>
                                
                        </div>
                    </div>
                );
            }
            default: return (null);
        }
//原来Link也可以这样写hhh
    }
}
export default (AllChapterView);