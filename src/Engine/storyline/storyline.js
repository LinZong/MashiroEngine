
const { LoadChapterRes } = require('../../Engine/LoadChapter');
const { LoadSectionRes } = require('../../Engine/LoadSection');
const { StoryMatrix } = require('../../Engine/StoryMatrix');


let AllChapter = global.MyEngine.StatusMachine.AllChapter;
let BranchSet = new Set([]);
let StoryLineMap = null;


function GetSectionName(chNum, br, secBegin = 0) {
    let ch = LoadChapterRes(AllChapter[chNum].Path, br);
    let sections = ch.Branch.Sections;
    for (let i = secBegin; i < sections.length; ++i) {
        let sec = LoadSectionRes(ch, i);
        StoryLineMap.get(br)[chNum].place(i, i, sec.Header.SectionName);
        if (sec.Header.Special.HaveSelection) {
            let selection = null;
            for (let j = 0; j < sec.TextNodes.length; ++j) {
                if (sec.TextNodes[j].Selection) {
                    selection = sec.TextNodes[j].Selection;
                    break;
                }
            }
            if (selection) {
                StoryLineMap.get(br)[chNum].place(i, i, { SectionName: sec.Header.SectionName, selection })
                for (let k = 0; k < selection.length; ++k) {
                    const { Chapter, Branch, Section } = selection[k].JumpTo;
                    if (Chapter === chNum) {
                        StoryLineMap.get(br)[chNum].place(i, Section, 1);
                    }
                    GetSectionName(Chapter, Branch, Section);
                }
            }
        }
        else {
            if (i < sections.length - 1) {
                StoryLineMap.get(br)[chNum].place(i, i + 1, 1);//表明连通边
            }
        }
    }
}

function BuildStoryMap() {
    for (let brVal of BranchSet.values()) {
        for (let i = 0; i < AllChapter.length; ++i) {
            if (StoryLineMap.get(brVal)[i]) {
                GetSectionName(i, brVal);
            }
        }
    }
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

        for (let i of StoryLineMap.keys()) {//i is Branch, j is the index of AllChapter Array.
            let arr = [];
            let chapterarr = StoryLineMap.get(i);
            for (let j = 0; j < chapterarr.length; ++j) {
                let res = LoadChapterRes(AllChapter[j].Path, i);
                arr[j] = new StoryMatrix(res.Branch.Sections.length);
            }
            StoryLineMap.set(i, arr);
        }
        BuildStoryMap();
    }
    return StoryLineMap;//Must declared as const!;
}

module.exports = { GetStoryLine };