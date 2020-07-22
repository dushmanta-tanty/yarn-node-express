
// method for logging api request
module.exports = (request, response) => {
    console.log('Requested URL : ', request.url);
    return true;
}
