const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objectKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }

        console.log('permission ', req.objectKey.permissions);
        const validPermission = req.objectKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        return next();
    }
}


const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    permission,
    asyncHandler
}