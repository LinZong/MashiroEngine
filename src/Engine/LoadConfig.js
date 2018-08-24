//加载配置文件，初始化全局环境变量
const { LoadAllChapters } = require('./LoadChapter');
const { IMAGE_SETTING,
    TEXT_SETTING,
    SOUND_SETTING,
    CONTROLLER_SETTING,
    INGAME_SETTING, } = require('./actionTypes/SettingType');
const {ExtendJson} = require('./Util');
const Q  = require('q');
function LoadGlobalConfig() {
    try {
        let FileStream = require('fs');
        let Path = require('path');
        let Environment = JSON.parse(FileStream.readFileSync('./res/config/GlobalConfig.json'));
        Environment.AppPath = __dirname;
        Environment.Resolution["X"] = Environment.Resolution[0];
        Environment.Resolution["Y"] = Environment.Resolution[1];
        Environment.ChapterDir = './' + Path.join(Environment.Path.Root, Environment.Path.Resources.Chapter);
        Environment.CharacterDir = './' + Path.join(Environment.Path.Root, Environment.Path.Resources.Character);
        Environment.ThemeDir = './' + Path.join(Environment.Path.Root, Environment.Path.Resources.Theme);


        Environment.SaveDataDir = './' + Environment.Path.Savedata;

        Environment.Config = {};
        Environment.Config[IMAGE_SETTING] = {};
        Environment.Config[TEXT_SETTING] = {};
        Environment.Config[SOUND_SETTING] = {};

        Environment.Config[IMAGE_SETTING].Desc = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Image.Elements);
        Environment.Config[IMAGE_SETTING].Def = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Image.Default);
        Environment.Config[IMAGE_SETTING].User = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Image.User);
        

        Environment.Config[TEXT_SETTING].Desc = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Text.Elements);
        Environment.Config[TEXT_SETTING].Def = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Text.Default);
        Environment.Config[TEXT_SETTING].User = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Text.User);

        Environment.Config[SOUND_SETTING].Desc = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Sound.Elements);
        Environment.Config[SOUND_SETTING].Def = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Sound.Default);
        Environment.Config[SOUND_SETTING].User = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Sound.User);


        //占坑，以后肯定是要加载全局UI 资源的(Default or usersettings)
        Environment.UI = { LoadingImage: './' + Path.join(Environment.ThemeDir, 'UIResources\\Framework\\FakeLoading.jpg'),
                           SaveDataPlaceHolder : './' + Path.join(Environment.ThemeDir, 'UIResources\\Framework\\EmptySlot.png') };
        global.Environment = Environment;
        global.MyEngine = {};
        global.MyEngine.StatusMachine = {};
        global.MyEngine.StatusMachine.AllChapter = LoadAllChapters(Environment.ChapterDir);//测试加载所有章节.
        global.SettingsNode = {};
        for(var conf in Environment.Config){
            let p = Environment.Config[conf].User;
            let handle = FileStream.readFileSync(p);
            global.SettingsNode[conf] = JSON.parse(handle);
        }
        let characterFile = FileStream.readFileSync(Environment.CharacterDir+'/CharacterInfo.json');
        global.MyEngine.CharacterInfo = JSON.parse(characterFile);
    } catch (error) {
        throw error;
    }
}
function PathResolver(SettingType){
    var TargetPath = {};
    var ConfigPathNode = window.electron.remote.getGlobal('Environment').Config;
    switch (SettingType) {
        case IMAGE_SETTING: {
            TargetPath.Desc = ConfigPathNode[IMAGE_SETTING].Desc;
            TargetPath.Default = ConfigPathNode[IMAGE_SETTING].Def;
            TargetPath.User = ConfigPathNode[IMAGE_SETTING].User;
            break;
        }
        case TEXT_SETTING: {
            TargetPath.Desc = ConfigPathNode[TEXT_SETTING].Desc;
            TargetPath.Default = ConfigPathNode[TEXT_SETTING].Def;
            TargetPath.User = ConfigPathNode[TEXT_SETTING].User;
            break;
        }
        case SOUND_SETTING: {
            TargetPath.Desc = ConfigPathNode[SOUND_SETTING].Desc;
            TargetPath.Default = ConfigPathNode[SOUND_SETTING].Def;
            TargetPath.User = ConfigPathNode[SOUND_SETTING].User;
            break;
        }
        case CONTROLLER_SETTING: {
            TargetPath = ConfigPathNode.ImageConfigPath;
            break;
        }
        case INGAME_SETTING: {
            TargetPath = ConfigPathNode.ImageConfigPath;
            break;
        }
        default: TargetPath = {};
    }
    return TargetPath;
}

function LoadUserConfig(SettingType) {
    let fs = window.electron.remote.require('fs');
    let TargetPath = PathResolver(SettingType);

    let DescHandle = fs.readFileSync(TargetPath.Desc);
    let DefHandle = fs.readFileSync(TargetPath.Default);
    let UserHandle = fs.readFileSync(TargetPath.User);

    let DescJson = JSON.parse(DescHandle);
    let DefJson = JSON.parse(DefHandle);
    let UserJson = JSON.parse(UserHandle);

	return {Desc:DescJson,Settings:ExtendJson(DefJson,UserJson)};
}

function SaveUserConfig(SettingType,ConfigObj){
    var deferrer = Q.defer();
    let fs = window.electron.remote.require('fs');
    let TargetPath = PathResolver(SettingType);
    fs.writeFile(TargetPath.User,JSON.stringify(ConfigObj),(err)=>{
        if(err) {console.log(err);deferrer.reject('保存配置失败!');}
        else deferrer.resolve('保存配置成功!');
    });
    return deferrer.promise;
}

function GetSettingValue(SettingName,NewValue){
    let Config =  window.electron.remote.getGlobal('SettingsNode');
    if(Config){
        for(let name in Config){
            let element = Config[name].SettingElement;
            for(let key in element){
                for(let i=0;i<element[key].length;++i){
                    if(element[key][i].Name===SettingName){
                        if(NewValue){
                            let PrevValue = element[key][i].Value;
                            element[key][i].Value = NewValue;
                            return PrevValue;
                        }
                        return element[key][i].Value;
                    }
                }
            }
        }
    }
    return undefined;
}

module.exports = { LoadGlobalConfig, LoadUserConfig,SaveUserConfig ,GetSettingValue};