//Configuration
var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');


//API Endpoints
app.post('/projects/query', function (req, res) {
  var res_obj = {
    "Response" : "General Query"
  }
  res.json(res_obj)
})

app.post('/projects/department', function (req, res) {
  var res_obj = {
    "Response" : "Projects by Department"
  }
  res.json(res_obj)
})

app.post('/projects/division', function (req, res) {
  var res_obj = {
    "Response" : "Projects by Division"
  }
  res.json(res_obj)
})

app.post('/projects/council-district', function (req, res) {
  var res_obj = {
    "Response" : "Projects by Council District"
  }
  res.json(res_obj)
})

app.post('/projects/project-id', function (req, res) {
  var res_obj = {
    "Response" : "Projects by ID"
  }
  res.json(res_obj)
})

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