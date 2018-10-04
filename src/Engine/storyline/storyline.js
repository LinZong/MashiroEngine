
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
        StoryLineNode.push({ key: chNum.toString() + " " + br.toString() + " " + i.toString(), text: sec.Header.SectionName });

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
                    StoryLineLinkData.push({ from: chNum.toString() + " " + br.toString() + " " + i.toString(), to: Chapter.toString() + " " + Branch.toString() + " " + Section.toString() });
                    GetSectionName(Chapter, Branch, Section);
                }
            }
        }
        else {
            if (i < sections.length - 1) {
                StoryLineMap.get(br)[chNum].place(i, i + 1, 1);//表明连通边
                StoryLineLinkData.push({ from: chNum.toString() + " " + br.toString() + " " + i.toString(), to: chNum.toString() + " " + br.toString() + " " + (i + 1).toString() });
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
    let writeHelper = { StoryLineNode, StoryLineLinkData };
    //let fs = window.electron.remote.require('fs');
    //fs.writeFileSync("Relax.json",JSON.stringify(StoryLineMap));
    return writeHelper;
}
function ArrayifyMatrix() {
    //这个操作将会把整个Matrix变得可以持久化，可以使用JSON.stringify转化成文本
    let ArrayLikeMatrix = [];
    if (!StoryLineMap) {
        GetStoryLine();
    }
    for (let [k, v] of StoryLineMap) {
        let arrtmp = [];
        for(let i=0;i<v.length;++i)
        {
            arrtmp.push(v[i]?v[i].stringify():v[i]);
        }
        ArrayLikeMatrix.push([k,arrtmp]);
    }
    console.log(ArrayLikeMatrix);
    let relax = ParseMatrix(ArrayLikeMatrix);
    console.log(relax);
    return ArrayLikeMatrix;
}
function ParseMatrix() {
    //看看传的是string还是array
    if (arguments.length > 1) {
        throw Error("Cannot parse more than one argument.")
    }
    //如果都不是还得抛错
    let ArrayLikeMatrix = arguments[0] instanceof Array ? arguments[0] : JSON.parse(arguments[0]);
    for(let i of ArrayLikeMatrix){
        // i[1] = new StoryMatrix(i[1]);//把string转化成真实矩阵
        for(let k=0;k<i[1].length;++k){
            i[1][k] = i[1][k]?new StoryMatrix(i[1][k]):i[1][k];
        }
    }
    StoryLineMap = new Map(ArrayLikeMatrix);
    return StoryLineMap;
}
module.exports = { GetStoryLine, GetFlowChartNodeData,ArrayifyMatrix,ParseMatrix };