//返回远程调用的url路径,Only use in render process
//Because main process don't need this relax function.
import Path from 'path';
function GetRemoteUrlPath(OriginalPath){
    if(OriginalPath===null||OriginalPath===undefined){
        throw Error("Path being converted can't be empty.");
    }
    let AppPath = window.electron.remote.getGlobal('Environment').AppPath;
    return "url(\"file:///" + Path.join(AppPath, OriginalPath) + "\")"
}

export {GetRemoteUrlPath}