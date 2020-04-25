import { MongoClient, ObjectID } from "mongodb";

import * as secret from "./secret.json";
// Configuring the mongodb env
const databaseUrl = secret.connection;

class Database {
  client: MongoClient;
  constructor() {
    this.client = null;
  }

  // Connect to the database
  connect = async () => {
    const client = new MongoClient(databaseUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.client = await client.connect();
  };

  // disconnect
  disconnect = () => {
    if (this.client) {
      this.client.close();
    }
  };

  // Prepares the db for adding the data
  getDb = async (dbName) => {
    if (!this.client) await this.connect();
    const db = this.client.db(dbName);
    return db;
  };

  // Get a specific collection from mongodb atlas
  getCollection = async (dbName, collection) => {
    const db = await this.getDb(dbName);
    return db.collection(collection);
  };

  addData = async (data) => {
    const col = await this.getCollection("scraper", "hungry");
    // Insert the object
    return await col.insertOne(data);
  };

  // readData = async (id) => {
  //   console.log(id);
  //   const col = await this.getCollection("scraper", "hungry");
  //   const doc = await col.find({ hi: "how" });
  //   return doc;
  // };

  clear = async () => {
    const col = await this.getCollection("scraper", "hungry");
    col.deleteMany({});
  };
}

const db = new Database();
export default db;
