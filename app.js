//Configuration
var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var uuid = require('uuid');

var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

//Department by ID 
app.get('/api/v1/department/id/:dept_id', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT DISTINCT department_id, department from divisions WHERE department_id = ' + req.params.dept_id, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//Department by Name
app.get('/api/v1/department/name/:dept_name', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT DISTINCT department_id, department from divisions WHERE department = '" + req.params.dept_name.replace(/'/g,"''") + "'", function(err, result) {
      done();
      if (err)
       { console.error(err); 
        res.json({"query" : "SELECT DISTINCT department_id, department from divisions WHERE department = '" + req.params.dept_name.replace(/'/g,"''") + "'", 
          "error": err}); }
      else
       {res.json({
        "query" : "SELECT DISTINCT department_id, department from divisions WHERE department = '" + req.params.dept_name.replace(/'/g,"''") + "'",
        "response" : result.rows
       }); }
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

//Division by ID
app.get('/api/v1/division/id/:div_id', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT division_id, division from divisions WHERE division_id = ' + req.params.div_id, function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})

//Division by Name
app.get('/api/v1/division/name/:div_name', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT division_id, division from divisions WHERE division = '" + req.params.div_name.replace(/'/g,"''") + "'", function(err, result) {
      done();
      if (err)
       { console.error(err); 
        res.json({"query" : "SELECT division from divisions WHERE division = '" + req.params.div_name.replace(/'/g,"''") + "'", "error": err}); }
      else
       {res.json({
        "query" : "SELECT division from divisions WHERE division = '" + req.params.div_name.replace(/'/g,"''") + "'",
        "response" : result.rows
       }); }
    });
  });
})

//Council Districts
app.get('/api/v1/council-districts/array', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * from council_districts ORDER BY district_id DESC', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       {
       var districtArray = []
       for (var i = result.rows.length - 1; i >= 0; i--) {
          districtArray.push(result.rows[i].district_name) 
        }
       res.json(districtArray) 
        }
    });
  });
})

//Council Districts
app.get('/api/v1/council-districts', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * from council_districts ORDER BY district_id DESC', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows)}
    });
  });
})

//Phase Types
app.get('/api/v1/phase-types', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * from phase_type', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows); }
    });
  });
})


//Phase Statuses
app.get('/api/v1/status-types', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * from status_type', function(err, result) {
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
    client.query('SELECT * from project_list', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.json(result.rows)}
    });
  });
})

//Search Projects
app.get('/api/v1/projectQuery', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    var queryArray = [] 
    var whereClause = ''

    if (req.query.q){
      queryArray.push("full_text @@ to_tsquery('" + req.query.q + "')") 
      whereClause = ' WHERE '
    } else {}
    if (req.query.dept){
      queryArray.push("department_id = " + req.query.dept) 
      whereClause = ' WHERE '
    } else {}
    if (req.query.div){
      queryArray.push("division_id = " + req.query.div) 
      whereClause = ' WHERE '
    } else {}
    if (req.query.cd){
      queryArray.push("council_districts ? '" + req.query.cd + "'")
       whereClause = ' WHERE '
     } else {}

    var query_string = queryArray.toString().replace(/,/g," AND ")

    client.query('SELECT * from project_list' + whereClause + query_string, function(err, result) {
      done();
      if (err)
       { console.error(err); res.json(
        {'query' : 'SELECT * from project_list' + whereClause + query_string,
         'error' : err
         }); }
      else
       { res.json(result.rows)}
    });
  });
})

//Search Projects
app.get('/api/v1/projectStats', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {  
    var queryArray = [] 
    var whereClause = ''
    if (req.query.q){
      queryArray.push("full_text @@ to_tsquery('" + req.query.q + "')") 
      whereClause = ' WHERE '
    } else {}
    if (req.query.dept){
      queryArray.push("department_id = " + req.query.dept) 
      whereClause = ' WHERE '
    } else {}
    if (req.query.div){
      queryArray.push("division_id = " + req.query.div) 
      whereClause = ' WHERE '
    } else {}
    if (req.query.cd){
      queryArray.push("council_districts ? '" + req.query.cd + "'")
       whereClause = ' WHERE '
     } else {}

    var query_string = queryArray.toString().replace(/,/g," AND ")

    client.query('SELECT SUM(actual) as actual, SUM(budget) as budget, COUNT(project_id) as projects, COUNT(phase_id) as phases FROM project_list' + whereClause + query_string, function(err, result) {
      done();
      if (err)
       { console.error(err); res.json(
        {'query' : 'SELECT SUM(actual) as actual, SUM(budget) as budget, COUNT(project_id) as projects, COUNT(phase_id) as phases FROM project_list' + whereClause + query_string,
         'error' : err
         }); }
      else
       { res.json(result.rows)}
    });
  });
})

//Projects by ID
app.get('/api/v1/project/:project_id', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM all_project_phases WHERE project_id = ' + req.params.project_id, function(err, result) {
      done();
      if (err){ console.error(err); res.send("Error " + err); }else
       {  
        res.json(result.rows); 
       }
    });
  });
})

//Server
var server = app.listen(process.env.PORT || 3000, function () {
var host = server.address().address;
var port = server.address().port;

console.log('App listening at http://%s:%s', host, port);
});