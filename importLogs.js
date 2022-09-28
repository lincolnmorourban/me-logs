import fs from "fs";
import readline from "readline";
import {connect, insertLogs} from "./db/db.js";

async function init() {
    await connect();
    importFileLog("./db/logs.txt", "utf-8");
}

function importFileLog(filepath, encode = "utf-8") {
    let arrayRows = [];

    const readStream = fs.createReadStream(filepath, encode);
    let rl = readline.createInterface({input: readStream})
    rl.on('line', (line) => {
        let jsonLine = JSON.parse(line)
        arrayRows.push({
            service_id: jsonLine.service.id,
            service_name: jsonLine.service.name,
            consumer: jsonLine.request.headers.host,
            gateway: jsonLine.latencies.kong,
            proxy: jsonLine.latencies.proxy,
            request: jsonLine.latencies.request
        });    
    });
    rl.on('error', (error) => { 
        throw new Error(`Erro ao importar o arquivo de log: ${error.message}`);
    });
    rl.on('close', async () => {
        if (arrayRows.length) {
            await insertLogs(arrayRows);
        }
    });
}

init();