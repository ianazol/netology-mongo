const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/phones";
let contactsCollection = null;
let db = null;

function connect(){
    MongoClient.connect(url, function (err, database) {
        if (err) console.log(err);
        db = database;

        if (!contactsCollection){
            db.createCollection("contacts", {
                validator:
                    { '$and':
                        [
                            { 'name': { '$type': "string" } },
                            { 'lastname': { '$type': "string" } },
                            { 'phone': { '$regex': /\d$/ } },
                            //{ 'info.email': { '$regex': /@[0-9a-z-]+\.[a-z]{2,}$|^$/} },
                            //{ 'info.skype': { '$type': "string" } }
                        ]
                    },
                validationLevel : "strict",
                validationAction : "error"
            })
            .then(result => contactsCollection = result)
            .catch(err => console.log(err.message));
        }
    });
}

function validate(data, res, checkRequired = false){
    if (checkRequired && (!data.name || !data.lastname || !data.phone)){
        res.json({error: "Не заполнены все обязательные поля"});
        return false;
    }
    if (data.phone && !/\d$/.test(data.phone)){
        res.json({error: "В поле Телефон допустимы только цифры"});
        return false;
    }
    if (data.info && data.info.email && !/@[0-9a-z-]+\.[a-z]{2,}$/.test(data.info.email)){
        res.json({error: "Неверный формат электронной почты"});
        return false;
    }
    return true;
}

exports.add = function(req, res){
    if (!validate(req.body, res, true))
        return false;

    let query = {};
    if (req.body.name)
        query["name"] = req.body.name;
    if (req.body.lastname)
        query["lastname"] = req.body.lastname;
    if (req.body.phone)
        query["phone"] = req.body.phone;
    if (req.body.info)
        query["info"] = req.body.info;

    contactsCollection.insertOne(query)
        .then(result => res.json(result.ops[0]))
        .catch(err => res.json({error: err.message}));
};

exports.get = function(req, res){
    let id = req.params.id;
    let search = req.query ? req.query : {};
    if (id)
        search["_id"] = new mongodb.ObjectID(id);

    contactsCollection.find(search).toArray()
        .then(result => res.json(result))
        .catch(err => res.json({error: err.message}));
};

exports.update = function(req, res){
    if (!validate(req.body, res))
        return false;

    let id = req.params.id;
    let query = {};
    if (req.body.name)
        query["name"] = req.body.name;
    if (req.body.lastname)
        query["lastname"] = req.body.lastname;
    if (req.body.phone)
        query["phone"] = req.body.phone;
    if (req.body.info){
        for( let prop in req.body.info ){
            query[`info.${prop}`] = req.body.info[prop];
        }
    }

    contactsCollection.updateOne({'_id': new mongodb.ObjectID(id)}, {$set: query})
        .then(result => res.json(result))
        .catch(err => res.json({error: err.message}));
};

exports.remove = function(req, res){
    let id = req.params.id;
    contactsCollection.deleteOne({'_id': new mongodb.ObjectID(id)})
        .then(result => res.json(result))
        .catch(err => res.json({error: err.message}));
};

connect();