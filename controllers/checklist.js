const Diary = require('../models/diary');
const User = require('../models/user');
const Routine = require('../models/routine');

const  Todo  = require('../models/todos'); // Sequelize 모델 가져오기

// Todo 
const MAX_TODOS_PER_DIARY = 5
exports.createTodo = async (req, res) => {
    const { diary_id, description, is_completed } = req.body;

    try {
       
        const todoCount = await Todo.count({
            where: { diary_id: diary_id }
        });

        // 투두가 해당 일기에서 최대 개수를 넘었는지 확인
        if (todoCount > MAX_TODOS_PER_DIARY-1) {
            return res.status(400).json({
                message: `You can only create up to ${MAX_TODOS_PER_DIARY} todos for this diary.`
            });
        }

        // 투두 생성
        const newTodo = await Todo.create({
            description,
            is_completed,
            diary_id,
        });

        res.status(201).json({
            message: 'Todo created successfully',
            data: newTodo
        });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'An error occurred while creating the todo' });
    }
};

exports.getTodo = async (req, res) => {
    const { todo_id } = req.params;
    try {
        const todo = await Todo.findByPk(todo_id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({
            message: 'Todo retrieved successfully',
            data: todo
        });
    } catch (error) {
        console.error('Error retrieving todo:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the todo' });
    }
};


exports.updateTodo = async (req, res) => {
    const { todo_id } = req.params;
    try {
        const todo = await Todo.findByPk(todo_id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.description = req.body.description !== undefined ? req.body.description : todo.description;
        todo.is_completed = req.body.is_completed !== undefined ? req.body.is_completed : todo.is_completed;

        await todo.save();

        res.status(200).json({
            message: 'Todo updated successfully',
            data: todo
        });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'An error occurred while updating the todo' });
    }
};


exports.deleteTodo = async (req, res) => {
    const { todo_id } = req.params;
    try {
        const todo = await Todo.findByPk(todo_id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await todo.destroy();

        res.status(200).json({
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'An error occurred while deleting the todo' });
    }
};
// routine
const MAX_ROUTINES_PER_USER = 3; //루틴 개수 제한

exports.createRoutine = async (req, res) => {
    const userId = req.body.user_id;

    try {
        
        const routineCount = await Routine.count({
            where: { user_id: userId }
        });

       
        if (routineCount > MAX_ROUTINES_PER_USER-1) {
            return res.status(400).json({
                message: `You can only create up to ${MAX_ROUTINES_PER_USER} routines.`
            });
        }

        // 루틴 생성
        const newRoutine = await Routine.create({
            description: req.body.description,
            is_completed: req.body.is_completed || false,
            diary_id: req.body.diary_id,
            user_id: userId,
        });

        res.status(201).json({
            message: 'Routine created successfully',
            data: newRoutine
        });
    } catch (error) {
        console.error('Error creating routine:', error);
        res.status(500).json({ error: 'An error occurred while creating the routine' });
    }
};
exports.getRoutine = async (req, res) => {
    const { routine_id } = req.params;
    try {
        const routine = await Routine.findByPk(routine_id);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        res.status(200).json({
            message: 'Routine retrieved successfully',
            data: routine
        });
    } catch (error) {
        console.error('Error retrieving routine:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the routine' });
    }
};
exports.updateRoutine = async (req, res) => {
    const { routine_id } = req.params;
    const { description, is_completed } = req.body;

    try {
        const routine = await Routine.findByPk(routine_id);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        routine.description = description !== undefined ? description : routine.description;
        routine.is_completed = is_completed !== undefined ? is_completed : routine.is_completed;

        await routine.save();

        res.status(200).json({
            message: 'Routine updated successfully',
            data: routine
        });
    } catch (error) {
        console.error('Error updating routine:', error);
        res.status(500).json({ error: 'An error occurred while updating the routine' });
    }
};
exports.deleteRoutine = async (req, res) => {
    const { routine_id } = req.params;

    try {
        const routine = await Routine.findByPk(routine_id);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        await routine.destroy();

        res.status(200).json({
            message: 'Routine deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting routine:', error);
        res.status(500).json({ error: 'An error occurred while deleting the routine' });
    }
};
