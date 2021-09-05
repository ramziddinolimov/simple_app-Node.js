const { MongoClient } = require("mongodb");

const mongoAtlasUrl =
  "mongodb+srv://mongo_user:mongo_parol@cluster0.nmmhy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(mongoAtlasUrl);

async function mongo() {
  try {
    await client.connect();

    const db = await client.db("usersystem");

    const users = await db.collection("users");
    
    



    return {
      users,
    };
  } catch (error) {
    console.log(error);
  }
};

// async function i() {
//   try {
//     await client.connect();
//     const dbs = await client.dbs("usersystem");
//     const dss = await dbs.collection("dss");

//     return {
//       dss,
//     };
//   } catch(errorr) {
//     console.log(errorr);
//   }
// };



module.exports = mongo;
// module.exports = i;