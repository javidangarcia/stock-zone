CREATE DATABASE IF NOT EXISTS stockzone;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    username varchar(255) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    picture varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    logo VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    userid INT REFERENCES users(id),
    stockid INT REFERENCES stocks(id),
    UNIQUE(userid, stockid)
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    userid INT REFERENCES users(id),
    stockid INT REFERENCES stocks(id),
    UNIQUE(userid, stockid)
);

CREATE TABLE IF NOT EXISTS dislikes (
    id SERIAL PRIMARY KEY,
    userid INT REFERENCES users(id),
    stockid INT REFERENCES stocks(id),
    UNIQUE(userid, stockid)
);