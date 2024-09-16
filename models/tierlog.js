const {Sequelize} = require("sequelize");

class TierLog extends Sequelize.Model {
    static initiate(sequelize) {
      return super.init(
        {
          log_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
           
          },
          pre_tier: {
            type: Sequelize.BIGINT,
            allowNull: false,
          
          },
          new_tier: {
            type: Sequelize.BIGINT,
            allowNull: false,
            
          },
          changed_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        {
          sequelize,
          timestamps: false,
          modelName: 'TierLog',
          tableName: 'tier_logs',
          charset: 'utf8',
          collate: 'utf8_general_ci',
        }
      );
    }
  
    static associate(db) {
      db.TierLog.belongsTo(db.User, { foreignKey: 'user_id' });
      db.TierLog.belongsTo(db.Tier, { foreignKey: 'pre_tier' });
      db.TierLog.belongsTo(db.Tier, { foreignKey: 'new_tier' });
    }
  }
  
  module.exports = TierLog;
  