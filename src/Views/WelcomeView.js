import React, { Component } from 'react';
import { connect } from 'react-redux';
import './GameView.css';
import * as Status from '../Engine/Status';
import * as Actions from '../Engine/SectionActions'
import { Link } from 'react-router-dom';

class WelcomeView extends React.Component {
    constructor() {
        super(...arguments);
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
                            {this.props.ChapterList.map((item,idx) =>
                                (<Link key={idx} to=
                                    {{ pathname: '/section', state: { Chapter: item, Branch: 1, Section: 0, TextNodeBegin: 0 } }}>
                                    <li>{item.Name}</li></Link>
                                ))}
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
export default connect(mapStateToProps, mapDispatchToProps)(WelcomeView);