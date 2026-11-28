import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (user) {
        req.session.user = user;
        req.flash('success', 'Login successful!');
        console.log('Logged in user:', user);
        res.redirect('/dashboard');
    } else {
        req.flash('error', 'Login failed. Please check your email and password.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.destroy();
    req.flash('success', 'You have been logged out.');
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }

    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        next();
    };
};

const showDashboard = (req, res) => {
    const { name, email } = req.session.user;

    res.render('dashboard', { title: 'Dashboard', name, email });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};