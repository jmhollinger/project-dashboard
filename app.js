//Configuration
var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');


//API Endpoints
//Query
app.post('/query', function (req, res) {
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
app.get('/departments', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT DISTINCT department FROM divisions', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//List Divisions
app.get('/divisions', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT DISTINCT division from divisions', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//List Divisions by Department
app.get('/divisions/:department', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT division from divisions WHERE department = ' + req.params.department, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//List all Projects
app.get('/projects/:department', function (req, res) {
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

app.get('/projects/:department', function (req, res) {
  var res_obj = {
    "Response" : "Projects by Department"
  }
  res.json(res_obj)
})

app.get('/projects/:division', function (req, res) {
  var res_obj = {
    "Response" : "Projects by Division"
  }
  res.json(res_obj)
})

app.get('/projects/:council-district', function (req, res) {
  var res_obj = {
    "Response" : "Projects by Council District"
  }
  res.json(res_obj)
})

app.get('/projects/:project_id', function (req, res) {
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

//write end points
app.post('/projects/new', function (req, res) {
  
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

app.post('/projects/update', function (req, res) {

    var input_obj = {
    "project-id" : req.body.project_id,  
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

//Server
var server = app.listen(process.env.PORT || 3000, function () {
var host = server.address().address;
var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});