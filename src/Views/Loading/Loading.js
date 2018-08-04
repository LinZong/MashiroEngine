import React from 'react';
import LoadingView from './LoadingView.css';
import { GetRemoteUrlPath } from '../../Engine/Util';
const DefaultLoadingImage = window.electron.remote.getGlobal('Environment').UI.LoadingImage;
const GetLoadingImagePath = (SectionDefinedPath) => {
    if(!SectionDefinedPath){
        return DefaultLoadingImage;
    }
    else return GetRemoteUrlPath(SectionDefinedPath);
}
const Loading = ({LoadingImage}) => (
    <div id="LoadingPage" style={{LoadingView,backgroundImage:GetLoadingImagePath(LoadingImage)}} />
);
export default  Loading ;