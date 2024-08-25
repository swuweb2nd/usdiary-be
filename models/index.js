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
const Checklist = require("./checklists");
const Todo = require("./todos");
const Comment = require("./comment");
const Friend = require('./friend');
const Like = require('./like');
const Notification = require("./notification");
const Point = require("./point");
const Profile = require("./profile");
const QnA = require("./qna");
const Answer = require("./anwer");


const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config); 

db.User = User;
db.Admin = Admin;
db.Diary = Diary;
db.Board = Board;
db.TodayAnswer = TodayAnswer;
db.TodayQuestion = TodayQuestion;
db.Checklist = Checklist;
db.Todo = Todo;
db.Comment = Comment;
db.Friend = Friend;
db.Like = Like;
db.Notification = Notification;
db.Point = Point;
db.Profile = Profile;
db.QnA = QnA;
db.Answer = Answer;



User.initiate(sequelize)
Diary.initiate(sequelize)
Board.initiate(sequelize)
TodayAnswer.initiate(sequelize)
TodayQuestion.initiate(sequelize)
Checklist.initiate(sequelize)
Todo.initiate(sequelize)
Comment.initiate(sequelize);
Friend.initiate(sequelize);
Like.initiate(sequelize);
Notification.initiate(sequelize);
Admin.initiate(sequelize);
Point.initiate(sequelize);
Profile.initiate(sequelize);
QnA.initiate(sequelize);
Answer.initiate(sequelize);



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
Checklist.associate(db)
Todo.associate(db)
Point.associate(db)
Profile.associate(db)
QnA.associate(db)
Answer.associate(db)




module.exports = db;
