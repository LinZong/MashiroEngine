//加载配置文件，初始化全局环境变量
var FileStream = require('fs');
var Path = require('path');

function LoadGlobalConfig() {
    try {
        let Environment = JSON.parse(FileStream.readFileSync('./res/config/GlobalConfig.json'));
        Environment.Resolution["X"] = Environment.Resolution[0];
        Environment.Resolution["Y"] = Environment.Resolution[1];
        Environment.ChapterDir = './'+Path.join(Environment.Path.Root, Environment.Path.Resources.Chapter);
        Environment.CharacterDir = './'+Path.join(Environment.Path.Root, Environment.Path.Resources.Character);
        Environment.ThemeDir = './'+Path.join(Environment.Path.Root, Environment.Path.Resources.Theme);
        Environment.SaveDataDir = './'+Path.join(Environment.Path.Root, Environment.Path.Savedata);
        global.Environment = Environment;
    } catch (error) {
        throw error;
    }
}
function LoadUserConfig() {
    /* In electron, we need to apply all the global config and usersetting, 
        binding hotkeys, etc, when showing welcome photo.
    */
}

LoadGlobalConfig();
LoadUserConfig();

module.exports = { LoadGlobalConfig, LoadUserConfig };