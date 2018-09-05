const {createAction}  = require('redux-actions');

const LoadSetting = createAction("LOADSETTING",(SettingObj)=>SettingObj);

const ApplySetting = createAction("APPLYSETTING",(SetName,SetElement)=>({SetName,SetElement}));

module.exports = {LoadSetting,ApplySetting};