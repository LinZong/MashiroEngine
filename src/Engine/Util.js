//返回远程调用的url路径,Only use in render process
//Because main process don't need this relax function.
const Path = require('path');
function GetRemoteUrlPath(OriginalPath,NoUrl){
    if(OriginalPath===null||OriginalPath===undefined||OriginalPath==="null"||OriginalPath==="undefined"){
        return null;
    }
	let AppPath = window.electron.remote.getGlobal('Environment').AppPath;
	if(NoUrl) return "file:///" + Path.join(AppPath, OriginalPath);
	return "url(\"file:///" + Path.join(AppPath, OriginalPath) + "\")"
    
}
function ExtendJson(Def, User) {
	var Res = Object.assign({}, Def);
	const ApplyNode = (DefCol, UserCol, DestCol) => {
		if (DefCol && DefCol instanceof Array) {
			for (let i = 0; i < DefCol.length; ++i) {
				for (let j = 0; j < UserCol.length; j++) {
					if (UserCol[j].Name === DefCol[i].Name) {
						DestCol[i].Value = UserCol[j].Value;
						break;
					}
				}
			}
		}
	}
	ApplyNode(Def.SettingElement.LeftCol, User.SettingElement.LeftCol, Res.SettingElement.LeftCol);
	ApplyNode(Def.SettingElement.RightCol, User.SettingElement.RightCol, Res.SettingElement.RightCol);
	return Res;
}
module.exports =  {GetRemoteUrlPath,ExtendJson};