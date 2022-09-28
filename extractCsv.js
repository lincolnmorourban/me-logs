import fs from "fs";
import { stringify } from "csv-stringify";
import {
    connect, 
    selectRequestsByService, 
    selectRequestsByConsumer,
    selectAvgTimeByService
} from "./db/db.js";

var dir = './csv';

async function init() {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    
    await connect();
    extractCsv();
}

function extractCsv() {
    extractRequestsByService();
    extractRequestsByConsumer();
    extractAvgTimeByService();
}

async function extractRequestsByService() {
    const filepath = `${dir}/requestByService.csv`;
    const writableStream = fs.createWriteStream(filepath);

    const columns = [
        "service_name",
        "count_requests"
    ];

    const stringifier = stringify({ header: true, columns: columns });
    await selectRequestsByService().then((arrayResult) => {
        if (arrayResult.length) {
            arrayResult.forEach((row) => {
                stringifier.write(row);
                stringifier.pipe(writableStream);
            });
        }
    })
}

async function extractRequestsByConsumer() {
    const filepath = `${dir}/requestByConsumer.csv`;
    const writableStream = fs.createWriteStream(filepath);

    const columns = [
        "consumer",
        "count_requests"
    ];

    const stringifier = stringify({ header: true, columns: columns });
    await selectRequestsByConsumer().then((arrayResult) => {
        if (arrayResult.length) {
            arrayResult.forEach((row) => {
                stringifier.write(row);
                stringifier.pipe(writableStream);
            });
        }
    })
}

async function extractAvgTimeByService() {
    const filepath = `${dir}/avgTimeByService.csv`;
    const writableStream = fs.createWriteStream(filepath);

    const columns = [
        "service_name",
        "avg_gateway",
        "avg_request",
        "avg_proxy"
    ];

    const stringifier = stringify({ header: true, columns: columns });
    await selectAvgTimeByService().then((arrayResult) => {
        if (arrayResult.length) {
            arrayResult.forEach((row) => {
                stringifier.write(row);
                stringifier.pipe(writableStream);
            });
        }
    })
}


init ();