/* Shared MongoDB connection for the backend experiments (exp5-exp7).
   Uses MONGODB_URI when provided (real MongoDB / Atlas), otherwise boots
   a real in-memory mongod via mongodb-memory-server — zero install. */
const mongoose = require("mongoose");

let memoryServerPromise = null;
const connections = new Map();

async function getMemoryServerUri(dbName) {
  if (!memoryServerPromise) {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryServerPromise = MongoMemoryServer.create();
  }
  const server = await memoryServerPromise;
  return server.getUri(dbName);
}

async function connect(dbName) {
  if (connections.has(dbName)) return connections.get(dbName);

  const uri = process.env.MONGODB_URI
    ? process.env.MONGODB_URI
    : await getMemoryServerUri(dbName);

  const options = process.env.MONGODB_URI ? { dbName } : {};
  const connection = await mongoose
    .createConnection(uri, options)
    .asPromise();

  connections.set(dbName, connection);
  return connection;
}

async function disconnectAll() {
  for (const connection of connections.values()) {
    await connection.close();
  }
  connections.clear();
  if (memoryServerPromise) {
    const server = await memoryServerPromise;
    await server.stop();
    memoryServerPromise = null;
  }
}

module.exports = { connect, disconnectAll };
