const initialState = {
    session: {
        user: {
            username: 'anon'
        }
    }
};

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
