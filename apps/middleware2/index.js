
// validating request header params
module.exports = (request) => {
    const apiKey = request.headers['x-gateway-apikey'];
    const csrf = request.headers['csrf-token'];
    if(!apiKey || !csrf) {
        return false;
    }
    return true;
}
