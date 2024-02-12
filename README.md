# job-search-app
This is a robust job search application built using Express.js, Node.js, MongoDB, and Mongoose. The app integrates various features to enhance user experience, security, and efficiency in job searching and application processes.

## Features:
* **Filtering Options:** Users can filter job listings to find the ones that match their requirements.
* **User Authentication:** Secure authentication system using JWT tokens, ensuring that only authenticated users can access certain features.
* **Role-based Authorization:** Two roles are implemented - HR and User, each with specific permissions and access levels.
* **Data Validation:** Joi is used for data validation, ensuring that only properly formatted data is accepted.
* **User Data Management:** The app securely manages user data, including registration, login, and profile management.
* **Company Data Management:** It handles data related to companies, allowing them to post job listings and manage their profiles.
* **Job Application Handling:** Users can apply for jobs through the app, and the application process is smoothly managed.
* **File Handling and Cloud Storage:** Multer is used for file handling, enabling users to upload resumes, cover letters, etc. Files are stored securely on Cloudinary.
* **Email Notifications:** Nodemailer is integrated to send email notifications for various events, such as job application confirmation.
* **Environment Variables:** Secret data is stored securely in a .env file using dotenv, ensuring sensitive information is protected.

## Technologies Used:
* **Express.js:** For building the web application and handling HTTP requests.
* **Node.js:** Providing the runtime environment for the application.
* **MongoDB:** As the database to store user, company, and job data.
* **Mongoose:** As the ODM (Object Data Modeling) library for MongoDB, facilitating interactions with the database.
* **JWT (JSON Web Tokens):** For user authentication and authorization.
* **Joi:** For data validation.
* **Bcrypt:** For hashing passwords and sensitive data.
* **Multer:** For file handling and uploads.
* **Cloudinary:** For secure cloud storage of uploaded files.
* **Nodemailer:** For sending email notifications.
* **dotenv:** For loading environment variables from a .env file.
