// Import any needed model functions
import { getOrganizations } from '../models/organizations.js';

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Export any controller functions
export { showOrganizationsPage };