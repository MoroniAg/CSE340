import db from './db.js';

const getOrganizations = async () => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        ORDER BY name
    `);

    return result.rows;
};

export { getOrganizations };