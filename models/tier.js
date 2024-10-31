const { Sequelize } = require('sequelize');

class Tier extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        tier_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        tier_name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        benefits: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Tier',
        tableName: 'tiers',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    // db.MembershipLevel.hasMany(db.MembershipLevelChange, {
    //   foreignKey: 'new_level_id',
    //   sourceKey: 'level_id',
    //   onDelete: 'SET NULL',
    // });
    // db.MembershipLevel.hasMany(db.MembershipLevelChange, {
    //   foreignKey: 'previous_level_id',
    //   sourceKey: 'level_id',
    //   onDelete: 'SET NULL',
    // });
    
  }
}

module.exports = Tier;
