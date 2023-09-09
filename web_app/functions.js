const con = require(__dirname + '/db_connect.js')
const client = con.client;
const db = client.db('MyDatabase');
const collection = db.collection('Collection');

async function authenticateUser(email, pass)
{
    let data = {};
    try {
        const result = await collection.find({}).toArray();
        result.forEach(e => {
            if(e.email == email && e.pass == pass)
                data = e;
        });
    }
    catch (err) {
        console.log('Error occured',err);
        return false;
    }
    if(Object.keys(data).length != 0)
        return data;
    else
        return false;
}

async function checkEmail(email)
{
    try {
        const result = await collection.find({}).toArray();
        for(const e of result) {
            console.log(e.email);
            console.log(email);
            if(e.email == email)
                return ' ! email already exists';
        };
    }
    catch (err) {
        console.log('Error occured',err);
        return ' ! something went wrong';
    }
    return false;
}

module.exports = {authenticateUser, checkEmail};
