// Import any needed model functions
import { getCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByServiceProjectId, createCategory, updateCategory, updateCategoryAssignments } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

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

    const projects = await getProjectsByCategoryId(category.category_id);
    res.render('category', { title: category.category_name, category, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(req.body.categoryName);
        req.flash('success', 'Category added successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res, next) => {
    const category = await getCategoryById(req.params.id);
    if (!category) {
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
    }

    res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    try {
        await updateCategory(req.params.id, req.body.categoryName);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${req.params.id}`);
    } catch (error) {
        req.flash('error', 'There was an error updating the category.');
        res.redirect(`/edit-category/${req.params.id}`);
    }
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm
};