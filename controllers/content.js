const { Sequelize } = require('sequelize');
const Routine = require('../models/routine');
const Todo  = require('../models/todos'); 
const TodayQuestion = require('../models/today_questions'); 
const TodayAnswer = require('../models/today_answers'); 
const TodayPlace = require('../models/today_places'); 
const { gainPoints } = require('../controllers/point'); 
const { uploadSingle } = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');

const MAX_TODOS_PER_DIARY = 5 //투두 개수 제한
const MAX_ROUTINES_PER_USER = 3; //루틴 개수 제한

// 사용자가 오늘 이미 투두나 루틴을 생성했는지 확인
const checkDailyActivity = async (signId, date) => {
    const today = new Date(); // 오늘 날짜
    
    // 오늘 날짜 기준 투두 또는 루틴이 있는지 확인
    const activity = await Todo.findOne({
    where: {
            sign_id: signId,
            date
        }
    }) || await Routine.findOne({
    where: {
            sign_id: signId,
            date
        }
    });
    
    return !!activity; // 오늘 활동이 있으면 true 반환
};

// Todo 생성
exports.createTodo = async (req, res) => {
    const { description, is_completed } = req.body;
    const signId = res.locals.decoded.sign_id;
    const date = req.body.date || new Date().toISOString().split('T')[0]; // date가 없으면 오늘 날짜로 설정

    try {
        const hasActivityOnDate = await checkDailyActivity(signId, date);

        const todoCount = await Todo.count({
            where: {
                sign_id: signId,
                date
            }
        });

        if (todoCount >= MAX_TODOS_PER_DIARY) {
            return res.status(400).json({
                message: `최대 ${MAX_TODOS_PER_DIARY}개의 Todo만 생성할 수 있습니다.`
            });
        }

        const newTodo = await Todo.create({
            description,
            is_completed,
            sign_id: signId,
            date
        });

        if (!hasActivityOnDate) {
            await gainPoints(req, res, '콘텐츠 사용', 1);
        }

        res.status(201).json({
            message: 'Todo 생성 완료',
            data: newTodo
        });
    } catch (error) {
        console.error('투두 생성 중 오류 발생:', error);
        res.status(500).json({ message: '투두를 생성하는 중 오류가 발생했습니다.' });
    }
};

// Todo 목록 조회
exports.getTodoList = async (req, res) => {
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const date = req.query.date || new Date().toISOString().split('T')[0]; // 쿼리 날짜가 없으면 오늘 날짜로 설정

    try {
        const todo = await Todo.findAll({
            where: {
                sign_id: signId,
                date
            },
            order: [['createdAt', 'ASC']]
        });

        res.status(200).json({
            message: '투두 목록 조회 성공',
            data: todo.length ? todo : []
        });
    } catch (error) {
        console.error('투두 목록 조회 중 오류 발생:', error);
        res.status(500).json({ message: '투두 목록 조회 중 오류가 발생했습니다.' });
    }
};

