CREATE DATABASE job_board;
USE job_board;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role ENUM('jobseeker', 'employer','admin')
);


INSERT INTO jobs (title, description, company, location, category)
VALUES 
('Marketing Manager', 'Lead marketing campaigns and strategies.', 'ABC Marketing', 'San Francisco', 'Marketing'),
('Software Engineer', 'Develop and maintain web applications.', 'Tech Innovators', 'New York', 'IT'),
('Graphic Designer', 'Create stunning designs for various campaigns.', 'Creative Studio', 'Los Angeles', 'Design'),
('Sales Executive', 'Manage client relationships and close deals.', 'SalesPro Inc', 'Chicago', 'Sales'),
('HR Specialist', 'Handle recruitment and employee relations.', 'PeopleFirst HR', 'Boston', 'Human Resources'),
('Content Writer', 'Write blog posts, articles, and web content.', 'WriteWorld', 'Austin', 'Content Writing'),
('Data Analyst', 'Analyze data trends and generate reports.', 'Data Insights', 'Seattle', 'Data Analysis'),
('Mobile App Developer', 'Develop apps for Android and iOS.', 'AppMakers', 'San Diego', 'IT'),
('Product Manager', 'Oversee product development lifecycle.', 'Visionary Products', 'San Francisco', 'Management'),
('Customer Support Associate', 'Handle customer queries and issues.', 'HelpDesk Services', 'New York', 'Customer Support');


CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  location VARCHAR(100),
  category VARCHAR(100),
  employer_id INT,
  FOREIGN KEY (employer_id) REFERENCES users(id)
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  job_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);  

