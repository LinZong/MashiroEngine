//加载配置文件，初始化全局环境变量
const { LoadAllChapters } = require('./LoadChapter');
const { IMAGE_SETTING,
    TEXT_SETTING,
    SOUND_SETTING,
    CONTROLLER_SETTING,
    INGAME_SETTING, } = require('./actionTypes/SettingType');
const { ExtendJson } = require('./Util');
const { ApplySetting } = require('../Engine/actions/SettingActions');
const Q = require('q');
// const path = require('path');
// const eventproxy = require('eventproxy');
let remoteFs = null;
let store = null;
function GetRemoteFs() {
    if (!remoteFs) remoteFs = window.electron.remote.require('fs');
    return remoteFs;
}
function GetStore() {
    if (!store) store = require('../Store').default;
    return store;
}
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
       // "./res/Resources/Character/CharacterInfo.json"
        Environment.Config[IMAGE_SETTING].Desc = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Image.Elements);
        Environment.Config[IMAGE_SETTING].Default = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Image.Default);
        Environment.Config[IMAGE_SETTING].User = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Image.User);


        Environment.Config[TEXT_SETTING].Desc = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Text.Elements);
        Environment.Config[TEXT_SETTING].Default = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Text.Default);
        Environment.Config[TEXT_SETTING].User = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Text.User);

        Environment.Config[SOUND_SETTING].Desc = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Sound.Elements);
        Environment.Config[SOUND_SETTING].Default = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Sound.Default);
        Environment.Config[SOUND_SETTING].User = './' + Path.join(Environment.Path.Config.Root, Environment.Path.Config.Resources.Sound.User);


        //占坑，以后肯定是要加载全局UI 资源的(Default or usersettings)
        Environment.UI = {
            LockedCG :'./' + Path.join(Environment.ThemeDir, 'UIResources\\Framework\\CGLocked.png'),
            LoadingImage: './' + Path.join(Environment.ThemeDir, 'UIResources\\Framework\\FakeLoading.jpg'),
            SaveDataPlaceHolder: './' + Path.join(Environment.ThemeDir, 'UIResources\\Framework\\EmptySlot.png')
        };
        
        global.Environment = Environment;
        global.MyEngine = { StatusMachine: {}, FirstRun: true };
        global.MyEngine.StatusMachine.AllChapter = LoadAllChapters(Environment.ChapterDir);//测试加载所有章节.
        //global.MyEngine.StatusMachine.StoryLine = require('./storyline/storyline').GetStoryLine();

        //加载角色信息.

        global.Character = JSON.parse(FileStream.readFileSync(Path.resolve(Environment.CharacterDir,"CharacterInfo.json")));

        global.SettingsNode = {};
        global.CustomModuleData = {};
        for (var conf in Environment.Config) {
            let p = Environment.Config[conf].User;
            let handle = FileStream.readFileSync(p);
            let node = JSON.parse(handle);
            global.SettingsNode[conf] = node;
            if (node.CustomSettingElement) {
                for (let i of node.CustomSettingElement) {
                    LoadCustomModuleData(i.Name, i.DataPath);
                }
            }
        }

    } catch (error) {
        throw error;
    }
}
function PathResolver(SettingType) {
    var ConfigPathNode = window.electron.remote.getGlobal('Environment').Config;
   const {Desc,Default,User} =  ConfigPathNode[SettingType];
    return {Desc,Default,User};
}

function LoadCustomModuleData(NodeName, DataPath) {
    let DataArr = [];
    let fs = require('fs');
    DataPath.forEach(p => {
        DataArr.push(JSON.parse(fs.readFileSync(p)));
    });
    global.CustomModuleData[NodeName] = DataArr;
}

function LoadUserConfig(SettingType) {
    let fs = GetRemoteFs();
    let TargetPath = PathResolver(SettingType);

    let DescHandle = fs.readFileSync(TargetPath.Desc);
    let DefHandle = fs.readFileSync(TargetPath.Default);
    let UserHandle = fs.readFileSync(TargetPath.User);

    let DescJson = JSON.parse(DescHandle);
    let DefJson = JSON.parse(DefHandle);
    let UserJson = JSON.parse(UserHandle);

    return { Desc: DescJson, Settings: ExtendJson(DefJson, UserJson) };
}

function SaveUserConfig(SettingType, ConfigObj) {
    let deferrer = Q.defer();
    let fs = GetRemoteFs();
    let Store = GetStore();
    Store.dispatch(ApplySetting(SettingType, ConfigObj));
    let TargetPath = PathResolver(SettingType);
    fs.writeFile(TargetPath.User, JSON.stringify(ConfigObj), (err) => {
        if (err) { console.log(err); deferrer.reject('保存配置失败!'); }
        else deferrer.resolve('保存配置成功!');
    });
    return deferrer.promise;
}

function SaveCustomProfile(ProfileName, ProfilePath, ProfileObj) {
    let deferrer = Q.defer();
    let fs = GetRemoteFs();
    let Store = GetStore();
    try {
        for (let i = 0; i < ProfilePath.length; ++i) {
            fs.writeFileSync(ProfilePath[i], JSON.stringify(ProfileObj[i]));
        }
    } catch (error) {
        return deferrer.reject(error);
    }
    Store.dispatch(ApplySetting(ProfileName, ProfileObj));
    deferrer.resolve("全部数据写入完成");
    return deferrer.promise;
}

function ResetToDefaultConfig(SettingType) {
    let fs = GetRemoteFs();
    let TargetPath = PathResolver(SettingType);
    let DefHandle = fs.readFileSync(TargetPath.Default);
    let DefJson = JSON.parse(DefHandle);
    return SaveUserConfig(SettingType, DefJson);
}

function GetSettingValue(SettingName, SearchObj) {
    let Config = SearchObj || window.electron.remote.getGlobal('SettingsNode');
    if (Config) {
        for (let name in Config) {
            let element = Config[name].SettingElement;
            for (let key in element) {
                for (let i = 0; i < element[key].length; ++i) {
                    if (element[key][i].Name === SettingName) {
                        return element[key][i].Value;
                    }
                }
            }
        }
    }
    return undefined;
}


module.exports = { LoadGlobalConfig, LoadUserConfig, SaveUserConfig, GetSettingValue, ResetToDefaultConfig, SaveCustomProfile };