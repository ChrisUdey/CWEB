//FOR NOW: Dummy user store - LATER: replace with a DB or better yet an ORM that connects to a DB
const users = [
    {id: 1, email: 'admin@t.ca', password: '123456Pw', role: 'admin', defaultHome: 'dashboard'},
    {id: 2, email: 'employee@t.ca', password: '123456Pw', role: 'employee', defaultHome: 'profile'},
    {id: 3, email: 'client@t.ca', password: '123456Pw', role: 'client', defaultHome: 'booking'},
];

/**
 * Get a User Info object from the data store. The User Info will be used as the payload for a JWT
 * @return {{id:0}} or User Info object (User but no email or password)
 * @param pwd
 * @param email
 */
exports.getUserInfo = (email, pwd)=> {
    const userInfo = {id: 0};
    // get user that matches username and password
    const user = users.find((u) => u.email === email && u.password === pwd);
    console.log('User:', user);
    if (user) { // should exclude secure info like password (or username/email)
        userInfo.id = user.id;
        userInfo.role = user.role;
        userInfo.defaultHome = user.defaultHome;
    }
    return userInfo;
};

/**
 * finds a user in the data store by  id
 * @param id
 * @returns {{id: number, email: string, password: string, role: string, defaultHome: string}
 */
exports.findUserByUserInfo = (userInfo)=> {
    return users.find((u) => u.id === userInfo.id
        // extra checks to ensure role and default home have not changed
        // && u.role === userInfo.role && u.defaultHome === userInfo.defaultHome,
    );
};

