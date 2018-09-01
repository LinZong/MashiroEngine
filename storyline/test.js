const { LoadGlobalConfig } = require('../src/Engine/LoadConfig');
const { LoadAllChapters, LoadChapterRes } = require('../src/Engine/LoadChapter');
const { LoadSectionRes } = require('../src/Engine/LoadSection');
const { StoryMatrix } = require('../src/Engine/StoryMatrix');
LoadGlobalConfig();

let AllChapter = LoadAllChapters("D:\\electron-and-react\\electron-react\\res\\Resources\\Chapter");

let BranchSet = new Set([]);

for (let ele of AllChapter) {
    let res = LoadChapterRes(ele.Path);
    for (let index = 0; index < res.Branch.length; index++) {
        BranchSet.add(res.Branch[index].BranchTag);
    }
}
let StoryLineArray = [new StoryMatrix(2), new StoryMatrix(3), new StoryMatrix(10)];

function GetSectionName(chNum, br, secBegin = 0) {
    let ch = LoadChapterRes(AllChapter[chNum].Path, br);
    let sections = ch.Branch.Sections;
    for (let i = secBegin; i < sections.length; ++i) {
        let sec = LoadSectionRes(ch, i);
        StoryLineArray[chNum].place(i, i, sec.Header.SectionName);
        if (sec.Header.Special.HaveSelection) {
            let selection = null;
            for (let j = 0; j < sec.TextNodes.length; ++j) {
                if (sec.TextNodes[j].Selection) {
                    selection = sec.TextNodes[j].Selection;
                    break;
                }
            }
            if (selection) {
                StoryLineArray[chNum].place(i, i, { SectionName: sec.Header.SectionName, selection })
                for (let k = 0; k < selection.length; ++k) {
                    const { Chapter, Branch, Section } = selection[k].JumpTo;
                    if (Chapter === chNum) {
                        StoryLineArray[chNum].place(i, Section, 1);
                    }
                    GetSectionName(Chapter, Branch, Section);
                }
            }
        }
        else {
            if (i < sections.length - 1) {
                StoryLineArray[chNum].place(i, i + 1, 1);//表明连通边
            }
        }
    }
}
GetSectionName(0, 1);
console.log(StoryLineArray);