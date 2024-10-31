const { Sequelize } = require('sequelize');

class Notice extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        notice_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        view_count: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        admin_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Notice',
        tableName: 'notices',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Notice.belongsTo(db.Admin, {
      foreignKey: 'admin_id',
      targetKey: 'admin_id',
      onDelete: 'SET NULL',
    });
  }
}

module.exports = Notice;
