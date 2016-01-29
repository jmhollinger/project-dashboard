SELECT * 
FROM Projects
WHERE (project_id, date_submitted) IN
(SELECT project_id, MAX(date_submitted) as date_submitted FROM Projects GROUP BY project_id) 