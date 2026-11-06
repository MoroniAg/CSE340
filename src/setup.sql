CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    project_date DATE,
    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

INSERT INTO service_projects
(organization_id, title, description, location, project_date)
VALUES
-- Organización 1
(1, 'Community Park Cleanup',
 'Clean and beautify the local community park.',
 'Boise, Idaho',
 '2026-03-15'),

(1, 'Food Bank Volunteer Day',
 'Sort and package donations for families in need.',
 'Meridian, Idaho',
 '2026-04-10'),

(1, 'School Supply Drive',
 'Collect and distribute school supplies to students.',
 'Nampa, Idaho',
 '2026-05-01'),

(1, 'Senior Center Assistance',
 'Provide support and companionship to senior citizens.',
 'Caldwell, Idaho',
 '2026-06-12'),

(1, 'Neighborhood Tree Planting',
 'Plant trees to improve local green spaces.',
 'Eagle, Idaho',
 '2026-07-19'),

-- Organización 2
(2, 'Beach Cleanup Initiative',
 'Remove litter and protect marine ecosystems.',
 'Newport Beach, California',
 '2026-03-22'),

(2, 'Youth Mentorship Workshop',
 'Mentor teenagers in career and education planning.',
 'Irvine, California',
 '2026-04-18'),

(2, 'Homeless Shelter Support',
 'Prepare and serve meals for shelter residents.',
 'Anaheim, California',
 '2026-05-14'),

(2, 'Community Garden Project',
 'Build and maintain a community vegetable garden.',
 'Santa Ana, California',
 '2026-06-08'),

(2, 'Charity Fundraising Event',
 'Organize a fundraising event for local charities.',
 'Fullerton, California',
 '2026-07-25'),

-- Organización 3
(3, 'River Restoration Project',
 'Help restore and protect the local river habitat.',
 'Provo, Utah',
 '2026-03-30'),

(3, 'Literacy Program',
 'Teach reading and writing skills to children.',
 'Orem, Utah',
 '2026-04-21'),

(3, 'Health Awareness Fair',
 'Provide free health screenings and education.',
 'Lehi, Utah',
 '2026-05-17'),

(3, 'Animal Shelter Volunteer Day',
 'Assist with animal care and adoption activities.',
 'Spanish Fork, Utah',
 '2026-06-20'),

(3, 'Community Recycling Drive',
 'Collect recyclable materials and educate residents.',
 'American Fork, Utah',
 '2026-08-05');




INSERT INTO categories (category_name)
VALUES
('Education'),
('Environment'),
('Community Service');

INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 1),
(3, 2);