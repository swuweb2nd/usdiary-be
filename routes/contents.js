const express = require('express');
const router = express.Router();
const { createTodo,getTodoList,updateTodo,deleteTodo,
        createRoutine,getRoutineList,updateRoutine,deleteRoutine,
        createAnswer, getAnswer, updateAnswer,deleteAnswer,
        createPlace, getPlaceList, updatePlace, deletePlace
      }= require('../controllers/content');
const { verifyToken } = require('../middlewares/jwt');
const { uploadSingle } = require('../middlewares/upload');

// Todo 
router.post('/:diary_id/todos', verifyToken, createTodo);
router.get('/:diary_id/todos', verifyToken, getTodoList);
router.patch('/:diary_id/:todo_id', verifyToken, updateTodo);
router.delete('/:diary_id/:todo_id', verifyToken, deleteTodo);

// Routine 
router.post('/:diary_id/routines', verifyToken, createRoutine);
router.get('/:diary_id/routines', verifyToken, getRoutineList);
router.patch('/:diary_id/:routine_id', verifyToken, updateRoutine);
router.delete('/:diary_id/:routine_id', verifyToken, deleteRoutine);

// TodayAnswer
router.post('/:diary_id/answers', verifyToken, uploadSingle, createAnswer);
router.get('/:diary_id/answers/:answer_id', verifyToken, getAnswer);
router.patch('/:diary_id/answers/:answer_id', verifyToken, uploadSingle, updateAnswer);
router.delete('/:diary_id/answers/:answer_id', verifyToken, deleteAnswer);

//TodayPlace
router.post('/:diary_id/places', verifyToken, createPlace);
router.get('/:diary_id/places', verifyToken, getPlaceList);
router.patch('/:diary_id/places/:place_id', verifyToken, updatePlace);
router.delete('/:diary_id/places/:place_id', verifyToken, deletePlace);

module.exports = router;
