const {MongoClient} = require('mongodb');
//const MONGO_URL="mongodb://localhost:27017/"
describe('insert', () => {
  let connection;
  let db;
  
  beforeAll(async () => {
    console.log(global.__MONGO_URI__)

    connection = await  MongoClient.connect(global.__MONGO_URI__,{ useNewUrlParser:true});
   
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection',async() => {
    const users = db.collection('users');

    const mockUser = {_id: 2, name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser =await users.findOne({_id:2});
    expect(insertedUser).toEqual(mockUser);
  });
});


