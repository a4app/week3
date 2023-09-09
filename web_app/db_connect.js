const { MongoClient } = require('mongodb');

const url = "mongodb+srv://WeekTwoUser:WeekTwoPass@weektwocluster.u7m1jlm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const connectDB = () => {
    client.connect().then( () => {
        console.log("Connected to database");
    }).catch( (err) => {
        console.log("Connection failed" ,err);
    });
};

module.exports = {connectDB, client};
