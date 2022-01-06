const getSessionCookies = () => {
    const cookieArr = document.cookie.split(';');
    let accessToken;
    let refreshToken;
    // Loop through the array elements
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split('=');
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if (cookiePair[0].trim() === 'access_token') {
            // Decode the cookie value and return
            accessToken = decodeURIComponent(cookiePair[1]);
        }
        if (cookiePair[0].trim() === 'refresh_token') {
            // Decode the cookie value and return
            refreshToken = decodeURIComponent(cookiePair[1]);
        }
    }
    // Return null if not found
    return [accessToken, refreshToken];
};

export {
    getSessionCookies
};
