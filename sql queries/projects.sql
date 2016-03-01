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

CREATE TRIGGER phases_history_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON phases
  FOR EACH ROW
  EXECUTE PROCEDURE phases_log();


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