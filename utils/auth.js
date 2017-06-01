module.exports = (authService, config, errors) => {
    return (req, res, next) => {
        next();
        // const userId = req.signedCookies[config.cookie.auth];
        // const path = req.url;
        //
        // return authService.checkPermissions(userId, path)
        //  .then(() => next())
        //  .catch(() => res.error(errors.accessDenied));
    };
};