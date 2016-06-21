//Configuration
var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');
var helmet = require('helmet')


var app = express();

app.use(helmet())

var https_redirect = function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
};

app.use(https_redirect);

app.use(express.static('public'));

app.use(function noCache(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    next();
});

app.use(stormpath.init(app,{
  web: {
    spaRoot: 'public/index.html'
  },
  expand: {
    groups: true,
    customData: true
  }
}));

app.use(bodyParser.json({
    extended: false
}));

app.set('view engine', 'jade');

//API Endpoints

//New Project and Phase
app.post('/api/v1/projectAndPhase', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query({
                    text: 'WITH project_insert AS ( INSERT INTO projects (project_name, project_description, estimated_total_budget,funded, council_districts, lat, lng, modified_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING project_ID) ' +
                        'INSERT INTO phases (project_id, phase_status, phase_type, phase_description,phase_manager, division_id, resolution_number, accounting, rfp_number,contractor, start_date, estimated_completion, budget, work_complete,actual, notes, modified_by) SELECT project_insert.project_id, $9 , $10 , $11, $12, $13, $14, $15 , $16, $17, $18, $19, $20, $21, $22, $23, $24 FROM project_insert RETURNING project_id, phase_id;',
                    values: [
                        req.body.projectName,
                        req.body.projectDesc,
                        req.body.estBudget,
                        req.body.funded,
                        JSON.stringify(req.body.councilDistricts),
                        req.body.lat,
                        req.body.lng,
                        req.body.modifiedBy,
                        req.body.phaseStatus.status_type_id,
                        req.body.phaseType.phase_type_id,
                        req.body.phaseDesc,
                        req.body.phaseManager,
                        req.body.division.division_id,
                        req.body.resoNumber,
                        JSON.stringify(req.body.accounting),
                        req.body.rfpNumber,
                        req.body.contractor,
                        req.body.startDate,
                        req.body.completionDate,
                        req.body.phaseBudget,
                        req.body.workComplete,
                        req.body.phaseActual,
                        req.body.notes,
                        req.body.modifiedBy
                    ]
                },function(err, result) {
                    done();
                    if (err) {
                        res.json({"success": false,"results": err});
                    } else {
                        res.json({"success" : true, "results" : result.rows});
                    }
                });
    });
})

//New Project
app.post('/api/v1/project', stormpath.loginRequired, function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query({
                    text: 'INSERT INTO projects (project_name, project_description, estimated_total_budget, council_districts, lat, lng, modified_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING project_ID',
                    values: [
                        req.body.projectName,
                        req.body.projectDesc,
                        req.body.estBudget,
                        JSON.stringify(req.body.councilDistricts),
                        req.body.lat,
                        req.body.lng,
                        req.body.modifiedBy
                    ]
                },function(err, result) {
                    done();
                    if (err) {
                        res.json({"success": false,"results": err});
                    } else {
                        res.json({"success" : true, "results" : result.rows});
                    }
                });
    });
})

//New Phase
app.post('/api/v1/phase', stormpath.loginRequired, function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query({
                    text: 'INSERT INTO phases (project_id, phase_status, phase_type, phase_description,phase_manager, division_id, resolution_number, accounting, rfp_number,contractor, start_date, estimated_completion, budget, work_complete,actual, notes, modified_by) VALUES ($1 , $2 , $3 , $4, $5, $6, $7, $8 , $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING project_id, phase_id;',
                    values: [
                        req.body.projectId,
                        req.body.phaseStatus.status_type_id,
                        req.body.phaseType.phase_type_id,
                        req.body.phaseDesc,
                        req.body.phaseManager,
                        req.body.division.division_id,
                        req.body.resoNumber,
                        JSON.stringify(req.body.accounting),
                        req.body.rfpNumber,
                        req.body.contractor,
                        req.body.startDate,
                        req.body.completionDate,
                        req.body.phaseBudget,
                        req.body.workComplete,
                        req.body.phaseActual,
                        req.body.notes,
                        req.body.modifiedBy
                    ]
                },function(err, result) {
                    done();
                    if (err) {
                        res.json({"success": false,"results": err});
                    } else {
                        res.json({"success" : true, "results" : result.rows});
                    }
                });
    });
})

