import { handleActions } from 'redux-actions';
const reducer = handleActions({
    "LOADSETTING": (state, action) => {
        return { Settings: action.payload };
    },
    "APPLYSETTING": (state, action) => {
        window.electron.remote.getGlobal('SettingsNode')[action.payload.SetName] = action.payload.SetElement;
        state.Settings[action.payload.SetName] = action.payload.SetElement;
        return { Settings: { ...state.Settings } };
    }
}, {});

export default reducer;