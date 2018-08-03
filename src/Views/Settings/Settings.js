import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
//通过NavBar进行设置页的路由跳转
import { NavBar, ConfigPanel } from '.';
import { IMAGE_SETTING } from '../../Engine/actionTypes/SettingType';


const Settings = () => (
<NavBar>
	<Switch>
		<Route path='/NewSettings/:id' component={ConfigPanel} />
		<Redirect path="/NewSettings" to={{ pathname: '/NewSettings/' + IMAGE_SETTING }} />
	</Switch>
</NavBar>);



export default Settings;