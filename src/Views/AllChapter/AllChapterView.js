import React from 'react';
import { connect } from 'react-redux';
import '../GameView/GameView.css';
import * as Status from '../../Engine/Status';
import * as Actions from '../../Engine/SectionActions'
import { Link } from 'react-router-dom';
const fs = window.electron.remote.require('fs');
class AllChapterView extends React.Component {
    constructor(){
        super(...arguments);
        this.TestSaveInfo = null;
        let res = fs.readFileSync('relax.txt');
        this.TestSaveInfo = JSON.parse(res);
    }
    componentDidMount() {
        this.props.onLoadChapters();
    }
    render() {
        switch (this.props.WelcomeViewStatus) {
            case Status.SUCCESS: {
                return (
                    <div className="App">
                        <header className="App-header">
                            <h1 className="App-title">全部章节</h1>
                        </header>
                        <div>
                            {this.props.ChapterList.map((item, idx) =>
                                (<Link key={idx} to=
                                    {{ pathname: '/section', state: { Chapter: item, Branch: 1, Section: 0, TextNodeBegin: 0 } }}>
                                    <li>{item.Name}</li></Link>
                                ))}
                            <Link key={3} to=
                                {{ pathname: '/section', state: {SaveInfo:this.TestSaveInfo } }}>
                                <li>测试存档加载</li></Link>
                        </div>
                    </div>
                );
            }
            default: return (null);
        }

    }
}
const mapStateToProps = (state) => {
    return {
        WelcomeViewStatus: state.Welcome.status,
        ChapterList: state.Welcome.ChapterList
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onLoadChapters: () => { dispatch(Actions.GetAllChapter()) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AllChapterView);