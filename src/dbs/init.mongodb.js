const mongoose = require("mongoose");
const { db: { host, name, port } } = require('../configs/mongo.config');
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor () {
        this.connect();
    }

    connect () {
        mongoose.set('debug', true);
        mongoose.set('debug', { color: true });
        mongoose.connect(connectString).then(() => console.log(`Connected Mongodb ${name} success`, mongoose.connections.length)).catch(err => console("Error", err));
    }

    static getInstance () {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const mongoDbInstance = Database.getInstance();

module.exports = mongoDbInstance;