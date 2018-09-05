import React from 'react';
import { IntlProvider } from 'react-intl';
import {connect} from 'react-redux';
import * as LocaleFile from '../Language/index';
const {GetSettingValue} = require('../Engine/LoadConfig');
class IntlWrapper extends React.Component {
    render() {
        const { locale, LocaleMessage, children } = this.props;
        return (
            <IntlProvider locale={locale} messages={LocaleMessage}>
                {children}
            </IntlProvider>
        );
    }
}
const mapStateToProps = (StoreState) => {
    const {Setting} = StoreState;
	return {
        LocaleMessage:LocaleFile[GetSettingValue("LANGUAGE",Setting.Settings)]
	};
};
export default connect(mapStateToProps,null)(IntlWrapper);