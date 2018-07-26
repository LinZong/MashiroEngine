function LoadAllChapters(ChapterDir) {
    let ChapterList = [];
    let FileStream = require('fs');//这个是在主进程运行的,直接require原生模块即可
    try {
        FileStream.readdirSync(ChapterDir).forEach(Subdir => {
            let ele = FileStream.statSync(ChapterDir + '/' + Subdir);
            if (ele.isDirectory()) {
                ChapterList.push({ "Name": Subdir, "Path": ChapterDir + '/' + Subdir });
            }
        });
        ChapterList = ChapterList.sort((a, b) => a.Name > b.Name);
        return ChapterList;
    } catch (error) {
        console.log("Cannot load all chapters.");
        console.log(error);
    }
}
function LoadChapterRes(Path, Branch) {
    let RebuildChapterInfo = null;
    let fs = window.electron.remote.require('fs');//这个是在渲染进程做调用的，需要做远程调用。
    if (Path === undefined || Branch === undefined) {
        throw Error('Path or Branch cannot be null or undefined!');
    }
    Path = Path + '/chapter.json';
    let ChapterInfo = JSON.parse(fs.readFileSync(Path));
    let AllBranch = ChapterInfo.Branch;
    //Support find by tag or by name.
    for (let i = 0; i < AllBranch.length; i++) {
        if (Branch === AllBranch[i].BranchTag || Branch === AllBranch[i].BranchName) {
            RebuildChapterInfo = ChapterInfo;
            RebuildChapterInfo.Branch = AllBranch[i];
            RebuildChapterInfo.BranchIndex = i;
        }
    }
    return RebuildChapterInfo;
}
module.exports = { LoadAllChapters, LoadChapterRes };