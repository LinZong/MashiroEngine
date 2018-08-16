import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {withRouter} from 'react-router';
//通过NavBar进行设置页的路由跳转
import { NavBar, ConfigPanel } from '.';
import { IMAGE_SETTING } from '../../Engine/actionTypes/SettingType';

const Settings = () => (
<NavBar>
	<Switch>
		<Route exact path='/NewSettings/:id/:from' component={ConfigPanel} />
		<Route exact path='/NewSettings/:id' component={ConfigPanel} />
		<Redirect path="/NewSettings" to={{ pathname: '/NewSettings/' + IMAGE_SETTING }} />
	</Switch>
</NavBar>);



export default withRouter(Settings);