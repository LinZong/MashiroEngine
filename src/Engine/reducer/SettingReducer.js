import { handleActions } from 'redux-actions';
const reducer = handleActions({
    "LOADSETTING": (state, action) => {
        return { ...action.payload };
    },
    "APPLYSETTING": (state, action) => {
        window.electron.remote.getGlobal('SettingsNode')[action.payload.SetName] = action.payload.SetElement;
        state[action.payload.SetName] = action.payload.SetElement;
        return {  ...state  };
    }
}, {});

export default reducer;