/*Phases Hisotry Table*/
CREATE TABLE phases_history
(
  log_id SERIAL PRIMARY KEY,
  log_type character varying(20) NOT NULL,
  log_timestamp timestamp with time zone NOT NULL,
  phase_id integer NOT NULL,
  project_id integer NOT NULL,
  phase_status character varying(25),
  phase_name character varying(100) NOT NULL,
  phase_description character varying(250) NOT NULL,
  phase_manager character varying(100) NOT NULL,
  division_id integer,
  resolution_number character varying(10),
  accounting_fy character(4) NOT NULL,
  accounting_fund character(4) NOT NULL,
  accouting_dept character(6) NOT NULL,
  accounting_section character(4) NOT NULL,
  accounting_account character(5) NOT NULL,
  contractor character varying(100) NOT NULL,
  start_date date NOT NULL,
  estimated_completion date NOT NULL,
  budget money NOT NULL,
  work_complete numeric(3,2) NOT NULL,
  actual money NOT NULL,
  notes character varying(250),
  modified_by character varying(100) NOT NULL,
  date_modified timestamp with time zone NOT NULL
)


/*Projects Project Hisotry Table*/
CREATE TABLE projects_history
(
  log_id SERIAL PRIMARY KEY,
  log_type character varying(20) NOT NULL,
  log_timestamp timestamp with time zone NOT NULL,
  project_id integer NOT NULL,
  project_name character varying(100) NOT NULL,
  project_description character varying(250) NOT NULL,
  estimated_total_budget money NOT NULL,
  funded money NOT NULL,
  council_districts jsonb,
  lat numeric(8,6),
  lng numeric(8,6),
  modified_by character varying(100) NOT NULL,
  date_modified timestamp with time zone NOT NULL
)


/*Phases History Logger*/
DROP TRIGGER phases_history_trigger ON phases;

DROP FUNCTION phases_log();

CREATE OR REPLACE FUNCTION phases_log()
  RETURNS trigger AS
$BODY$
BEGIN
 IF (TG_OP = 'INSERT') THEN
  INSERT INTO phases_history(
            log_type, phase_id, project_id, phase_status, 
            phase_type, phase_description, phase_manager, division_id, resolution_number,
            accounting, rfp_number, contractor, start_date, estimated_completion, 
            budget, work_complete, actual, notes, modified_by, date_modified)
    VALUES ('Initial', NEW.phase_id, NEW.project_id, NEW.phase_status, 
            NEW.phase_type, NEW.phase_description, NEW.phase_manager, NEW.division_id, NEW.resolution_number, 
            NEW.accounting, NEW.rfp_number, NEW.contractor, NEW.start_date, NEW.estimated_completion, 
            NEW.budget, NEW.work_complete, NEW.actual, NEW.notes, NEW.modified_by, NEW.date_modified);
  RETURN NEW;
 ELSIF (TG_OP = 'UPDATE') AND (NEW.phase_status = 3 )THEN
  INSERT INTO phases_history(
            log_type, phase_id, project_id, phase_status, 
            phase_type, phase_description, phase_manager, division_id, resolution_number, 
            accounting, rfp_number, contractor, start_date, estimated_completion, 
            budget, work_complete, actual, notes, modified_by, date_modified)
    VALUES ('Final', NEW.phase_id, NEW.project_id, NEW.phase_status, 
            NEW.phase_name, NEW.phase_description, NEW.phase_manager, NEW.division_id, NEW.resolution_number, 
            NEW.accounting, NEW.rfp_number, NEW.contractor, NEW.start_date, NEW.estimated_completion, 
            NEW.budget, NEW.work_complete, NEW.actual, NEW.notes, NEW.modified_by, NEW.date_modified);
  RETURN NEW;
 ELSIF (TG_OP = 'UPDATE') AND (NEW.phase_status != 3 ) THEN
  INSERT INTO phases_history(
            log_type, phase_id, project_id, phase_status, 
            phase_type, phase_description, phase_manager, division_id, resolution_number, 
            accounting, rfp_number, contractor, start_date, estimated_completion, 
            budget, work_complete, actual, notes, modified_by, date_modified)
    VALUES ('Update', NEW.phase_id, NEW.project_id, NEW.phase_status, 
            NEW.phase_type, NEW.phase_description, NEW.phase_manager, NEW.division_id, NEW.resolution_number, 
            NEW.accounting, NEW.rfp_number, NEW.contractor, NEW.start_date, NEW.estimated_completion, 
            NEW.budget, NEW.work_complete, NEW.actual, NEW.notes, NEW.modified_by, NEW.date_modified);
  RETURN NEW;
 ELSE
 RETURN NULL;
 END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION phases_log()
  OWNER TO puwvzezwflqvei;


CREATE TRIGGER phases_history_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON phases
  FOR EACH ROW
  EXECUTE PROCEDURE phases_log();

/*Project History Trigger*/
CREATE OR REPLACE FUNCTION projects_log()
  RETURNS trigger AS
$BODY$
BEGIN
 IF (TG_OP = 'INSERT') THEN
  INSERT INTO projects_history(
            log_type, project_id, project_name, project_description, 
            estimated_total_budget, funded, council_districts, lat, lng, 
            modified_by, date_modified)
  VALUES ('Initial', NEW.project_id, NEW.project_name, NEW.project_description, 
            NEW.estimated_total_budget, NEW.funded, NEW.council_districts, NEW.lat, NEW.lng, 
            NEW.modified_by, NEW.date_modified);
  RETURN NEW
 ELSIF (TG_OP = 'UPDATE') THEN
  INSERT INTO projects_history(
            log_type, project_id, project_name, project_description, 
            estimated_total_budget, funded, council_districts, lat, lng, 
            modified_by, date_modified)
  VALUES ('Update', NEW.project_id, NEW.project_name, NEW.project_description, 
            NEW.estimated_total_budget, NEW.funded, NEW.council_districts, NEW.lat, NEW.lng, 
            NEW.modified_by, NEW.date_modified);
  RETURN NEW;
 ELSE
 RETURN NULL;
 END IF;
END;
$BODY$
LANGUAGE plpgsql VOLATILE


/*Project History Trigger*/
CREATE TRIGGER projects_history_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON phases
  FOR EACH ROW
  EXECUTE PROCEDURE projects_log();

/*Insert Into Projects and Phases*/
WITH project_insert AS (
    INSERT INTO projects (project_name, project_description, estimated_total_budget, 
            funded, council_districts, lat, lng, modified_by, date_modified)
    VALUES ('Southland Drive Sidewalks','One Mile of Sidewalks on Southland Drive', 2250000, 250000, '["3","10","11"]', 38.123456, -84.123456, 'Jonathan Hollinger', now())
    RETURNING project_ID
    ) 
WITH phase_insert AS (
INSERT INTO phases (project_id, phase_status, phase_name, phase_description, 
            phase_manager, division_id, resolution_number, accounting_fy, 
            accounting_fund, accouting_dept, accounting_section, accounting_account, 
            contractor, start_date, estimated_completion, budget, work_complete, 
            actual, notes, modified_by, date_modified)
SELECT project_insert.project_id,'Not Started','Scoping and Design', 'Scoping and final design of sidewalk project.',
'Jonathan Hollinger', 1, 'R2016-56', '2016',
 '1101', '162101', '1601', '71299', 'Palmer Engineering', '2016-01-01','2017-01-01', 250000, .0, 0, 'Negotiating contract.', 'Jonathan Hollinger', now()
 FROM project_insert
RETURNING projectidphase_id
 )
SELECT project_id, phase_id FROM phase_insert;


SELECT
ph.work_complete,
ph.actual,
ph.budget,
ph.estimated_completion - ph.start_date as Days,
(current_date - ph.start_date) as DaysIn,
(current_date - ph.start_date)::numeric / (ph.estimated_completion - ph.start_date)::numeric as schedule_complete,
(ph.work_complete * ph.budget) as EV,
((current_date - ph.start_date) / (ph.estimated_completion - ph.start_date)::numeric * ph.budget) as PV,
((ph.work_complete * ph.budget) - ph.actual) / (ph.work_complete * ph.budget) as Cost_Variance,
((ph.work_complete * ph.budget) - ((current_date - ph.start_date) / (ph.estimated_completion - ph.start_date)::numeric * ph.budget)) / (((current_date - ph.start_date) / (ph.estimated_completion - ph.start_date)::numeric * ph.budget)) as Schedule_Variance
FROM phases ph