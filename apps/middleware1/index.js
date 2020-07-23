const fs = require('fs');

// method for logging api request
module.exports = (request, response, status) => {
    const loadDatas = loadLogs('logs/logs.json');
    // console.log('Before update loadDatas ', loadDatas);
    const auditData = {
        "url": request.url,
        "body": request.body ? request.body : null,
        "status": status,
        "response": response != null ? response : null,
        "timestamp": Date.now()
    };
    loadDatas['logs'].push(auditData);
    loadDatas['last-modified'] = Date.now();
    
    // console.log('After update loadDatas ', loadDatas);
    auditLogs('logs/logs.json', loadDatas);
    return;
}

// load the logs.json file into the system
const loadLogs = (filename = '') => {
    return JSON.parse(
        fs.existsSync(filename) ? fs.readFileSync(filename).toString() : '""' 
    );
}

// update the json into the file
const auditLogs = (filename = '', auditData = '""') => {
    return fs.writeFileSync(
        filename, 
        JSON.stringify(
            auditData,
            null,
            2
        )
    );
}
