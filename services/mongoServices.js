const { MongoClient, ObjectId } = require("mongodb");
const mongoConfig = require('../config/mongo.config.json')
var mongoClient;
module.exports.mongoDBO

const initializeDB = async () => {
    getMongoClient()
        .then(console.log)
        .catch((err) => console.log("Error Connecting MongoDB\n", err))
}


async function getMongoClient() {
  var connectionString;
  if(mongoConfig.isConnectionStingAvailable){
    connectionString = mongoConfig.connectionString;
  }
  else{
    connectionString = `mongodb://${mongoConfig.host}:${mongoConfig.port}`;
  }
    console.log('Connected successfully to server', connectionString);
    mongoClient = new MongoClient(connectionString);
    await mongoClient.connect();
    var dbName = mongoConfig.dbName
    mongoDBO = mongoClient.db(dbName);
    return "Mongo DB connected sucessfully.";
  }


  const findOne = (collection,query) => {
    let data = mongoDBO.collection(collection).findOne(query)
    return data
}

const insertOne = (collection,query) => {
  let data = mongoDBO.collection(collection).insertOne(query)
  return data
}

const updateOne = (collection,filter,query,upsert) =>{
  let data = mongoDBO.collection(collection).updateOne(filter,query,upsert)
  return data
}

module.exports = {initializeDB,findOne,insertOne,updateOne}

