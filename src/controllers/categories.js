// Import any needed model functions
import { getCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const category = await getCategoryById(req.params.id);

    if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
    }

    const projects = await getProjectsByCategoryId(req.params.id);
    res.render('category', { title: category.category_name, category, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };