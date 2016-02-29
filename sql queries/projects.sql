SELECT * FROM view_project_list
WHERE
department_id = 1 AND
division_id = 4 AND
council_districts ? '11'

select * FROM view_project_list WHERE
full_text @@ to_tsquery('sidewalks') AND
department_id = 1 AND
division_id = 4 AND
council_districts ? '3';


-- View: view_project_list

-- DROP VIEW view_project_list;

CREATE OR REPLACE VIEW view_project_list AS 
 SELECT pr.project_id,
    to_tsvector((((((((((((((pr.project_name::text || ' '::text) || pr.project_description::text) || ' '::text) || ph.phase_name::text) || ' '::text) || ph.phase_description::text) || ' '::text) || ph.phase_manager::text) || ' '::text) || ph.resolution_number::text) || ' '::text) || d.department::text) || ' '::text) || d.division::text) AS full_text,
    ph.phase_id,
    d.department_id,
    ph.division_id,
    pr.council_districts,
    pr.lat,
    pr.lng,
    ph.phase_status,
    pr.project_name,
    pr.project_description,
    ph.phase_name,
    ph.phase_description,
    d.department,
    d.division,
    ph.budget,
    ph.actual,
    ph.start_date,
    ph.estimated_completion,
    ph.actual / ph.budget * 100::double precision AS budget_percentage,
    ph.work_complete * 100::numeric AS work_complete
   FROM projects pr
     JOIN phases ph ON pr.project_id = ph.project_id
     JOIN divisions d ON d.division_id = ph.division_id;

ALTER TABLE view_project_list
  OWNER TO puwvzezwflqvei;

-- DROP TRIGGER phases_history_trigger ON phases;

CREATE TRIGGER phases_history_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON phases
  FOR EACH ROW
  EXECUTE PROCEDURE phases_log();



DROP FUNCTION phases_log();

CREATE OR REPLACE FUNCTION phases_log()
  RETURNS trigger AS
$BODY$
BEGIN
 IF (TG_OP = 'INSERT') THEN
  INSERT INTO phases_history(
            log_type, phase_id, project_id, phase_status, 
            phase_type, phase_description, phase_manager, division_id, resolution_number, 
            accounting_fy, accounting_fund, accouting_dept, accounting_section, 
            accounting_account, contractor, start_date, estimated_completion, 
            budget, work_complete, actual, notes, modified_by, date_modified)
    VALUES ('Initial', NEW.phase_id, NEW.project_id, NEW.phase_status, 
            NEW.phase_type, NEW.phase_description, NEW.phase_manager, NEW.division_id, NEW.resolution_number, 
            NEW.accounting_fy, NEW.accounting_fund, NEW.accouting_dept, NEW.accounting_section, 
            NEW.accounting_account, NEW.contractor, NEW.start_date, NEW.estimated_completion, 
            NEW.budget, NEW.work_complete, NEW.actual, NEW.notes, NEW.modified_by, NEW.date_modified);
  RETURN NEW;
 ELSIF (TG_OP = 'UPDATE') AND (NEW.phase_status = 3 )THEN
  INSERT INTO phases_history(
            log_type, phase_id, project_id, phase_status, 
            phase_type, phase_description, phase_manager, division_id, resolution_number, 
            accounting_fy, accounting_fund, accouting_dept, accounting_section, 
            accounting_account, contractor, start_date, estimated_completion, 
            budget, work_complete, actual, notes, modified_by, date_modified)
    VALUES ('Final', NEW.phase_id, NEW.project_id, NEW.phase_status, 
            NEW.phase_name, NEW.phase_description, NEW.phase_manager, NEW.division_id, NEW.resolution_number, 
            NEW.accounting_fy, NEW.accounting_fund, NEW.accouting_dept, NEW.accounting_section, 
            NEW.accounting_account, NEW.contractor, NEW.start_date, NEW.estimated_completion, 
            NEW.budget, NEW.work_complete, NEW.actual, NEW.notes, NEW.modified_by, NEW.date_modified);
  RETURN NEW;
 ELSIF (TG_OP = 'UPDATE') AND (NEW.phase_status != 3 ) THEN
  INSERT INTO phases_history(
            log_type, phase_id, project_id, phase_status, 
            phase_type, phase_description, phase_manager, division_id, resolution_number, 
            accounting_fy, accounting_fund, accouting_dept, accounting_section, 
            accounting_account, contractor, start_date, estimated_completion, 
            budget, work_complete, actual, notes, modified_by, date_modified)
    VALUES ('Update', NEW.phase_id, NEW.project_id, NEW.phase_status, 
            NEW.phase_type, NEW.phase_description, NEW.phase_manager, NEW.division_id, NEW.resolution_number, 
            NEW.accounting_fy, NEW.accounting_fund, NEW.accouting_dept, NEW.accounting_section, 
            NEW.accounting_account, NEW.contractor, NEW.start_date, NEW.estimated_completion, 
            NEW.budget, NEW.work_complete, NEW.actual, NEW.notes, NEW.modified_by, NEW.date_modified);
  RETURN NEW;
 ELSE
 RETURN NULL;
 END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE