// get information of a user
exports.getUser = async function(req, res, next) {
    let results = {
        statusCode: '200',
        msg: "User getOne",
        data: ["user1", "user2"]
    }

    next(results, req, res, next);
}
