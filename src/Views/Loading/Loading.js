import React from 'react';
import { GetRemoteUrlPath } from '../../Engine/Util';
import LoadingStyle from './Loading.less';
const DefaultLoadingImage = window.electron.remote.getGlobal('Environment').UI.LoadingImage;
const GetLoadingImagePath = (SectionDefinedPath) => {
    if(!SectionDefinedPath){
        return DefaultLoadingImage;
    }
    else return GetRemoteUrlPath(SectionDefinedPath);
}
const Loading = ({LoadingImage}) => (
    <div id="LoadingPage" style={{LoadingStyle,backgroundImage:GetLoadingImagePath(LoadingImage)}} />
);
export default  Loading ;