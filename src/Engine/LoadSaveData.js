/**
 * 以下的函数都应运行在渲染进程
 */
const Q = require('q');
function GetFsAndSaveDir() {
	let remote = window.electron.remote;
	let _fs = remote.require('fs');
	let _SaveDataPath = remote.getGlobal('Environment').SaveDataDir;
	return { fs: _fs, SaveDataPath: _SaveDataPath };
}
function GetAllSaveData() {
	const { fs, SaveDataPath } = GetFsAndSaveDir();
	let savearr = [];
	for (let i = 0; i < 9; ++i) {
		savearr[i] = null;
	}
	let dirarr = fs.readdirSync(SaveDataPath);
	dirarr.forEach((subdir) => {
		let fullpath = SaveDataPath + '/' + subdir;
		let stat = fs.statSync(fullpath);
		if (stat.isDirectory()) {
			//探测存档是否完整
			if (fs.existsSync(fullpath + '/State.json') && fs.existsSync(fullpath + '/Cover.png')) {
				let data = fs.readFileSync(fullpath + '/State.json');
				savearr[parseInt(subdir, 10)] = { State: JSON.parse(data), Cover: fullpath + '/Cover.png' };
			}
		}
	});
	return savearr;
}

function CreateSaveData(FolderIndex, CoverImgBuffer, StateJsonObj) {
	var deferrer = Q.defer();
	const { fs, SaveDataPath } = GetFsAndSaveDir();
	let fullpath = SaveDataPath + '/' + FolderIndex.toString();
	if (!fs.existsSync(fullpath)) {
		fs.mkdirSync(fullpath);
	}
	//保存图片
	try {
		let png = CoverImgBuffer.toPNG();
		fs.writeFile(fullpath + '/Cover.png', png);
		fs.writeFile(fullpath + '/State.json', JSON.stringify(StateJsonObj));
		deferrer.resolve("保存完成");
	} catch (err) {
		deferrer.reject(err);
	}
	//这样的话存档就能保存完了
	return deferrer.promise;
}

module.exports = { GetAllSaveData, CreateSaveData };