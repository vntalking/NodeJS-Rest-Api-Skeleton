
exports.getOne = async function (req, res, next) {
    let results = {
        status: 'OK',
        msg: "Dashboard getOne",
        data: []
    }

    next(results, req, res, next);
}
