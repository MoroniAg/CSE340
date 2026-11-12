import db from './db.js';

const getProjects = async () => {
    const result = await db.query(`
        select distinct sp.title, sp.description, sp."location", sp.project_date, ca.category_name, org.name as "Organization Name"  from project_categories pc 
join service_projects sp on pc.project_id=sp.project_id 
join categories ca on pc.category_id = ca.category_id
join organization org on org.organization_id = sp.organization_id

    `);

    return result.rows;
};


const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

export { getProjects, getProjectsByOrganizationId };