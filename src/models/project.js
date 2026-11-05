import db from './db.js';

const getProjects = async () => {
    const result = await db.query(`
        SELECT p.*, o.name AS organization_name
        FROM service_projects p
        JOIN organization o
            ON p.organization_id = o.organization_id
    `);

    return result.rows;
};

export { getProjects };