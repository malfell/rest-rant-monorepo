'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // adds password column to table schema?
      return queryInterface.addColumn('users', 'password_digest', {
        type: Sequelize.DataTypes.STRING
      })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    // removes column
      return queryInterface.removeColumn('users', 'password_digest')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
