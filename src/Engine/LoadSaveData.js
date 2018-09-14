/**
 * 以下的函数都应运行在渲染进程
 */
const Q = require('q');
const eventproxy = require('eventproxy');
const { Row, Col, Page } = window.electron.remote.getGlobal("Environment").SaveDataView;

function GetFsAndSaveDir() {
	let remote = window.electron.remote;
	let _fs = remote.require('fs');
	let _rimraf = remote.require('rimraf');
	let _SaveDataPath = remote.getGlobal('Environment').SaveDataDir;
	return { rimraf: _rimraf, fs: _fs, SaveDataPath: _SaveDataPath };
}
function GetAllSaveData(page) {
	const { fs, SaveDataPath } = GetFsAndSaveDir();
	let savearr = [];
	let dirarr = fs.readdirSync(SaveDataPath);
	let begin = page ? ((Row * Col) * (page - 1)) : 0;
	let end = page ? ((Row * Col) * (page)) : (Row * Col) * (Page);
	for (let i = 0; i < (end - begin); ++i) {
		savearr[i] = null;
	}

	dirarr.forEach((subdir) => {
		if (subdir === 'qsave') return;
		if ((begin <= parseInt(subdir, 10)) && (parseInt(subdir, 10) < end)) {
			let fullpath = SaveDataPath + '/' + subdir;
			let stat = fs.statSync(fullpath);
			if (stat.isDirectory()) {
				//探测存档是否完整
				if (fs.existsSync(fullpath + '/State.json') && fs.existsSync(fullpath + '/Cover.jpg')) {
					let data = fs.readFileSync(fullpath + '/State.json');
					savearr[parseInt(subdir, 10)-begin] = { State: JSON.parse(data), Cover: fullpath + '/Cover.jpg' };
				}
			}
		}
	});

	return savearr;
}
function GetQuickSaveData() {
	const { fs, SaveDataPath } = GetFsAndSaveDir();
	let fullpath = SaveDataPath + '/qsave';
	if (fs.existsSync(fullpath + '/State.json')) {
		let data = fs.readFileSync(fullpath + '/State.json');
		return JSON.parse(data);
	}
	return null;
}
function CreateSaveData(FolderIndex, StateJsonObj, callback, errcallback) {
	let CoverImgBuffer = StateJsonObj.Image;
	let RemoveBuffer = Object.assign({}, StateJsonObj);
	delete RemoveBuffer['Image'];
	const { fs, SaveDataPath } = GetFsAndSaveDir();
	let fullpath = SaveDataPath + '/' + FolderIndex.toString();
	if (!fs.existsSync(fullpath)) {
		fs.mkdirSync(fullpath);
	}
	//保存图片
	const ep = new eventproxy();
	ep.all('save_screenshot', 'save_state', function (data1, data2) {
		callback({ Cover: fullpath + '/Cover.jpg', State: RemoveBuffer });
	})
	fs.writeFile(fullpath + '/Cover.jpg', CoverImgBuffer.toJPEG(100), (err) => {
		if (err) return errcallback(err);
		else ep.emit('save_screenshot', '截屏保存完成');
	});
	let json = JSON.stringify(RemoveBuffer);
	fs.writeFile(fullpath + '/State.json', json, (err) => {
		if (err) return errcallback(err);
		else ep.emit('save_state', '存档文件保存完成');
	});
}
function CreateQuickSaveData(StateJsonObj) {
	var deferrer = Q.defer();
	let RemoveBuffer = Object.assign({}, StateJsonObj);
	delete RemoveBuffer['Image'];
	const { fs, SaveDataPath } = GetFsAndSaveDir();
	let fullpath = SaveDataPath + '/qsave';
	if (!fs.existsSync(fullpath)) {
		fs.mkdirSync(fullpath);
	}
	let json = JSON.stringify(RemoveBuffer);
	fs.writeFile(fullpath + '/State.json', json, (err) => {
		if (err) deferrer.reject(err);
		else deferrer.resolve({ State: RemoveBuffer });
	});
	return deferrer.promise;
}
function DeleteSaveData(FolderIndex) {
	var deferrer = Q.defer();
	const { rimraf, SaveDataPath } = GetFsAndSaveDir();
	let fullpath = SaveDataPath + '/' + FolderIndex.toString();
	rimraf(fullpath, (err) => {
		if (err) deferrer.reject(err);
		else deferrer.resolve('成功删除存档');
	});
	return deferrer.promise;
}

module.exports = { GetAllSaveData, CreateSaveData, DeleteSaveData, GetQuickSaveData, CreateQuickSaveData };