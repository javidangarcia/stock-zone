import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('capstone', 'javierdangarcia', 'meta123', {
  host: 'localhost',
  dialect: 'postgres'
});