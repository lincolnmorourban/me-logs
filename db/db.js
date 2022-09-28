import { Sequelize, QueryTypes } from 'sequelize';
import { defineTable } from '../models/request.js';
import EventEmitter from "events";

EventEmitter.prototype._maxListeners = 5000;

var requests = null;
var db = {};

export async function connect() {
    var sequelize = new Sequelize(
        'melogs', 'root', 'root1234@', {dialect: 'mysql', host: 'localhost'}
    );

    try {
        requests = defineTable(sequelize);
        await sequelize.sync();
    } catch (error) {
        throw new Error(`Erro ao criar a tabela na base de dados: ${error.message}.`);
    }

    db.sequelize = sequelize;
}

export async function insertLogs(arrayRows) {
    await requests.count().then((count) => {
        if (parseInt(count) == 0) {
            console.log('Iniciando a inserção dos registros na base de dados')
            Promise.all(arrayRows).then((rows) => {
                requests.bulkCreate(rows).then((response) => {
                    console.log('Inserção dos registros finalizada com sucesso.')
                }).catch((error) => {
                    throw new Error(`Erro ao inserir os registros de log na base: ${error.message}`);
                });
            });
        } else {
            console.log('Os registros de log já foram inseridos na base de dados.');
        }
    });
}

export async function selectRequestsByService() {
    let arrayResult = [];
    await requests.count().then((count) => {
        if (count == 0) {
            console.log(`Não foram encontrados registros de log na base, realize primeiramente a importação.`)
            return;
        }
    });

    let sql = `SELECT rq.service_name as service_name
                    , count(*) as count_requests 
                 FROM requests rq 
                GROUP BY 1
                order by 2 DESC;`;

    await db.sequelize.query(sql, { type: QueryTypes.SELECT}).then((result) => {
        arrayResult = result;
    }).catch((error) => {
        console.log(`Falha ao buscar os registros na base de dados: ${error.message}`);
    })

    return arrayResult;
}

export async function selectRequestsByConsumer() {
    let arrayResult = [];
    await requests.count().then((count) => {
        if (count == 0) {
            console.log(`Não foram encontrados registros de log na base, realize primeiramente a importação.`)
            return;
        }
    });

    let sql = `SELECT rq.consumer as consumer
                    , count(*) as count_requests 
                 FROM requests rq 
                GROUP BY 1
                ORDER BY 2 DESC;`;
    
    await db.sequelize.query(sql, { type: QueryTypes.SELECT}).then((result) => {
        arrayResult = result;
    }).catch((error) => {
        console.log(`Falha ao buscar os registros na base de dados: ${error.message}`);
    })

    return arrayResult;
}

export async function selectAvgTimeByService() {
    let arrayResult = [];
    await requests.count().then((count) => {
        if (count == 0) {
            console.log(`Não foram encontrados registros de log na base, realize primeiramente a importação.`)
            return;
        }
    });

    let sql = `SELECT rq.service_name as service_name
                    , AVG(rq.gateway) as avg_gateway
                    , AVG(rq.request) as avg_request
                    , AVG(rq.proxy)   as avg_proxy  
                 FROM requests rq 
                GROUP BY 1;`;
    
    await db.sequelize.query(sql, { type: QueryTypes.SELECT}).then((result) => {
        arrayResult = result;
    }).catch((error) => {
        console.log(`Falha ao buscar os registros na base de dados: ${error.message}`);
    })

    return arrayResult;
}