//Update Project
app.put('/api/v1/project', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query({
                    text: 'UPDATE projects SET project_name=$1, project_description=$2, estimated_total_budget=$3, council_districts=$4, lat=$5, lng=$6, modified_by=$7 WHERE project_id = $8;',
                    values: [
                        req.body.projectName,
                        req.body.projectDesc,
                        req.body.estBudget,
                        JSON.stringify(req.body.councilDistricts),
                        req.body.lat,
                        req.body.lng,
                        req.body.modifiedBy,
                        req.body.projectId
                    ]
                },function(err, result) {
                    done();
                    if (err) {
                        res.json({"success": false,"results": err});
                    } else {
                        res.json({"success" : true, "results" : result.rows});
                    }
                });
    });
})

//Update Phase
app.put('/api/v1/phase', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query({
                    text: 'UPDATE phases SET phase_status=$1, phase_type=$2, phase_description=$3,phase_manager=$4, division_id=$5, resolution_number=$6, accounting=$7, rfp_number=$8,contractor=$9, start_date=$10, estimated_completion=$11, budget=$12, work_complete=$13,actual=$14, notes=$15, modified_by=$16 WHERE phase_id=$17 ;',
                    values: [
                        req.body.phaseStatus.status_type_id,
                        req.body.phaseType.phase_type_id,
                        req.body.phaseDesc,
                        req.body.phaseManager,
                        req.body.division.division_id,
                        req.body.resoNumber,
                        JSON.stringify(req.body.accounting),
                        req.body.rfpNumber,
                        req.body.contractor,
                        req.body.startDate,
                        req.body.completionDate,
                        req.body.phaseBudget,
                        req.body.workComplete,
                        req.body.phaseActual,
                        req.body.notes,
                        req.body.modifiedBy,
                        req.body.phaseId
                    ]
                },function(err, result) {
                    done();
                    if (err) {
                        res.json({"success": false,"results": err});
                    } else {
                        res.json({"success" : true, "results" : result.rows});
                    }
                });
    });
})

//Project By ID
app.get('/api/v1/project/id/:project_id', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            text: 'SELECT * FROM projects WHERE project_id = $1;',
            values: [req.params.project_id]
    }, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})


//Phase by ID
app.get('/api/v1/phase/id/:phase_id', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            text: 'SELECT p.*, pt.phase_name, st.status_name, d.division, d.department, to_char(p.start_date, \'YYYY-MM-DD\') as start, to_char(p.estimated_completion, \'YYYY-MM-DD\') as complete ' +
            'FROM phases p ' +
            'JOIN phase_type pt ON p.phase_type = pt.phase_type_id ' +
            'JOIN status_type st ON p.phase_status = st.status_type_id ' +
            'JOIN divisions d ON p.division_id = d.division_id ' +
            'WHERE phase_id = $1;',
            values: [req.params.phase_id]
    }, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//List Departments
app.get('/api/v1/departments', stormpath.loginRequired, function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT DISTINCT department_id, department FROM divisions', function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//Department by ID
app.get('/api/v1/department/id/:dept_id', stormpath.loginRequired, function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            text: 'SELECT DISTINCT department_id, department from divisions WHERE department_id = $1',
            values: [req.params.dept_id]}, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//Department by Name
app.get('/api/v1/department/name/:dept_name', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            "text" : 'SELECT DISTINCT department_id, department from divisions WHERE department = $1;',
            "values" : [req.params.dept_name]
        }, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//List Divisions
app.get('/api/v1/divisions', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT division_id, division, department_id, department from divisions;', function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//Division by ID
app.get('/api/v1/division/id/:div_id', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            "text" : 'SELECT division_id, division from divisions WHERE division_id = $1;',
            "values" : [req.params.div_id]
        }, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//Division by Name
app.get('/api/v1/division/name/:div_name', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            "text" : 'SELECT division_id, division from divisions WHERE division = $1;',
            "values" : [req.params.div_name]
        }, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//Council Districts
app.get('/api/v1/council-districts', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * from council_districts ORDER BY district_id ASC;', function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//Phase Types
app.get('/api/v1/phase-types', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * from phase_type ORDER BY phase_name ASC;', function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})


app.get('/api/v1/phase-types/name/:name', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({text : 'SELECT * from phase_type WHERE phase_name = $1;', values : [req.params.name]}, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})


app.get('/api/v1/status-types', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * from status_type ORDER BY status_name ASC;', function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

app.get('/api/v1/status-types/name/:name', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({text : 'SELECT * from status_type WHERE status_name = $1;', values : [req.params.name]}, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows});
            }
        });
    });
})

