// seed an admin: npx sequelize-cli seed:generate --name add-admin
// insert admin into users table: npx db: seed --name 20220915044236-add-admin.js (WRONG INSTRUCTIONS)
// THIS COMMAND: sequelize db:seed --seed 20220915044236-add-admin.js

'use strict';
// bcrypt needed for admin password
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      first_name: 'Ellie',
      last_name: 'Cordova',
      email: 'admin@sos.com',
      role: 'admin',
      password_digest: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
      created_at: new Date(),
      updated_at: new Date()
    }])

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@sos.com'
    })

  }
};
