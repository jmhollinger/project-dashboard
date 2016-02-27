//Configuration
var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var uuid = require('uuid');

var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');


//API Endpoints

//New Project and Phase
app.post('/api/v1/create/project', function (req, res) { 
  var project_input = {
    "project-name" : req.body.project_name,
    "lat" : req.body.lat,
    "lng" : req.body.lng,
    "RFP-number" : req.body.RFP_number,
    "project-description" : req.body.project_description,
    "project-manager" : req.body.project_manager,
    "department" : req.body.department,
    "division" : req.body.division,
    "districts" : req.body.districts ,
    "contractor" : req.body.contractor,
    "start-date" : req.body.start_date,
    "estimated-completion" : req.body.estimated_completion,
    "estimated-budget" : req.body.estimated_budget,
    "work-complete" : req.body.work_complete,
    "budget-spent" : req.body.budget_spent,
    "notes" : req.body.notes,
    "submitted-by" : req.body.submitted_by
  }
res.json(input_obj)
})

//Update Project and Phase Update
app.put('/api/v1/update/project', function (req, res) { 
  var input_obj = {
    "project-name" : req.body.project_name,
    "lat" : req.body.lat,
    "lng" : req.body.lng,
    "RFP-number" : req.body.RFP_number,
    "project-description" : req.body.project_description,
    "project-manager" : req.body.project_manager,
    "department" : req.body.department,
    "division" : req.body.division,
    "districts" : req.body.districts ,
    "contractor" : req.body.contractor,
    "start-date" : req.body.start_date,
    "estimated-completion" : req.body.estimated_completion,
    "estimated-budget" : req.body.estimated_budget,
    "work-complete" : req.body.work_complete,
    "budget-spent" : req.body.budget_spent,
    "notes" : req.body.notes,
    "submitted-by" : req.body.submitted_by
  }
  res.json(input_obj)
})


//Query
app.get('/api/v1/query', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT ' + req.body.fields + ' FROM ' + req.body.table + ' WHERE ' + req.body.where, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//List Departments
app.get('/api/v1/departments', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT DISTINCT department_id, department FROM divisions', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//List Divisions
app.get('/api/v1/divisions', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT division_id, division from divisions', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//All Projects
app.get('/api/v1/projects', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM projects', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//Projects by ID
app.get('/api/projects/:project_id', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM projects WHERE project_id = ' + req.params.project_id, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//Server
var server = app.listen(process.env.PORT || 3000, function () {
var host = server.address().address;
var port = server.address().port;

console.log('App listening at http://%s:%s', host, port);
});