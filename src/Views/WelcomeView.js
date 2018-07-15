import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../logo.svg'
import './GameView.css';
import * as Status from '../Engine/Status';
import * as Actions from '../Engine/SectionActions'
import { Link } from 'react-router-dom';
const electron = window.electron;
class WelcomeView extends React.Component {
    constructor() {
        super(...arguments);
    }
    componentDidMount() {
        this.props.onLoadChapters();
    }
    render() {
        switch (this.props.status) {
            case Status.SUCCESS: {
                return (
                    <div className="App">
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <h1 className="App-title">全部章节</h1>
                        </header>
                        <div>
                            {this.props.ChapterList.map((item) => 
                                (<Link to=
                                {{ pathname: '/section', state: {Chapter:item,Branch:1,Section:0,TextNodeBegin:0} }}>
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
        status: state.status,
        ChapterList: state.ChapterList
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onLoadChapters: () => { dispatch(Actions.GetAllChapter()) }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WelcomeView);