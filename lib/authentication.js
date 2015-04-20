function checkAuth(req, res, next){
    console.log('checking Auth...');
    next();
}

function checkRoles(req, res, next){
    console.log('checking Roles...');
    next();
}

module.exports = {
    checkAuth:checkAuth,
    checkRoles: checkRoles
}


