'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const User = require("./user");
const Admin = require("./admin");
const Diary = require("./diary");
const Board = require("./board");
const TodayAnswer = require("./today_answers");
const TodayQuestion = require("./today_questions");
const Routine = require("./routine");
const Todo = require("./todos");
const Comment = require("./comment");
const Friend = require('./friend');
const Like = require('./like');
const Notification = require("./notification");
const Point = require("./point");
const Profile = require("./profile");
const QnA = require("./qna");
const Answer = require("./answer");
const PointCriteria = require('./point_criteria');
const Report = require("./report");
const Tier= require("./tier");
const TierLog = require("./tierlog");
const Condition = require("./condition");
const UserCondition = require("./usercondition");





const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config); 

db.User = User;
db.Admin = Admin;
db.Diary = Diary;
db.Board = Board;
db.TodayAnswer = TodayAnswer;
db.TodayQuestion = TodayQuestion;
db.Routine = Routine;
db.Todo = Todo;
db.Comment = Comment;
db.Friend = Friend;
db.Like = Like;
db.Notification = Notification;
db.Point = Point;
db.PointCriteria = PointCriteria;
db.Profile = Profile;
db.QnA = QnA;
db.Answer = Answer;
db.Tier = Tier;
db.Condition = Condition;
db.TierLog = TierLog;
db.UserCondition = UserCondition;
db.Report = Report;
db.sequelize = sequelize;




// 관계 설정



User.initiate(sequelize)
Diary.initiate(sequelize)
Board.initiate(sequelize)
TodayAnswer.initiate(sequelize)
TodayQuestion.initiate(sequelize)
Routine.initiate(sequelize)
Todo.initiate(sequelize)
Comment.initiate(sequelize);
Friend.initiate(sequelize);
Like.initiate(sequelize);
Notification.initiate(sequelize);
Admin.initiate(sequelize);
Point.initiate(sequelize);
PointCriteria.initiate(sequelize);
Profile.initiate(sequelize);
QnA.initiate(sequelize);
Answer.initiate(sequelize);
Tier.initiate(sequelize);
Condition.initiate(sequelize);
TierLog.initiate(sequelize);
UserCondition.initiate(sequelize);
Report.initiate(sequelize);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

User.associate(db);
Diary.associate(db);
Board.associate(db);
Comment.associate(db);
Friend.associate(db);
Like.associate(db);
Notification.associate(db);
TodayAnswer.associate(db)
TodayQuestion.associate(db)
Routine.associate(db)
Todo.associate(db)
Point.associate(db)
Profile.associate(db)
QnA.associate(db)
Answer.associate(db)
Tier.associate(db);
Condition.associate(db);
TierLog.associate(db);
UserCondition.associate(db);
Report.associate(db)

Report.initiate(sequelize);
Report.associate(db);



module.exports = db;
