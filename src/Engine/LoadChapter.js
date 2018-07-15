

function LoadAllChapters(ChapterDir) {
    let ChapterList = [];
    let FileStream = require('fs');
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
    let fs = window.electron.remote.require('fs');
    if (Path === undefined || Branch === undefined) console.log("Error");
    Path = Path + '/chapter.json';
    try {
        let ChapterInfo = JSON.parse(fs.readFileSync(Path));
        ChapterInfo.Branch.forEach(ele => {
            if (Branch == ele.BranchTag || Branch == ele.BranchName) {
                RebuildChapterInfo = ChapterInfo;
                RebuildChapterInfo.Branch = ele;
                throw "Finished";
            }
        });
    } catch (error) {
        if (error === "Finished") return RebuildChapterInfo;
        console.log(error);
        return null;
    }
    return null;
}
module.exports = { LoadAllChapters, LoadChapterRes };