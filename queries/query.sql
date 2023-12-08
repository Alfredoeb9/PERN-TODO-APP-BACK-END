CREATE DATABASE gamingLeague;

CREATE TABLE users (
    id VARCHAR(255),
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255),
    username VARCHAR(255),
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    isAdmin BOOLEAN,
    UNIQUE (id)
);