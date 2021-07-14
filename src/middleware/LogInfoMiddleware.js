exports.processLogInfo = async (request, response, next) => {
    const logInfo = {
        username: request.username,
        device: request.headers["device"] || 'Unknown',
        client: request.headers["client"] || 'Unknown',
    }
    request.logInfo = logInfo;
    next();
}