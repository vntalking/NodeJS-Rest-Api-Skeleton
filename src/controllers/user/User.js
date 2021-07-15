// get information of a user
exports.getUser = async function(req, res, next) {
    let results = {
        status: 'OK',
        msg: "User getOne",
        data: []
    }

    next(results, req, res, next);
}
