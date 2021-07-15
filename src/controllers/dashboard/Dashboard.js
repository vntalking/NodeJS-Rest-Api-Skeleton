
exports.getOne = async function (req, res, next) {
    let results = {
        statusCode: '200',
        msg: "Dashboard getOne",
        data: [1, 2, 3]
    }

    next(results, req, res, next);
}
