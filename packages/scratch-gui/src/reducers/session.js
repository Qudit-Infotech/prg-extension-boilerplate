// Expected valid Sate
// {
//     session: {
//         user: {
//             username: 'anon'
//         }
//     }
// }

const initialState = null;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    default:
        return state;
    }
};

export {
    reducer as default,
    initialState as sessionInitialState
};
