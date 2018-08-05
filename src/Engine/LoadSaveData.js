/**
 * 以下的函数都应运行在渲染进程
 */
const Q = require('q');
function GetFsAndSaveDir() {
	let remote = window.electron.remote;
	let _fs = remote.require('fs');
	let _rimraf = remote.require('rimraf');
	let _SaveDataPath = remote.getGlobal('Environment').SaveDataDir;
	return { rimraf:_rimraf, fs: _fs, SaveDataPath: _SaveDataPath };
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

function CreateSaveData(FolderIndex, StateJsonObj) {
	var deferrer = Q.defer();
	let CoverImgBuffer = StateJsonObj.Image;
	let RemoveBuffer = Object.assign({},StateJsonObj);
	delete RemoveBuffer['Image'];
	const { fs, SaveDataPath } = GetFsAndSaveDir();
	let fullpath = SaveDataPath + '/' + FolderIndex.toString();
	if (!fs.existsSync(fullpath)) {
		fs.mkdirSync(fullpath);
	}
	//保存图片
	let png = CoverImgBuffer.toPNG();
	fs.writeFile(fullpath + '/Cover.png', png, (err) =>{
		if(err) deferrer.reject(err);
		else console.log('截屏保存完成')
	});
	let json = JSON.stringify(RemoveBuffer);
	fs.writeFile(fullpath + '/State.json', json , (err) => {
		if(err)deferrer.reject(err);
		else console.log('存档文件保存完成');
	});
	deferrer.resolve({Cover:fullpath + '/Cover.png',State:RemoveBuffer});
	return deferrer.promise;
}

function DeleteSaveData(FolderIndex) {
	var deferrer = Q.defer();
	const { rimraf,SaveDataPath } = GetFsAndSaveDir();
	let fullpath = SaveDataPath + '/' + FolderIndex.toString();
	rimraf(fullpath,(err)=>{
		if(err) deferrer.reject(err);
		else deferrer.resolve('成功删除存档');
	});
	return deferrer.promise;
}

module.exports = { GetAllSaveData, CreateSaveData,DeleteSaveData };