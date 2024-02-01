CREATE DATABASE IF NOT EXISTS stockzone;

CREATE TABLE IF NOT EXISTS sessions (
    sid varchar(255) NOT NULL PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
);

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
    ticker varchar(255) NOT NULL UNIQUE,
    name varchar(255) NOT NULL,
    description varchar(2000) NOT NULL,
    sector varchar(255) NOT NULL,
    price float NOT NULL,
    logo varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    userid int NOT NULL REFERENCES users(id),
    stockid int NOT NULL REFERENCES stocks(id),
    UNIQUE(userid, stockid)
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    userid int NOT NULL REFERENCES users(id),
    stockid int NOT NULL REFERENCES stocks(id),
    UNIQUE(userid, stockid)
);

CREATE TABLE IF NOT EXISTS dislikes (
    id SERIAL PRIMARY KEY,
    userid int NOT NULL REFERENCES users(id),
    stockid int NOT NULL REFERENCES stocks(id),
    UNIQUE(userid, stockid)
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content varchar(255) NOT NULL,
    userid int NOT NULL REFERENCES users(id),
    stockid int NOT NULL REFERENCES stocks(id)
);