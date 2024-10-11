const {Sequelize} = require("sequelize");

class Report extends Sequelize.Model {
    static initiate(sequelize) {
        return super.init(
            {
                report_id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                reporter_id: {
                    type: Sequelize.BIGINT, // 신고한 유저의 user_id
                    allowNull: false
                },
                reported_id: {
                    type: Sequelize.BIGINT, // 신고당한 유저의 user_id
                    allowNull: false
                },
                diary_id: {
                    type: Sequelize.BIGINT, // 신고한 일기의 id
                    allowNull: true
                },
                comment_id: {
                    type: Sequelize.BIGINT, // 신고한 댓글의 id
                    allowNull: true
                },
                status: {
                    type: Sequelize.STRING(100),
                    allowNull:false
                },
                report_type: {
                    type: Sequelize.STRING(100),
                    allowNull:false
                },
                report_reason: {
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Report",
                tableName: "reports",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {
        // 신고한 사람
        this.belongsTo(db.User,{foreignKey : "reporter_id", targetKey: "user_id", onDelete: "CASCADE"});
        // 신고당한 사람
        this.belongsTo(db.User,{foreignKey : "reported_id", targetKey: "user_id", onDelete: "CASCADE"});
        // 신고한 일기
        this.belongsTo(db.Diary,{foreignKey : "diary_id", targetKey: "diary_id", onDelete: "CASCADE"}); // (N:1)하나의 다이어리에 여러 개의 신고가 있을 수 있음
    }
}

module.exports = Report;