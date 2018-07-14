var FileStream = require('fs');
var ChapterDir = global.Environment.ChapterDir;
var ChapterList = [];
try {
    FileStream.readdirSync(ChapterDir).forEach(Subdir => {
        let ele = FileStream.statSync(ChapterDir + '/' + Subdir);
        if (ele.isDirectory()) {
            ChapterList.push({ "Name": Subdir, "Path": ChapterDir + '/' + Subdir });
        }
    });
    ChapterList = ChapterList.sort((a, b) => a.Name > b.Name);
} catch (error) {
    console.log("Cannot load all chapters.");
    console.log(error);
}

function LoadChapterRes(Path, Branch) {
    let RebuildChapterInfo=null;
    if (Path === undefined || Branch === undefined) console.log("Error");
    Path = Path + '/chapter.json';
    try {
        let ChapterInfo = JSON.parse(FileStream.readFileSync(Path));
        ChapterInfo.Branch.forEach(ele => {
            if (Branch == ele.BranchTag || Branch == ele.BranchName) {
                RebuildChapterInfo = ChapterInfo;
                RebuildChapterInfo.Branch = ele;
                throw "Finished";
            }
        });
    } catch (error) {
        if(error==="Finished") return RebuildChapterInfo;
        console.log(error);
        return null;
    }
    return null;
}
module.exports = {ChapterList,LoadChapterRes};