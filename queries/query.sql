CREATE DATABASE gamingLeague;

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255),
    username VARCHAR(255),
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    isAdmin BOOLEAN
);