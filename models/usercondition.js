const {Sequelize} = require("sequelize");
class UserCondition extends Sequelize.Model {
    static initiate(sequelize) {
      return super.init(
        {
          usercondition_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          condition_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
          
          },
          condition_value: {
            type: Sequelize.BIGINT,
            allowNull: false,
          },
          last_updated: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
           
          },
          tier_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
           
          },
        },
        {
          sequelize,
          timestamps: false,
          modelName: 'UserCondition',
          tableName: 'user_conditions',
          charset: 'utf8',
          collate: 'utf8_general_ci',
        }
      );
    }
  
    static associate(db) {
      db.UserCondition.belongsTo(db.User, { foreignKey: 'user_id' });
      db.UserCondition.belongsTo(db.Condition, { foreignKey: 'condition_id' });
      db.UserCondition.belongsTo(db.Tier, { foreignKey: 'tier_id' });
    }
  }
  
  module.exports = UserCondition;
  