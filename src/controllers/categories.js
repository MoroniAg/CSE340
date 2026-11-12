// Import any needed model functions
import { getCategories } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

// Export any controller functions
export { showCategoriesPage };