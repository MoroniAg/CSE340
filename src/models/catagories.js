import db from './db.js';

const getCategories = async () => {
    const result = await db.query(`SELECT category_id, category_name
    FROM categories
    ORDER BY category_name`);

    return result.rows;
}


export { getCategories };