//All Projects
app.get('/api/v1/projects', stormpath.loginRequired,  function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * from project_list;', function(err, result) {
            done();
            if (err) {
                console.error(err);
                res.send("Error " + err);
            } else {
                res.json(result.rows)
            }
        });
    });
})

app.get('/api/v1/:table/:field/:id', stormpath.loginRequired,  function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({text : 'SELECT * from ' + req.params.table + ' WHERE ' + req.params.field + ' = $1;', values : [req.params.id]}, function(err, result) {
            done();
            if (err) {
                res.json({"success" : false, "results" : err});
            } else {
                res.json({"success" : true, "results" : result.rows.length , "records" : result.rows});
            }
        });
    });
})

//Search Projects
app.get('/api/v1/project/search', stormpath.loginRequired,  function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        var queryArray = []
        var whereClause = ''

        if (req.query.q) {
            queryArray.push("full_text @@ to_tsquery('" + req.query.q + "')")
            whereClause = ' WHERE '
        } else {}
        if (req.query.dept) {
            queryArray.push("department_id = " + req.query.dept)
            whereClause = ' WHERE '
        } else {}
        if (req.query.div) {
            queryArray.push("division_id = " + req.query.div)
            whereClause = ' WHERE '
        } else {}
        if (req.query.cd) {
            queryArray.push("council_districts ? '" + req.query.cd + "'")
            whereClause = ' WHERE '
        } else {}
        if (req.query.type) {
            queryArray.push("phase_type = " + req.query.type)
            whereClause = ' WHERE '
        } else {}
        if (req.query.status) {
            queryArray.push("phase_status = " + req.query.status)
            whereClause = ' WHERE '
        } else {}

        if(queryArray){var query_string = queryArray.toString().replace(/,/g, " AND ")}
        else{}

        client.query(
            'SELECT * from project_list' + whereClause + query_string, function(err, result) {
            done();
            if (err) {
                res.json({
                    'success': false,
                    'results': err
                });
            } else {
                res.json({
                    'success': true,
                    'results': result.rows
                })
            }
        });
    });
})

//Project Stats
app.get('/api/v1/project/search-summary', stormpath.loginRequired,  function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        var queryArray = []
        var whereClause = ''
        if (req.query.q) {
            queryArray.push("full_text @@ to_tsquery('" + req.query.q + "')")
            whereClause = ' WHERE '
        } else {}
        if (req.query.dept) {
            queryArray.push("department_id = " + req.query.dept)
            whereClause = ' WHERE '
        } else {}
        if (req.query.div) {
            queryArray.push("division_id = " + req.query.div)
            whereClause = ' WHERE '
        } else {}
        if (req.query.cd) {
            queryArray.push("council_districts ? '" + req.query.cd + "'")
            whereClause = ' WHERE '
        } else {}

        var query_string = queryArray.toString().replace(/,/g, " AND ")

        client.query('SELECT ' +
            'SUM(budget) as budget, ' +
            'SUM(actual) as actual,' +
            'COUNT(DISTINCT project_id) as projects,' +
            'COUNT(DISTINCT phase_id) as phases,' +
            'COUNT(CASE WHEN phase_status = 1 THEN 1 ELSE null END) AS not_started,' +
            'COUNT(CASE WHEN phase_status = 2 THEN 1 ELSE null END) AS in_progress,' +
            'COUNT(CASE WHEN phase_status = 3 THEN 1 ELSE null END) AS completed,' +
            'COUNT(CASE WHEN cost_variance > .1 THEN 1 ELSE null END) AS under_budget,' +
            'COUNT(CASE WHEN cost_variance <= .1 AND cost_variance >= -.1 THEN 1 ELSE null END) AS on_budget,' +
            'COUNT(CASE WHEN cost_variance < -.1 THEN 1 ELSE null END) AS over_budget,' +
            'COUNT(CASE WHEN schedule_variance > .1 THEN 1 ELSE null END) AS ahead_schedule,' +
            'COUNT(CASE WHEN schedule_variance <= .1 AND cost_variance >= -.1 THEN 1 ELSE null END) AS on_schedule,' +
            'COUNT(CASE WHEN schedule_variance < -.1 THEN 1 ELSE null END) AS behind_schedule' +
            ' FROM project_list' + whereClause + query_string,
            function(err, result) {
                done();
                if (err) {
                    console.error(err);
                    res.json({
                        'query': 'SELECT SUM(actual) as actual, SUM(budget) as budget, COUNT(project_id) as projects, COUNT(phase_id) as phases FROM project_list' + whereClause + query_string,
                        'error': err,
                        'query': 'SELECT ' +
            'SUM(budget) as budget, ' +
            'SUM(actual) as actual,' +
            'COUNT(DISTINCT project_id) as projects,' +
            'COUNT(DISTINCT phase_id) as phases,' +
            'COUNT(CASE WHEN phase_status = 1 THEN 1 ELSE null END) AS not_started,' +
            'COUNT(CASE WHEN phase_status = 2 THEN 1 ELSE null END) AS in_progress,' +
            'COUNT(CASE WHEN phase_status = 3 THEN 1 ELSE null END) AS completed,' +
            'COUNT(CASE WHEN cost_variance > .1 THEN 1 ELSE null END) AS under_budget,' +
            'COUNT(CASE WHEN cost_variance <= .1 AND cost_variance >= -.1 THEN 1 ELSE null END) AS on_budget,' +
            'COUNT(CASE WHEN cost_variance < -.1 THEN 1 ELSE null END) AS over_budget,' +
            'COUNT(CASE WHEN schedule_variance > .1 THEN 1 ELSE null END) AS ahead_schedule,' +
            'COUNT(CASE WHEN schedule_variance <= .1 AND cost_variance >= -.1 THEN 1 ELSE null END) AS on_schedule,' +
            'COUNT(CASE WHEN schedule_variance < -.1 THEN 1 ELSE null END) AS behind_schedule' +
            ' FROM project_list' + whereClause + query_string
                    });
                } else {
                    res.json(
                        result.rows

                    )
                }
            });
    });
})

//Phase Data by Project ID and Phase ID
app.get('/api/v1/project/:project_id/phase/:phase_id', stormpath.loginRequired,  function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            text: 'SELECT * FROM all_project_phases WHERE project_id = $1 AND phase_id = $2 ORDER BY start_date DESC;',
            values: [req.params.project_id, req.params.phase_id]
        }, function(err, result) {
            done();
            if (err) {
                res.json({
                    "success": false,
                    "results": err
                });
            } else {
                res.json({
                    "success": true,
                    "results": result.rows
                });

            }
        });
    });
});

//Phases by Project ID
app.get('/api/v1/project-phases/:project_id', stormpath.loginRequired,  function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            text: 'SELECT project_id, phase_id, phase_name FROM all_project_phases WHERE project_id = $1 ORDER BY start_date ASC;',
            values: [req.params.project_id]
        }, function(err, result) {
            done();
            if (err) {
                res.json({
                    "success": false,
                    "results": err
                });
            } else {

                res.json({
                    "success": true,
                    "results": result.rows
                });
            }
        });
    });
});

//Phase Notes by Project ID and Phase ID
app.get('/api/v1/phase-notes/:phase_id', stormpath.loginRequired,  function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query({
            text: 'SELECT min(date_modified) as date_modified, notes FROM phases_history WHERE phase_id = $1 AND notes IS NOT NULL GROUP BY notes ORDER BY date_modified DESC;',
            values: [req.params.phase_id]
        }, function(err, result) {
            done();
            if (err) {
                res.json({
                    "success": false,
                    "results": err
                });
            } else {

                res.json({
                    "success": true,
                    "results": result.rows
                });
            }
        });
    });
});

//Server

app.on('stormpath.ready', function () {
var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
})


function nullCheck (input){
    if (input) {
    return input}
    else {return ''}
}
