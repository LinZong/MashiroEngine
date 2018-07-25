const { NEXT_NODE, PREV_NODE, SET_NODE_INDEX } = require('./Events');
let TextNodeIndexer = null;
function FindPrevNewModeTextNode(Section, EndIndexer) {
    while (Section.TextNodes[EndIndexer--].TextProperty.TextMode === 'append');
    return EndIndexer + 1;
}
function MakeRollBackProperty(NowPlayingSection, EndIndexer) {
    let LastNewIndex = FindPrevNewModeTextNode(NowPlayingSection, EndIndexer);
    let RollbackText = "";
    for (var i = LastNewIndex; i <= TextNodeIndexer; ++i) {
        RollbackText += NowPlayingSection.TextNodes[i].TextProperty.Text;
    }
    let NewPropertyObj = { ...NowPlayingSection.TextNodes[EndIndexer].TextProperty, Text: RollbackText, TextMode: 'new' };
    return NewPropertyObj;
}
var MiddleWare = [CustomFunctionAdapter, TextBoxRender, SelectionRender, ParseStatusFlag];
//This callback should match the MiddleWareList correctly.

function TextNodeInterpreter(NowPlayingSection, ev, MiddleWareCallback) {
    switch (ev.type) {
        case NEXT_NODE: {
            TextNodeIndexer++;
            break;
        }
        case PREV_NODE: {
            TextNodeIndexer--;
            break;
        }
        case SET_NODE_INDEX: {
            TextNodeIndexer = ev.SetIndex;
            break;
        }
    }
    if (NowPlayingSection === null) return;
    let StatusFlag = null;/*
    正常状态下StatusFlag为null,到达Section结尾的时候会为1，到达Section开头会设为2
     */
    if (TextNodeIndexer < 0) {
        console.log('reach the begin of this section.');
        TextNodeIndexer = 0;
        StatusFlag = 2;
    }
    else if (TextNodeIndexer >= NowPlayingSection.TextNodes.length - 1) {
        console.log('reach the end of this section.');
        TextNodeIndexer = NowPlayingSection.TextNodes.length - 1;
        StatusFlag = 1;
    }
    if (0 <= TextNodeIndexer && TextNodeIndexer < NowPlayingSection.TextNodes.length) {
        let Content = ev.type === PREV_NODE || (ev.type === SET_NODE_INDEX && NowPlayingSection.TextNodes[TextNodeIndexer].TextProperty.TextMode === 'append') ?
            MakeRollBackProperty(NowPlayingSection, TextNodeIndexer) :
            NowPlayingSection.TextNodes[TextNodeIndexer].TextProperty;
        //SectionName:NowPlayingSection.Header.SectionName,
        let CurrNode = NowPlayingSection.TextNodes[TextNodeIndexer];
        CurrNode.TextProperty = Content;
        // CustomFunctionAdapter(CurrNode,MiddleWareCallback[0],StatusFlag);
        // TextBoxRender(CurrNode,MiddleWareCallback[1],StatusFlag);


        MiddleWare.map((item, idx) => ({ Func: item, Callback: MiddleWareCallback[idx] })).forEach(element => {
            element.Func(CurrNode, element.Callback, { Index: TextNodeIndexer, Flag: StatusFlag });
        });
        return;
    }
}


function CustomFunctionAdapter(TextNodeObj, callback, StatusObj) {
    if (TextNodeObj.ExecuteFunction !== undefined) {
        let FuncArray = TextNodeObj.ExecuteFunction;
        FuncArray.forEach(element => {
            // let Func = global.CustomScripts[element.Name];
            // setTimeout(() => Func(...element.Parameter), element.ExecuteTime);
            console.log('Should execute function : ', element.Name);
        });
    }
}

function TextBoxRender(TextNodeObj, callback, StatusObj) {
    if (TextNodeObj.TextProperty !== undefined) {
        let TextContentForApply = { TextContent: TextNodeObj.TextProperty };
        if (typeof callback === 'function') {
            callback(TextContentForApply);
        }
    }
}
function SelectionRender(TextNodeObj, callback, StatusObj) {
    if (typeof callback === 'function') {
        if (TextNodeObj.Selection !== undefined) {
            callback(TextNodeObj.Selection);
        }
        else callback(null);
    }
}
function ParseStatusFlag(TextNodeObj, callback, StatusObj) {
    if (typeof callback === 'function') {
        callback(StatusObj);
    }
}


function LoadSectionRes(ChapterNode, Indexer) {
    let fs = window.electron.remote.require('fs');
    let SectionJsonPath = ChapterNode.Branch.Sections[Indexer];
    try {
        let res = JSON.parse(fs.readFileSync(SectionJsonPath));
        res.LoadingImage = ChapterNode.Branch.LoadingImage;
        return res;
    } catch (error) {
        console.log(error);
        return null;
    }
}
// function CustomFunctionAdapter(ExecuteFunctionArray) {
//     ExecuteFunctionArray.forEach(element => {
//         let Func = global.CustomScripts[element.Name];
//         setTimeout(() => Func(...element.Parameter), element.ExecuteTime);
//     });
// }
// function LoadCustomScripts(ScriptsPath) {
//     global.CustomScripts = require(ScriptsPath);
// }
module.exports = { TextNodeInterpreter, LoadSectionRes, MiddleWare };
//渲染主进程同时维护着一个状态机，当LoadChapterRes发出事件的时候状态机定位到当前游玩的节点
//节点没有在存档树上的时候就append节点，SectionResolver发出进入Section的时候
//状态机根据当前的Chapter(Branch) Section状态修改状态树