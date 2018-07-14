require('./LoadConfig');//To execute config loader
const {ChapterList,LoadChapterRes} = require('./LoadChapter');
const FileStream = require('fs');
const SectionResolver = require('./LoadSection');
/* Require this to read all chapter name */
let ch = LoadChapterRes(ChapterList[0].Path,1);
ch.Branch.Sections.forEach(element => {
    SectionResolver(JSON.parse(FileStream.readFileSync(element)));
});