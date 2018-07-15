let NowPlayingChapter=null;
let NowPlayingSection=null;
let NowBranch=null;
let FlowChartTree=null;
//现在是测试阶段,手动加载章节和setions.
// global.MyEngine = {};//新建一个全局节点,保存数据。
// global.MyEngine.StatusMachine = {};
const EventSets = require('./Events');
let event = require('events').EventEmitter;
var EventHandler = new event();
const{LoadChapterRes}=require('./LoadChapter');
const {LoadSectionRes} = require('./LoadSection');

EventHandler.on(EventSets.GET_SELECTED_PLAYING_SECTION,(dispatch,actionCtor,SelectedChapter,SelectedBranch,SelectedSection)=>{
    //测试用
    let chres = LoadChapterRes(SelectedChapter.Path,SelectedBranch);
    let secres = LoadSectionRes(chres.Branch.Sections,SelectedSection);
    dispatch(actionCtor(secres));
});

EventHandler.on(EventSets.GET_ALL_CHAPTERS,(dispatch,actionCtor,...args)=>{
    let tmp = window.electron.remote.getGlobal('MyEngine').StatusMachine.AllChapter;
    console.log(tmp);
    dispatch(actionCtor(tmp));
});



module.exports={EventHandler};

