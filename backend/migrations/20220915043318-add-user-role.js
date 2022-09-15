'use strict';

// create migration: npx sequelize-cli migration:generate --name add-user-role
// update table schema: npx sequelize-cli db:migrate

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // use ENUM datatype so our database can force every user to act as "reviewer" or "admin"
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.DataTypes.ENUM,
      values: [
        'reviewer',
        'admin'
      ],
      defaultValue: 'reviewer'
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('users', 'role')
  }
};
