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
    return result.rows || [];
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
    console.log(result.rows)
    return result.rows;
};

const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO categories (category_name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName]);
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE categories
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName, categoryId]);
    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};

const getCategoriesByServiceProjectId = async (serviceProjectId) => {
    const query = `
        SELECT pc.project_id, pc.category_id, c.category_name
        FROM project_categories pc
        JOIN categories c ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        GROUP BY pc.project_id, pc.category_id, c.category_name
        ORDER BY pc.project_id, c.category_name;
    `;

    const result = await db.query(query, [serviceProjectId]);
    return result.rows || [];
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export {
    getCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory,
};