const {Sequelize} = require("sequelize");
class Condition extends Sequelize.Model {
    static initiate(sequelize) {
      return super.init(
        {
          condition_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          condition_type: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          tier_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
        
          },
          condition_value: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        },
        {
          sequelize,
          timestamps: false,
          modelName: 'Condition',
          tableName: 'conditions',
          charset: 'utf8',
          collate: 'utf8_general_ci',
        }
      );
    }
  
    static associate(db) {
      db.Condition.belongsTo(db.Tier, { foreignKey: 'tier_id' });
    }
  }
  
  module.exports = Condition;
  