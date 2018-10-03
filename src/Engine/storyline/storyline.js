
const { LoadChapterRes } = require('../../Engine/LoadChapter');
const { LoadSectionRes } = require('../../Engine/LoadSection');
const { StoryMatrix } = require('../../Engine/StoryMatrix');


let AllChapter = (this === global) ? global.MyEngine.StatusMachine.AllChapter : window.electron.remote.getGlobal("MyEngine").StatusMachine.AllChapter;
let BranchSet = new Set();
let StoryLineMap = null;//这个是存最终处理后连通边和分支点信息
let StoryLineList = null;//这个是存最初故事线之间连通性
let StoryLineNode = [];
let StoryLineLinkData = [];
//Node 数据结构{key:{ch:xx,br:xx,sec:xx},text:"xxx"}
function GetSectionName(chNum, br, secBegin = 0) {
    let ch = LoadChapterRes(AllChapter[chNum].Path, br);
    let sections = ch.Branch.Sections;
    for (let i = secBegin; i < sections.length; ++i) {
        let sec = LoadSectionRes(ch, i);
        StoryLineMap.get(br)[chNum].place(i, i, sec.Header.SectionName);//原来构造Map
        StoryLineNode.push({ key: { Chapter: chNum, Branch: br, Section: i }, text: sec.Header.SectionName });

        if (sec.Header.Special.HaveSelection) {
            let selection = null;
            for (let j = 0; j < sec.TextNodes.length; ++j) {
                if (sec.TextNodes[j].Selection) {
                    selection = sec.TextNodes[j].Selection;
                    break;
                }
            }
            if (selection) {
                StoryLineMap.get(br)[chNum].place(i, i, { SectionName: sec.Header.SectionName, selection });
                //StoryLineNode[StoryLineNode.length-1] = {key:{Chapter:chNum,Branch:br,Section:i},text:sec.Header.SectionName}
                for (let k = 0; k < selection.length; ++k) {
                    const { Chapter, Branch, Section } = selection[k].JumpTo;
                    if (Chapter === chNum) {
                        StoryLineMap.get(br)[chNum].place(i, Section, 1);
                    }
                    StoryLineLinkData.push({ from: { Chapter: chNum, Branch: br, Section: i }, to: { Chapter: Chapter, Branch: Branch, Section: Section } });
                    GetSectionName(Chapter, Branch, Section);
                }
            }
        }
        else {
            if (i < sections.length - 1) {
                StoryLineMap.get(br)[chNum].place(i, i + 1, 1);//表明连通边
                StoryLineLinkData.push({ from: { Chapter: chNum, Branch: br, Section: i }, to: { Chapter: chNum, Branch: br, Section: i + 1 } });
            }
        }
    }
}

function BuildStoryMap() {
    //for (let brVal of BranchSet.values()) {
        // for (let i = 0; i < AllChapter.length; ++i) {
        //     if (StoryLineMap.get(brVal)[i]) {
        //         GetSectionName(i, brVal);
        //     }
        // }
        let chNumArr = StoryLineList.get(1);
        //for (let i = 0; i < chNumArr.length; ++i) {
        GetSectionName(chNumArr[0], 1);
       //}
    //}

    //对于一个文字游戏来说，从最开始往下进行dfs一定能够到达全部节点，不然就是设计问题。所以不需要重复循环遍历。
}

function GetStoryLine() {
    if (!StoryLineMap) {
        StoryLineMap = new Map();
        for (let i = 0; i < AllChapter.length; ++i) {
            let res = LoadChapterRes(AllChapter[i].Path);
            for (let index = 0; index < res.Branch.length; index++) {
                BranchSet.add(res.Branch[index].BranchTag);
                if (!StoryLineMap.has(res.Branch[index].BranchTag)) {
                    StoryLineMap.set(res.Branch[index].BranchTag, []);
                }
                StoryLineMap.get(res.Branch[index].BranchTag).push(i);
            }
        }
        StoryLineList = new Map(StoryLineMap);
        for (let i of StoryLineList.keys()) {//i is Branch, j is the index of AllChapter Array.
            //let map = new Map();
            let arr = [];
            let chapterarr = StoryLineList.get(i);
            for (let j = 0; j < chapterarr.length; ++j) {
                let res = LoadChapterRes(AllChapter[chapterarr[j]].Path, i);
                arr[chapterarr[j]] = new StoryMatrix(res.Branch.Sections.length);
                // map.set(chapterarr[j],new StoryMatrix(res.Branch.Sections.length));
            }
            StoryLineMap.set(i, arr);
        }

        BuildStoryMap();
    }
    return StoryLineMap;//Must declared as const!;
}
function GetFlowChartNodeData() {
    if (!StoryLineLinkData || !StoryLineNode) {
        GetStoryLine();
    }
    return { StoryLineNode, StoryLineLinkData };
}
module.exports = { GetStoryLine, GetFlowChartNodeData };