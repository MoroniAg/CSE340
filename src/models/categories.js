import db from './db.js';

const getCategories = async () => {
    const result = await db.query(`SELECT category_id, category_name
    FROM categories
    ORDER BY category_name`);

    return result.rows;
}

const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, category_name
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM categories c
        JOIN project_categories pc ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT sp.project_id, sp.title
        FROM service_projects sp
        JOIN project_categories pc ON pc.project_id = sp.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.title;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export { getCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId };