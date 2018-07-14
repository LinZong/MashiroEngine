let NowPlayingChapter=null;
let NowPlayingSection=null;
let NowBranch=null;
let FlowChartTree=null;
//现在是测试阶段,手动加载章节和setions.

var FileStream = require('fs');
const {ChapterList,LoadChapterRes}=require('./LoadChapter');
NowPlayingChapter=LoadChapterRes(ChapterList[0].Path,NowBranch=1);
NowPlayingSection=JSON.parse(FileStream.readFileSync(NowPlayingChapter.Branch.Sections[0]));

module.exports={NowPlayingChapter,NowPlayingSection};