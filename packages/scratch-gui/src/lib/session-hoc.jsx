/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import xhr from 'xhr';
import {connect} from 'react-redux';
import {getSessionCookies} from './session-utils';
import {setSessionUser} from '../reducers/session';

/*
 * Higher Order Component to provide extract session state. Creates a nested IntlProvider
 * to handle Gui intl context. The component accepts an onSetLanguage callback that is
 * called when the locale chagnes.
 * @param {React.Component} WrappedComponent - component to provide state for
 * @returns {React.Component} component with intl state provided from redux
 */
const SessionHOC = function (WrappedComponent) {
    class SessionWrapper extends React.Component {

        constructor (props) {
            super(props);
            this.isLoadingSession = true;
        }

        componentDidMount (){
            window.console.log('component did mount');
            const [accessToken] = getSessionCookies();
            window.console.log(process.env);
            if (accessToken){
                xhr({
                    method: 'GET',
                    uri: 'http://localhost:8088/api/user',
                    headers: {authorization: `Bearer ${accessToken}`},
                    json: true
                }, (error, response) => {
                    if (!(error || response.statusCode !== 200)) {
                        // this.props.setSessionUser();
                        window.console.log(response.body);
                        const user = response.body.data && response.body.data[0];
                        this.props.setSessionUser(user);
                    }
                    this.isLoadingSession = false;
                    this.forceUpdate();

                });
            } else {
                this.isLoadingSession = false;
                this.forceUpdate();
            }
        }

        render () {
            const {
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    isLoadingSession={this.isLoadingSession}
                    {...componentProps}
                />
            );
        }
    }

    SessionWrapper.propTypes = {
        setSessionUser: PropTypes.func.isRequired
    };

    // const mapStateToProps = state => ({
    //     locale: state.locales.locale
    // });

    const mapDispatchToProps = dispatch => ({
        setSessionUser: user => dispatch(setSessionUser(user))
    });

    return connect(
        null,
        mapDispatchToProps
    )(SessionWrapper);
};

export default SessionHOC;
