//现在是测试阶段,手动加载章节和setions.
// global.MyEngine = {};//新建一个全局节点,保存数据。
// global.MyEngine.StatusMachine = {};
const EventSets = require('./Events');
let event = require('events').EventEmitter;
var EventHandler = new event();
const { LoadChapterRes } = require('./LoadChapter');
const { LoadSectionRes } = require('./LoadSection');
var AllChapter = null;
var CurrentChapter = null;
var CurrentSectionsInChapter = null;
var CurrentSectionIndex=null;
EventHandler.on(EventSets.GET_SELECTED_PLAYING_SECTION, (dispatch, actionCtor, SelectedChapter, SelectedBranch, SelectedSection) => {
    //测试用
    CurrentChapter = LoadChapterRes(SelectedChapter.Path, SelectedBranch);
    CurrentSectionsInChapter = CurrentChapter.Branch.Sections;
    CurrentSectionIndex = SelectedSection;
    let secres = LoadSectionRes(CurrentSectionsInChapter, SelectedSection);
    dispatch(actionCtor(secres));
});

EventHandler.on(EventSets.GET_ALL_CHAPTERS, (dispatch, actionCtor,ErrorCtor) => {
    if(AllChapter===null) AllChapter =  window.electron.remote.getGlobal('MyEngine').StatusMachine.AllChapter;
    dispatch(actionCtor(AllChapter));
});

EventHandler.on(EventSets.ENTER_NEXT_SECTION,(dispatch,actionCtor,ErrorCtor)=>{
    let NowSection = CurrentSectionIndex;
    if(NowSection<CurrentSectionsInChapter.length){
        let secres = LoadSectionRes(CurrentSectionsInChapter,NowSection+1);
        CurrentSectionIndex++;
        dispatch(actionCtor(secres));
    }
});

module.exports = { EventHandler };

