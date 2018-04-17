const auth = require('basic-auth');

module.exports = {
    verifyUser: verifyUser
};

function verifyUser(req, res, next){
    const credentials = auth(req);

    if(credentials
        && credentials.name === 'fearless'
        && credentials.pass === 'themostpurple'){
        next();
    } else{
        res.status(401);
        res.send('access denied');
    }
}