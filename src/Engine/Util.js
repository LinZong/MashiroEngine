//返回远程调用的url路径,Only use in render process
//Because main process don't need this relax function.
const Path = require('path');
var CharacterInfo = null;
function GetRemoteUrlPath(OriginalPath, NoUrl) {
	if (OriginalPath === null || OriginalPath === undefined || OriginalPath === "null" || OriginalPath === "undefined") {
		return null;
	}
	let AppPath = window.electron.remote.getGlobal('Environment').AppPath;
	if (NoUrl) return "file:///" + Path.join(AppPath, OriginalPath);
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
Array.prototype.top = function () { return this.length > 0 ? this[this.length - 1] : undefined };
Array.prototype.isEmpty=function(){return this.length===0};
Array.prototype.empty=function(){while(this.length>0)this.pop(); return this;};
function GetCharacterAlias(CharacterName) {
	if (!CharacterInfo) {
		CharacterInfo = window.electron.remote.getGlobal('MyEngine').CharacterInfo;
	}
	return CharacterInfo[CharacterName];
}
function copy(obj1, obj2) {
	var obj2 = obj2 || {}; //最初的时候给它一个初始值=它自己或者是一个json
	for (var name in obj1) {
		if (typeof obj1[name] === "object") { //先判断一下obj[name]是不是一个对象
			obj2[name] = (obj1[name].constructor === Array) ? [] : {}; //我们让要复制的对象的name项=数组或者是json
			copy(obj1[name], obj2[name]); //然后来无限调用函数自己 递归思想
		} else {
			obj2[name] = obj1[name];  //如果不是对象，直接等于即可，不会发生引用。
		}
	}
	return obj2; //然后在把复制好的对象给return出去
}
module.exports = { GetRemoteUrlPath, ExtendJson, GetCharacterAlias,copy };