const express = require('express');

// record routes is an instance of express router
// we use it to define routes
// router will be added as a middleware,
// and take control of requests starting with path /record
const recordRoutes = express.Router();

// connect to db
// this help convert the id from string to ObjectId for the _id
const dbo      = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;


// CRUD setup

// CREATE: new record
recordRoutes.route('/record/add').post(function(req, response) {
    let db_connect = dbo.getDb();
    let myobj      = {
        person_name: req.body.person_name,
        person_position: req.body.person_position,
        person_level: req.body.person_level,
    };

    db_connect
        .collection('records')
        .insertOne(myobj, function(err, res) {
            if(err) throw err;
            response.json(res);
        });
});


// READ: all records
recordRoutes.route('/record').get(function(req, res) {
    let db_connect = dbo.getDb('employees');

    db_connect
        .collection('records')
        .find({})
        .toArray(function(err, result) {
            if(err) throw err;
            res.json(result);
        });
});

// READ: single record by id
recordRoutes.route('/record/:id').get(function(req, res) {
    let db_connect = dbo.getDb();
    let myquery    = { _id: ObjectId( req.params.id )};
    
    db_connect
        .collection('records')
        .findOne(myquery, function(err, result) {
            if(err) throw err;
            res.json(result);
        });
});


// UPDATE: single record by id
recordRoutes.route('/update/:id').post(function(req, response) {
    let db_connect = dbo.getDb();
    let myquery    = { _id: ObjectId( req.params.id )};
    let newvalues  = {
        $set: {
            person_name: req.body.person_name,
            person_position: req.body.person_position,
            person_level: req.body.person_level,
        },
    };

    db_connect
        .collection('records')
        .updateOne(myquery, newvalues, function(err, res) {
            if(err) throw err;
            response.json(res);
        });
});


// DELETE: single record by id
recordRoutes.route('/:id').delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery    = { _id: ObjectId( req.params.id )};

    db_connect
        .collection('records')
        .deleteOne(myquery, function(err, obj) {
            if(err) throw err;
            response.status(obj);
        });
});

module.exports = recordRoutes;
