const express = require('express');
const router = express.Router();
const {createTodo,getTodo,updateTodo,deleteTodo,createRoutine,getRoutine,updateRoutine,deleteRoutine}= require('../controllers/checklist');


// Todo 
router.post('/todos', createTodo);
router.get('/todos/:todo_id', getTodo);
router.patch('/todos/:todo_id', updateTodo);
router.delete('/todos/:todo_id', deleteTodo);
// Routine 
router.post('/routines', createRoutine);
router.get('/routines/:routine_id', getRoutine);
router.patch('/routines/:routine_id', updateRoutine);
router.delete('/routines/:routine_id', deleteRoutine);

module.exports = router;
