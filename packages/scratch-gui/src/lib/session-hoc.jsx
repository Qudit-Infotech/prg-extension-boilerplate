/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import xhr from 'xhr';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {getSessionCookies, removeSessionCookies} from './session-utils';
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
            const [accessToken] = getSessionCookies();
            if (accessToken){
                xhr({
                    method: 'GET',
                    uri: `${process.env.REACT_APP_API_ENDPOINT}api/user`,
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

        handleOnLogout (){
            removeSessionCookies();
            window.location.reload();
        }

        renderLogin ({onSignViaQubits}) {
            return (
                <div onClick={onSignViaQubits} >
                    <FormattedMessage
                        defaultMessage="Sign in via Qubits"
                        description="Link for signing in via Qubits"
                        id="gui.menuBar.signInViaQubits"
                    />
                </div>);
        }

        handleSignViaQubits () {
            window.location.href = `${
                process.env.REACT_APP_QUBITS_EDX_BASE_URL
            }oauth2/authorize?client_id=${
                process.env.REACT_APP_QUBITS_EDX_APP_CLIENT_ID
            }&scopr=email,profile&response_type=code`;
        }

        handleJoinQubits () {
            window.open(`${
                process.env.REACT_APP_QUBITS_EDX_BASE_URL
            }register`, '_blank').focus();
        }

        render () {
            const {
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    isLoadingSession={this.isLoadingSession}
                    onLogOut={this.handleOnLogout}
                    renderLogin={this.renderLogin}
                    onSignViaQubits={this.handleSignViaQubits}
                    onOpenRegistration={this.handleJoinQubits}
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