// Todo 수정
exports.updateTodo = async (req, res) => {
    const { todo_id } = req.params;
    const signId = res.locals.decoded.sign_id;
    const { description, is_completed } = req.body;

    try {
        const todo = await Todo.findOne({
            where: {
                todo_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
        }

        // description과 is_completed 필드 업데이트
        todo.description = description !== undefined ? description : todo.description;
        todo.is_completed = is_completed !== undefined ? is_completed : todo.is_completed;

        await todo.save();

        res.status(200).json({
            message: 'Todo가 성공적으로 수정되었습니다.',
            data: todo
        });
    } catch (error) {
        console.error('Todo 수정 중 오류 발생:', error);
        res.status(500).json({ message: 'Todo를 수정하는 중 오류가 발생했습니다.' });
    }
};

// Todo 삭제
exports.deleteTodo = async (req, res) => {
    const { todo_id } = req.params;
    const signId = res.locals.decoded.sign_id;

    try {
        const todo = await Todo.findOne({
            where: {
                todo_id,
                sign_id: signId // 사용자 sign_id로 필터링
            }
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
        }

        await todo.destroy();

        res.status(200).json({
            message: 'Todo가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('Todo 삭제 중 오류 발생:', error);
        res.status(500).json({ message: 'Todo를 삭제하는 중 오류가 발생했습니다.' });
    }
};

// routine 생성
exports.createRoutine = async (req, res) => {
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const { description, is_completed } = req.body;
    const date = req.body.date || new Date().toISOString().split('T')[0]; // date가 없으면 오늘 날짜로 설정

    try {
        // 선택한 날짜에 이미 Todo나 Routine을 생성했는지 확인
        const hasActivityToday = await checkDailyActivity(signId, date);

        const routineCount = await Routine.count({
            where: {  
                sign_id: signId,
                date
            }
        });

        if (routineCount >= MAX_ROUTINES_PER_USER) {
            return res.status(400).json({
                message: `최대 ${MAX_ROUTINES_PER_USER}개의 루틴만 생성할 수 있습니다.`
            });
        }

        // 루틴 생성
        const newRoutine = await Routine.create({
            description,
            is_completed,
            sign_id: signId,
            date
        });

        // 포인트 획득: 선택한 날짜에 처음 생성한 경우에만 포인트 추가
        if (!hasActivityToday) {
            await gainPoints(req, res, '콘텐츠 사용', 1);
        }
                
        res.status(201).json({
            message: '루틴 생성 완료',
            data: newRoutine
        });
    } catch (error) {
        console.error('루틴 생성 중 오류 발생:', error);
        res.status(500).json({ message: '루틴을 생성하는 중 오류가 발생했습니다.' });
    }
};

// routine 목록 조회
exports.getRoutineList = async (req, res) => {
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const date = req.query.date || new Date().toISOString().split('T')[0]; // 쿼리 날짜가 없으면 오늘 날짜로 설정

    try {
        const routine = await Routine.findAll({
            where: {
                sign_id: signId, // 사용자 sign_id로 필터링
                date // 선택한 날짜로 필터링
            },
            order: [['createdAt', 'ASC']] 
        });
        
        res.status(200).json({
            message: '루틴 목록 조회 성공',
            data: routine.length ? routine : []
        });
    } catch (error) {
        console.error('루틴 목록 조회 중 오류 발생:', error);
        res.status(500).json({ message: '루틴 목록 조회 중 오류가 발생했습니다.' });
    }
};

// routine 수정
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
            return res.status(404).json({ message: '루틴을 찾을 수 없습니다.' });
        }

        // description과 is_completed 필드 업데이트
        routine.description = description !== undefined ? description : routine.description;
        routine.is_completed = is_completed !== undefined ? is_completed : routine.is_completed;

        await routine.save();

        res.status(200).json({
            message: '루틴이 성공적으로 수정되었습니다.',
            data: routine
        });
    } catch (error) {
        console.error('루틴 수정 중 오류 발생:', error);
        res.status(500).json({ message: '루틴을 수정하는 중 오류가 발생했습니다.' });
    }
};

// routine 삭제
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
            return res.status(404).json({ message: '루틴을 찾을 수 없습니다.' });
        }

        await routine.destroy();

        res.status(200).json({
            message: '루틴이 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('루틴 삭제 중 오류 발생:', error);
        res.status(500).json({ message: '루틴을 삭제하는 중 오류가 발생했습니다.' });
    }
};

// 오늘의 질문 설정하는 함수
async function setDailyQuestion(date) {
    await TodayQuestion.update({ today_date: null }, { where: { today_date: date } }); // 기존 해당 날짜의 질문 초기화

    const newQuestion = await TodayQuestion.findOne({
        order: Sequelize.literal('RAND()') // 무작위로 질문 선택
    });

    if (newQuestion) {
        await newQuestion.update({ today_date: date }); // 해당 날짜로 업데이트하여 설정
    }
}

// TodayQuestion 조회
exports.getTodayQuestion = async (req, res) => {
    try {
        // 쿼리 파라미터가 없을 경우 오늘 날짜 사용
        const dateParam = req.query.date || new Date(); 
        const date = new Date(dateParam);

        // 요청된 날짜의 질문을 찾음
        let todayQuestion = await TodayQuestion.findOne({
            where: { today_date: date }
        });

        // 해당 날짜의 질문이 설정되지 않은 경우, 새 질문 설정
        if (!todayQuestion) {
            await setDailyQuestion(date); // 요청된 날짜에 대한 질문 설정

            // 다시 요청된 날짜의 질문을 찾음
            todayQuestion = await TodayQuestion.findOne({
                where: { today_date: date }
            });
        }

        if (!todayQuestion) {
            return res.status(404).json({
                message: '질문을 생성할 수 없습니다.'
            });
        }

        // 질문이 있을 경우 데이터 반환
        res.status(200).json({
            message: '질문 조회 성공',
            data: todayQuestion
        });
    } catch (error) {
        console.error('질문 조회 중 오류 발생:', error);
        res.status(500).json({ message: '질문 조회에 실패했습니다.' });
    }
};

// 이미지 압축 함수
async function compressImage(imagePath) {
    const outputPath = imagePath.replace(/(\.[\w\d]+)$/, '-compressed$1'); // 압축된 파일 경로 설정

    try {
        await sharp(imagePath)
            .resize(800) // 필요한 경우 크기 조정
            .toFile(outputPath); // 압축된 이미지 저장
        await fs.promises.unlink(imagePath); // 원본 이미지 삭제 (비동기)
        return outputPath; // 압축된 경로 반환
    } catch (error) {
        console.error('Error compressing image:', error);
        return imagePath; // 오류 발생 시 원본 경로 반환
    }
}

// TodayAnswer 등록
exports.createAnswer = [uploadSingle, async (req, res) => {
    try {
        const { answer_text } = req.body;
        const signId = res.locals.decoded.sign_id;
        const date = req.query.date || new Date().toISOString().split('T')[0]; // 쿼리 날짜가 없으면 오늘 날짜로 설정

        // 해당 날짜의 question_id가 유효한지 확인
        const question = await TodayQuestion.findOne({
            where: { today_date: date },
            attributes: ['question_id']
        });

        if (!question) {
            return res.status(404).json({ message: '해당 날짜의 질문을 찾을 수 없습니다.' });
        }

        // 중복 답변 방지: 이미 답변을 작성했는지 확인
        const existingAnswer = await TodayAnswer.findOne({
            where: {
                question_id: question.question_id,
                sign_id: signId,
                date: date
            }
        });

        if (existingAnswer) {
            return res.status(400).json({ message: '이미 해당 날짜의 질문에 답변하셨습니다.' });
        }

        // 사진 파일이 있으면 경로 저장 후 압축 처리
        let answerPhotoPath = req.file ? req.file.path : null;
        if (answerPhotoPath) {
            answerPhotoPath = await compressImage(answerPhotoPath); // 압축 후 경로 업데이트
        }

        // 새 답변 생성
        const newAnswer = await TodayAnswer.create({
            question_id: question.question_id,
            answer_text,
            sign_id: signId,
            date: date,
            answer_photo: answerPhotoPath // 압축된 사진 경로 저장
        });

        // 포인트 획득
        await gainPoints(req, res, '콘텐츠 사용', 1);

        res.status(201).json({
            message: '답변이 등록되었습니다.',
            data: {
                question_id: newAnswer.question_id,
                answer_text: newAnswer.answer_text,
                sign_id: newAnswer.sign_id,
                date: newAnswer.date,
                photo: newAnswer.answer_photo,
            }
        });

    } catch (error) {
        console.error('답변 등록 중 오류 발생:', error);
        res.status(500).json({ message: '답변 등록에 실패했습니다.' });
    }
}];

// TodayAnswer 조회
exports.getAnswer = async (req, res) => {
    try {
        const signId = res.locals.decoded.sign_id;
        const date = req.query.date || new Date().toISOString().split('T')[0]; // 쿼리 날짜가 없으면 오늘 날짜로 설정

        // 해당 날짜와 사용자 ID에 맞는 답변 조회
        const answer = await TodayAnswer.findOne({
            where: {
                sign_id: signId,
                date: date // 문자열 형식의 날짜로 조회
            },
            attributes: ['answer_text', 'answer_photo'] // 필요한 필드만 가져옴
        });

        // 일치하는 답변이 없을 때 빈 객체 반환
        if (!answer) {
            return res.status(200).json({
                message: '해당 날짜에 대한 답변이 없습니다.',
                data: {}
            });
        }

        // 일치하는 답변이 있을 때 객체 형태로 반환
        res.status(200).json({
            message: '답변 조회 성공',
            data: {
                answer_text: answer.answer_text,
                answer_photo: answer.answer_photo // 사진 경로 포함
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

        // 기존 답변 조회
        const answer = await TodayAnswer.findOne({
            where: { answer_id, sign_id: signId },
        });

        if (!answer) {
            return res.status(404).json({ message: '답변을 찾을 수 없습니다.' });
        }

        // 사진 파일이 있으면 새로운 경로 저장 및 압축 처리
        if (req.file) {
            // 기존 파일 삭제
            if (answer.answer_photo) {
                await fs.promises.unlink(answer.answer_photo); // 비동기 파일 삭제
            }
            // 새 파일 압축 및 경로 업데이트
            answer.answer_photo = await compressImage(req.file.path); // 새 사진 압축 및 경로 저장
        }

        // 답변 텍스트 업데이트
        answer.answer_text = answer_text;
        await answer.save();

        res.status(200).json({
            message: '답변이 수정되었습니다.',
            data: {
                answer_text: answer.answer_text,
                answer_photo: answer.answer_photo
            }
        });

    } catch (error) {
        console.error('답변 수정 중 오류 발생:', error);   
        res.status(500).json({ message: '답변 수정에 실패했습니다.' });
    }
}];

// TodayAnswer 삭제
exports.deleteAnswer = async (req, res) => {
    try {
        const { answer_id } = req.params;
        const signId = res.locals.decoded.sign_id;

        // 답변 조회
        const answer = await TodayAnswer.findOne({
            where: { answer_id, sign_id: signId },
        });

        if (!answer) {
            return res.status(404).json({ message: '답변을 찾을 수 없습니다.' });
        }

        // 파일 삭제: answer_photo가 존재하면 파일 삭제
        if (answer.answer_photo) {
            const filePath = path.resolve(__dirname, '../', answer.answer_photo); // 보안성을 위해 resolve 사용
            try {
                await fs.promises.unlink(filePath); // 비동기로 파일 삭제
                console.log('사진 파일이 성공적으로 삭제되었습니다.');
            } catch (err) {
                console.error('파일 삭제 중 오류 발생:', err);
            }
        }

        // 답변 삭제
        await answer.destroy();

        res.status(200).json({
            message: '답변이 삭제되었습니다.'
        });

    } catch (error) {
        console.error('답변 삭제 중 오류 발생:', error);
        res.status(500).json({ message: '답변 삭제에 실패했습니다.' });
    }
};

// TodayPlace 등록
exports.createPlace = async (req, res) => {
    const { cate_num, today_mood, place_memo } = req.body;
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const date = req.body.date || new Date().toISOString().split('T')[0]; // date가 없으면 오늘 날짜로 설정

    try {
        const newPlace = await TodayPlace.create({
            cate_num,
            today_mood,
            place_memo,
            sign_id: signId,
            date
        });

        // 포인트 획득
        await gainPoints(req, res, '콘텐츠 사용', 1);

        res.status(201).json({
            message: '오늘의 장소가 성공적으로 생성되었습니다.',
            data: newPlace
        });
    } catch (error) {
        console.error('장소 생성 중 오류 발생:', error);
        res.status(500).json({ message: '장소 생성 중 오류가 발생했습니다.' });
    }
};

// TodayPlace 목록 조회
exports.getPlaceList = async (req, res) => {
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
    const date = req.query.date || new Date().toISOString().split('T')[0]; // 쿼리 날짜가 없으면 오늘 날짜로 설정

    try {
        // 특정 날짜와 사용자에 해당하는 장소 목록 조회
        const places = await TodayPlace.findAll({
            where: {
                sign_id: signId,
                date // 요청된 날짜 또는 오늘 날짜 기준으로 필터링
            },
            order: [['createdAt', 'ASC']] // 생성 날짜 순으로 정렬
        });

        res.status(200).json({
            message: '장소 목록 조회 성공',
            data: places.length ? places : []
        });
    } catch (error) {
        console.error('장소 목록 조회 중 오류 발생:', error);
        res.status(500).json({ message: '장소 목록 조회 중 오류가 발생했습니다.', data: [] });
    }
};

// TodayPlace 수정
exports.updatePlace = async (req, res) => {
    const { place_id } = req.params;
    const { today_mood, place_memo } = req.body;
    const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기

    try {
        const place = await TodayPlace.findOne({
            where: {
                place_id,
                sign_id: signId,
            }
        });

        if (!place) {
            return res.status(404).json({ message: '장소를 찾을 수 없습니다.' });
        }

        // 필드 업데이트
        place.today_mood = today_mood !== undefined ? today_mood : place.today_mood;
        place.place_memo = place_memo !== undefined ? place_memo : place.place_memo;


        await place.save();

        res.status(200).json({
            message: '장소가 성공적으로 수정되었습니다.',
            data: place
        });
    } catch (error) {
        console.error('장소 수정 중 오류 발생:', error);
        res.status(500).json({ message: '장소 수정 중 오류가 발생했습니다.' });
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
                sign_id: signId,
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
        res.status(500).json({ message: '장소 삭제 중 오류가 발생했습니다.' });
    }
};