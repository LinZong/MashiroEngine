//现在是测试阶段,手动加载章节和setions.
// global.MyEngine = {};//新建一个全局节点,保存数据。
// global.MyEngine.StatusMachine = {};
const EventsType = require('./Events');
let event = require('events').EventEmitter;
var EventHandler = new event();
const { LoadChapterRes } = require('./LoadChapter');
const { LoadSectionRes } = require('./LoadSection');



var AllChapter = null;
var CurrentChapter = null;
var CurrentBranch = null;
var CurrentSectionIndex = null;

const DispatchSectionJson = (dispatch, actionCtor) => (ChapterInfoObj, SectionIndex) => {
    let secres = LoadSectionRes(ChapterInfoObj, SectionIndex);
    dispatch(actionCtor(secres));
}

EventHandler.on(EventsType.GET_SELECTED_PLAYING_SECTION, (dispatch, actionCtor, SelectedChapter, SelectedBranch, SelectedSection) => {
    //测试用
    if (typeof SelectedChapter === 'number') SelectedChapter = AllChapter[SelectedChapter];
    let TmpChapter = LoadChapterRes(SelectedChapter.Path, SelectedBranch);
    if (TmpChapter !== null) {
        let CurrChapterIndex = 0;
        for (let i = 0; i < AllChapter.length; ++i) {
            if (AllChapter[i] === SelectedChapter) {
                CurrChapterIndex = i;
                TmpChapter.Index = i;
                break;
            }
        }
        CurrentChapter = TmpChapter;//是一个存章节信息的Object
        CurrentSectionIndex = SelectedSection;//选择了的Section数组Index
        CurrentBranch = SelectedBranch;//选择的Branch号
        DispatchSectionJson(dispatch, actionCtor)(CurrentChapter, CurrentSectionIndex);
    }
});

function GetAllChapter(){
    if (AllChapter === null) AllChapter = window.electron.remote.getGlobal('MyEngine').StatusMachine.AllChapter;
    return (AllChapter);
}

EventHandler.on(EventsType.ENTER_NEXT_SECTION, (dispatch, actionCtor, ErrorCtor) => {
    let NowSection = CurrentSectionIndex;
    if (NowSection < CurrentChapter.Branch.Sections.length - 1) {
        CurrentSectionIndex++;
        DispatchSectionJson(dispatch, actionCtor)(CurrentChapter, NowSection + 1);
    }
    else {
        EventHandler.emit(EventsType.ENTER_NEXT_CHAPTER, dispatch, actionCtor);
    }
});

EventHandler.on(EventsType.ENTER_NEXT_CHAPTER, (dispatch, actionCtor) => {
    let CurrChapterIndex = CurrentChapter.Index;
    let AllChapterLength = AllChapter.length;
    if (CurrChapterIndex < AllChapterLength - 1) {
        EventHandler.emit(EventsType.GET_SELECTED_PLAYING_SECTION, dispatch, actionCtor, AllChapter[CurrChapterIndex + 1], CurrentBranch, 0);
    }
});
EventHandler.on(EventsType.LOAD_SAVEDATA, (SaveDataInfo, dispatch, actionCtor) => {
    CurrentChapter = SaveDataInfo.PrevInfo.CurrentChapter;
    CurrentBranch = SaveDataInfo.PrevInfo.CurrentBranch;
    CurrentSectionIndex = SaveDataInfo.PrevInfo.CurrentSectionIndex;
    AllChapter=SaveDataInfo.PrevInfo.AllChapter;
    DispatchSectionJson(dispatch, actionCtor)(CurrentChapter, CurrentSectionIndex);
});



function GetGlobalVar() {
    return { AllChapter, CurrentChapter, CurrentBranch, CurrentSectionIndex };
}
module.exports = { EventHandler, GetGlobalVar,GetAllChapter };

