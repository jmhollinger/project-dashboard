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