const { Sequelize } = require('sequelize');
const Routine = require('../models/routine');
const Todo  = require('../models/todos'); 
const TodayQuestion = require('../models/today_questions'); 
const TodayAnswer = require('../models/today_answers'); 
const TodayPlace = require('../models/today_places'); 
const { gainPoints } = require('../controllers/point'); 
const { Op } = require("sequelize");
const dayjs = require('dayjs');
const { uploadSingle } = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');

// Todo 
const MAX_TODOS_PER_DIARY = 5
exports.createTodo = async (req, res) => {
    const { diary_id, description, is_completed } = req.body;
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const today = dayjs().startOf('day').toDate(); // 오늘 날짜 기준

    try {
        // 오늘 이미 Todo나 Routine을 생성했는지 확인
        const hasActivityToday = await checkDailyActivity(signId);

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
            sign_id: signId // 사용자 sign_id 추가
        });

        // 포인트 획득: 오늘 처음 생성한 경우에만 포인트 추가
        if (!hasActivityToday) {
            await gainPoints(req, res, '콘텐츠 사용', 1);
        }

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
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const todo = await Todo.findOne({
            where: {
                todo_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });

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
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    
    try {
        const todo = await Todo.findOne({
            where: {
                todo_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });
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
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const todo = await Todo.findOne({
            where: {
                todo_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });

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
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const today = dayjs().startOf('day').toDate(); // 오늘 날짜 기준

    try {
        // 오늘 이미 Todo나 Routine을 생성했는지 확인
        const hasActivityToday = await checkDailyActivity(signId);

        const routineCount = await Routine.count({
            where: { sign_id: signId }
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
            sign_id: signId,
        });

        // 포인트 획득: 오늘 처음 생성한 경우에만 포인트 추가
        if (!hasActivityToday) {
            await gainPoints(req, res, '콘텐츠 사용', 1);
        }
                
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
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const routine = await Routine.findOne({
            where: {
                routine_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });
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
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const { description, is_completed } = req.body;

    try {
        const routine = await Routine.findOne({
            where: {
                routine_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });
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
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const routine = await Routine.findOne({
            where: {
                routine_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });

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

// TodayQuestion 생성
exports.createQuestion = async (req, res) => {
    try { 
        const { question_text } = req.body;
        const signId = res.locals.decoded.sign_id; // JWT에서 가져온 sign_id

        const newQuestion = await TodayQuestion.create({
            question_text,
            sign_id: signId // 질문 생성 시 사용자 sign_id를 저장
        });
            
        res.status(201).json({
            message: '질문이 생성되었습니다.',
            data: newQuestion
        });
    } catch (error) {
        console.error('질문 생성 중 오류 발생:', error);
        res.status(500).json({ message: 'Failed to create question' });
    }
};

// 랜덤 질문 조회
exports.getRandomQuestion = async (req, res) => {
    try {
        const randomQuestion = await TodayQuestion.findOne({
            order: Sequelize.literal('RAND()')
        });

        if (!randomQuestion) {
            return res.status(404).json({
                message: '질문이 존재하지 않습니다.'
            });
        }

        return res.status(200).json({
            message: '랜덤 질문 조회 성공',
            data: randomQuestion
        });
    } catch (error) {
        console.error('랜덤 질문 조회 중 오류 발생:', error);
        return res.status(500).json({
            message: '랜덤 질문 조회에 실패했습니다.'
        });
    }
};

// TodayAnswer 등록
exports.createAnswer = [uploadSingle, async (req, res) => {
    try {
        const { question_id } = req.params;
        const { answer_text, diary_id } = req.body;
        const signId = res.locals.decoded.sign_id;

        const question = await TodayQuestion.findByPk(question_id);
        if (!question) {
            return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
        }
        // 사진 파일이 있으면 경로 저장
        const answerPhotoPath = req.file ? req.file.path : null;

        const newAnswer = await TodayAnswer.create({
            question_id,
            answer_text,
            diary_id,
            sign_id: signId,
            answer_photo: answerPhotoPath // 사진 경로 저장
        });
        
        // 포인트 획득
        await gainPoints(req, res, '콘텐츠 사용', 1);

        res.status(201).json({
            message: '답변이 등록되었습니다.',
            data: newAnswer
        });

    } catch (error) {
        console.error('답변 등록 중 오류 발생:', error);
        res.status(500).json({ message: 'Failed to create answer' });
    }
}];
// TodayAnswer 조회
exports.getAnswer = async (req, res) => {
    try {
        const { question_id, answer_id } = req.params;
        const signId = res.locals.decoded.sign_id;

        // 답변 조회
        const answer = await TodayAnswer.findOne({
            where: {
                answer_id,
                question_id,
                sign_id: signId
            },
            include: [
                {
                    model: TodayQuestion,
                    attributes: ['question_text']
                },
                {
                    model: User,
                    attributes: ['user_nick']
                }
            ]
        });

        if (!answer) {
            return res.status(404).json({ message: '답변을 찾을 수 없습니다.' });
        }

        res.status(200).json({
            message: '답변 조회 성공',
            data: {
                answer_text: answer.answer_text,
                answer_photo: answer.answer_photo, // 사진 경로 포함
                question: answer.TodayQuestion.question_text,
                user_nick: answer.User.user_nick
            }
        });
    } catch (error) {
        console.error('답변 조회 중 오류 발생:', error);
        res.status(500).json({ message: '답변 조회 중 오류가 발생했습니다.' });
    }
};

// TodayAnswer 수정
exports.updateAnswer = [uploadSingle, async (req, res) => {
    try {
        const { answer_id } = req.params;
        const { answer_text } = req.body;
        const signId = res.locals.decoded.sign_id; 

        const answer = await TodayAnswer.findOne({
            where: {
                answer_id,
                sign_id: signId 
            },
        });
    
        if (!answer) {
            return res.status(404).json({ message: '답변을 찾을 수 없습니다.' });
        }

        if (answer.sign_id !== signId) {
            return res.status(403).json({ message: '이 답변을 수정할 권한이 없습니다.' });
        }

        // 사진 파일이 있으면 새로운 경로 저장
        if (req.file) {
            answer.answer_photo = req.file.path;
        }

        answer.answer_text = answer_text;
        await answer.save();
    
        res.status(200).json({
            message: '답변이 수정되었습니다.',
            data: answer
        });

    } catch (error) {
        console.error('답변 수정 중 오류 발생:', error);   
        res.status(500).json({ message: 'Failed to update answer' });
    }
}];

// TodayAnswer 삭제
exports.deleteAnswer = async (req, res) => {
    try {
        const { question_id, answer_id } = req.params;
        const signId = res.locals.decoded.sign_id;

        const answer = await TodayAnswer.findOne({
            where: {
                answer_id,
                question_id,
                sign_id: signId
            },
        });

        if (!answer) {
            return res.status(404).json({ message: '답변을 찾을 수 없습니다.' });
        }

        if (answer.sign_id !== signId) {
            return res.status(403).json({ message: '이 답변을 삭제할 권한이 없습니다.' });
        }
        // 파일 삭제: answer_photo가 존재하면 파일 삭제
        if (answer.answer_photo) {
            const filePath = path.join(__dirname, '../', answer.answer_photo); // 파일 경로 설정
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('파일 삭제 중 오류 발생:', err);
                } else {
                    console.log('사진 파일이 성공적으로 삭제되었습니다.');
                }
            });
        }

        await answer.destroy();

        res.status(200).json({
            message: '답변이 삭제되었습니다.'
        });

    } catch (error) {
        console.error('답변 삭제 중 오류 발생:', error);
        res.status(500).json({ message: '답변 삭제에 실패했습니다.' });
    }
};

//TodayPlace 등록
exports.createPlace = async (req, res) => {
    const { diary_id, cate_num, today_mood, place_memo } = req.body;
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const newPlace = await TodayPlace.create({
            cate_num,
            today_mood,
            place_memo,
            diary_id,
            sign_id: signId // 사용자의 sign_id 추가
        });

        // 포인트 획득
        await gainPoints(req, res, '콘텐츠 사용', 1);

        res.status(201).json({
            message: '오늘의 장소가 성공적으로 생성되었습니다.',
            data: newPlace
        });
    } catch (error) {
        console.error('장소 생성 중 오류 발생:', error);
        res.status(500).json({ error: '장소 생성 중 오류가 발생했습니다.' });
    }
};

// TodayPlace 조회
exports.getPlace = async (req, res) => {
    const { place_id } = req.params;
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const place = await TodayPlace.findOne({
            where: {
                place_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });

        if (!place) {
            return res.status(404).json({ message: '장소를 찾을 수 없습니다.' });
        }

        res.status(200).json({
            message: '장소 조회에 성공했습니다.',
            data: place
        });
    } catch (error) {
        console.error('장소 조회 중 오류 발생:', error);
        res.status(500).json({ error: '장소 조회 중 오류가 발생했습니다.' });
    }
};

// TodayPlace 수정
exports.updatePlace = async (req, res) => {
    const { place_id } = req.params;
    const { cate_num, today_mood, place_memo } = req.body;
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const place = await TodayPlace.findOne({
            where: {
                place_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });

        if (!place) {
            return res.status(404).json({ message: '장소를 찾을 수 없습니다.' });
        }

        // 필드 업데이트
        place.today_mood = today_mood !== undefined ? today_mood : place.today_mood;
        place.place_memo = place_memo !== undefined ? place_memo : place.place_memo;
        place.cate_num = cate_num !== undefined ? cate_num : place.cate_num;

        await place.save();

        res.status(200).json({
            message: '장소가 성공적으로 수정되었습니다.',
            data: place
        });
    } catch (error) {
        console.error('장소 수정 중 오류 발생:', error);
        res.status(500).json({ error: '장소 수정 중 오류가 발생했습니다.' });
    }
};

// TodayPlace 삭제
exports.deletePlace = async (req, res) => {
    const { place_id } = req.params;
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const place = await TodayPlace.findOne({
            where: {
                place_id,
                sign_id: signId// 사용자 sign_id로 필터링
            }
        });

        if (!place) {
            return res.status(404).json({ message: '장소를 찾을 수 없습니다.' });
        }

        await place.destroy();

        res.status(200).json({
            message: '장소가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('장소 삭제 중 오류 발생:', error);
        res.status(500).json({ error: '장소 삭제 중 오류가 발생했습니다.' });
    }
};
