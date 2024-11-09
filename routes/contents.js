const express = require('express');
const router = express.Router();
const { createTodo,getTodoList,updateTodo,deleteTodo,
        createRoutine,getRoutineList,updateRoutine,deleteRoutine,
        getTodayQuestion,
        createAnswer, getAnswer, updateAnswer,deleteAnswer,
        createPlace, getPlaceList, updatePlace, deletePlace,
        createSea,getAllSeas,updateSea,deleteSea
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

// 오늘의 질문 조회
router.get('/questions/today', getTodayQuestion);

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


// SEA
router.post('/',verifyToken, createSea); 
router.get('/',verifyToken, getAllSeas); 
router.get('/:sea_id',verifyToken, getSeaById); 
router.patch('/:sea_id', verifyToken,updateSea); 
router.delete('/:sea_id',verifyToken, deleteSea); 

module.exports = router;
