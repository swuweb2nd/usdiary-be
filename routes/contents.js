const express = require('express');
const router = express.Router();
const { 
    createTodo, getTodoList, updateTodo, deleteTodo,
    createRoutine, getRoutineList, updateRoutine, deleteRoutine,
    getTodayQuestion,
    createAnswer, getAnswer, updateAnswer, deleteAnswer,
    createPlace, getPlaceList, updatePlace, deletePlace 
} = require('../controllers/content');
const { verifyToken } = require('../middlewares/jwt');
const { uploadSingle } = require('../middlewares/upload');

// Todo
router.post('/todos', verifyToken, createTodo);
router.get('/todos', verifyToken, getTodoList);
router.patch('/todos/:todo_id', verifyToken, updateTodo);
router.delete('/todos/:todo_id', verifyToken, deleteTodo);

// Routine
router.post('/routines', verifyToken, createRoutine);
router.get('/routines', verifyToken, getRoutineList);
router.patch('/routines/:routine_id', verifyToken, updateRoutine);
router.delete('/routines/:routine_id', verifyToken, deleteRoutine);

// 오늘의 질문 조회
router.get('/questions/today', getTodayQuestion);

// TodayAnswer
router.post('/answers', verifyToken, uploadSingle, createAnswer);
router.get('/answers/:answer_id', verifyToken, getAnswer);
router.patch('/answers/:answer_id', verifyToken, uploadSingle, updateAnswer);
router.delete('/answers/:answer_id', verifyToken, deleteAnswer);

// TodayPlace
router.post('/places', verifyToken, createPlace);
router.get('/places', verifyToken, getPlaceList);
router.patch('/places/:place_id', verifyToken, updatePlace);
router.delete('/places/:place_id', verifyToken, deletePlace);

module.exports = router;
