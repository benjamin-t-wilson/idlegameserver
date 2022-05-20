const createDbClient = () => {
  const MongoClient = require("mongodb").MongoClient;
  return new MongoClient(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
  });
};

const getCollection = async (collection, filter = {}) => {
  const client = createDbClient();

  await client.connect();

  const documents = await client
    .db("idle")
    .collection(collection)
    .find(filter)
    .toArray();

  await client.close();

  return documents;
};

const getDocument = async (collection, filter) => {
  const client = createDbClient();

  await client.connect();

  const document = await client
    .db("idle")
    .collection(collection)
    .findOne(filter);

  await client.close();

  return document;
};

const insertDocument = async (collection, document) => {
  const client = createDbClient();

  await client.connect();

  const result = await client
    .db("idle")
    .collection(collection)
    .insertOne(document);

  await client.close();

  return result.insertedId;
};

const updateDocument = async (collection, document) => {
  const ObjectId = require("mongodb").ObjectId;
  const client = createDbClient();

  const docId = new ObjectId(document._id);
  delete document._id;

  await client.connect();

  const result = await client
    .db("idle")
    .collection(collection)
    .updateOne({ _id: docId }, { $set: document });

  await client.close();

  return { matched: result.matchedCount, modified: result.modifiedCount };
};

module.exports = {
  getCollection,
  getDocument,
  insertDocument,
  updateDocument,
};
