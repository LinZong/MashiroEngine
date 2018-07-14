const { NEXT_NODE, PREV_NODE, SET_NODE_INDEX } = require('./SectionActionTypes');

let TextNodeIndexer = null;

function FindPrevText(Section,EndIndexer){
    while(Section.TextNodes[EndIndexer--].TextProperty.TextMode==='append');
    return EndIndexer+1;
}
function MakeRollBackProperty(NowPlayingSection,EndIndexer){
    let LastNewIndex = FindPrevText(NowPlayingSection,EndIndexer);
    let RollbackText="";
    for(var i=LastNewIndex;i<=TextNodeIndexer;++i){
        RollbackText+=NowPlayingSection.TextNodes[i].TextProperty.Text;
    }
    let NewPropertyObj = {...NowPlayingSection.TextNodes[EndIndexer].TextProperty,Text:RollbackText,TextMode:'new'};
    return NewPropertyObj;
}
function TextNodeInterpreter(NowPlayingSection,ev,callback) {
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
    if (TextNodeIndexer >= NowPlayingSection.TextNodes.length) window.alert("reach the end of section");
    if (TextNodeIndexer < 0) {
        TextNodeIndexer = 0;
        window.alert("reach the begin of section");
    }
    else if (TextNodeIndexer > NowPlayingSection.TextNodes.length - 1) {
        TextNodeIndexer=NowPlayingSection.TextNodes.length - 1;
        return;
    }
    if (0 <= TextNodeIndexer && TextNodeIndexer < NowPlayingSection.TextNodes.length) {
        callback(ev.type===PREV_NODE?
            MakeRollBackProperty(NowPlayingSection,TextNodeIndexer):
            NowPlayingSection.TextNodes[TextNodeIndexer].TextProperty);//测试用
            return ;
    }
    return null;
}
// function SectionResolver(SectionObject) {
//     LoadCustomScripts(SectionObject.Header.CustomScripts);
//     //LoadOrChangeResources(SectionObject.PreloadResources);
//     TextNodeInterpreter(SectionObject.TextNodes);
//     //Unload CustomScript
//     delete global.CustomScripts;
// }
function CustomFunctionAdapter(ExecuteFunctionArray) {
    ExecuteFunctionArray.forEach(element => {
        let Func = global.CustomScripts[element.Name];
        setTimeout(() => Func(...element.Parameter), element.ExecuteTime);
    });
}
function LoadCustomScripts(ScriptsPath) {
    global.CustomScripts = require(ScriptsPath);
}
module.exports = TextNodeInterpreter;
//渲染主进程同时维护着一个状态机，当LoadChapterRes发出事件的时候状态机定位到当前游玩的节点
//节点没有在存档树上的时候就append节点，SectionResolver发出进入Section的时候
//状态机根据当前的Chapter(Branch) Section状态修改状态树