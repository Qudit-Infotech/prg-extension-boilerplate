// Expected valid Sate
// {
//     session: {
//         user: {
//             username: 'anon'
//         }
//     }
// }
const SET_SESSION_USER = 'session/SET_SESSION_USER';

const initialState = {session: null};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_SESSION_USER:{
        return ({
            session: {
                user: action.payload
            }
        });
    }
    default:
        return state;
    }
};

const setSessionUser = user => ({
    type: SET_SESSION_USER,
    payload: user
});

export {
    reducer as default,
    initialState as sessionInitialState,
    setSessionUser
};
