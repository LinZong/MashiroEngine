import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
//通过NavBar进行设置页的路由跳转
import { NavBar, ImageConfig, TextConfig } from '.';

const Settings = () => (<NavBar>
	<Switch>
		<Route path='/NewSettings/ImageConfig' component={ImageConfig} />
		<Route path='/NewSettings/TextConfig' component={TextConfig} />
		<Redirect path="/NewSettings" to={{ pathname: '/NewSettings/ImageConfig' }} />
	</Switch>
</NavBar>);



export default Settings;