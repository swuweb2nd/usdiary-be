/*
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const Like = require('../models/like');
const User = require('../models/user');
const Diary = require('../models/diary');
const gainPoints = require('../controllers/point').gainPoints; // 포인트 획득 함수 가져오기

// 좋아요 누르기
exports.likeDiary = async (req, res) => {
    try {
        const diaryId = req.params.diary_id;
        const signId = req.locals.decoded.sign_id; // 유저 아이디 가져오기
        const user = await User.findOne({ where: { sign_id: signId } });
        const diary = await Diary.findOne({
            where: {
                diary_id: diaryId
            }
        });

        console.log('다이어리 ID',diaryId)

        // 좋아요 생성
        const createLike = await Like.create({
            user_id: user.user_id,
            diary_id: diaryId,
            diary_user: diary.user_id
        });

        // 해당 일기의 like_count 증가
        await Diary.increment('like_count', {
            by: 1, // like_count 값을 1 증가
            where: {
                diary_id: diaryId
            }
        });

        const startOfWeek = dayjs().startOf('week').add(1, 'day').toDate();
        const endOfWeek = dayjs().endOf('week').add(1, 'day').toDate();

        // 이번 주에 사용자가 누른 좋아요 수 계산
        const likesThisWeek = await Like.count({
            where: {
                user_id: user.user_id,
                createdAt: {
                    [Op.between]: [startOfWeek, endOfWeek],
                },
            },
        });

        // 5개의 좋아요마다 1포인트 추가, 최대 5포인트 제한
        const earnedPoints = Math.floor(likesThisWeek / 5);
        const maxWeeklyPoints = 5;

        if (earnedPoints > 0) {
            const currentWeekPoints = await getWeeklyPoints(signId); 
            const pointsToAdd = Math.min(earnedPoints, maxWeeklyPoints - currentWeekPoints);

            if (pointsToAdd > 0) {
                await gainPoints(req, res, '일기에 좋아요', pointsToAdd);
            }
        }

        res.status(201).json({
            message: 'Like created successfully',
            data: createLike
        });
    } catch (error) {
        console.error('Error creating like:', error);
        res.status(500).json({ error: 'An error occurred while creating the like' });
    }
};

// 좋아요 삭제
exports.deleteLike = async (req, res) => {
    try {
        const likeId = req.params.like_id;
        const signId = req.locals.decoded.sign_id;
        const user = await User.findOne({ where: { sign_id: signId } });
  
        // 좋아요가 존재하는지 확인
        const like = await Like.findOne({
            where: {
                like_id: likeId,
                user_id: user.user_id 
            }
        });
        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        // 좋아요 삭제
        await like.destroy();
        return res.status(200).json({ message: 'Like deleted successfully' });
    } catch (error) {
        console.error('Error deleting like:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
*/
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const Like = require('../models/like');
const User = require('../models/user');
const Diary = require('../models/diary');
const gainPoints = require('../controllers/point').gainPoints; 

exports.likeDiary = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const diaryId = req.params.diary_id;
        const signId = req.locals.decoded.sign_id;

        // 유저와 일기 정보 병렬 조회
        const [user, diary] = await Promise.all([
            User.findOne({ where: { sign_id: signId } }),
            Diary.findOne({ where: { diary_id: diaryId } })
        ]);

        if (!user || !diary) {
            await t.rollback();
            return res.status(404).json({ message: 'User or diary not found' });
        }

        // 좋아요 생성
        const createLike = await Like.create({
            user_id: user.user_id,
            diary_id: diaryId,
            diary_user: diary.user_id
        }, { transaction: t });

        // like_count 증가
        await Diary.increment('like_count', {
            by: 1,
            where: { diary_id: diaryId },
            transaction: t
        });

        const startOfWeek = dayjs().startOf('week').add(1, 'day').toDate();
        const endOfWeek = dayjs().endOf('week').add(1, 'day').toDate();

        // 이번 주 좋아요 수 및 현재 포인트 병렬 계산
        const [likesThisWeek, currentWeekPoints] = await Promise.all([
            Like.count({
                where: {
                    user_id: user.user_id,
                    createdAt: { [Op.between]: [startOfWeek, endOfWeek] },
                },
                transaction: t
            }),
            getWeeklyPoints(signId) // 포인트 함수도 비동기라면 await 필요
        ]);

        // 포인트 계산
        const earnedPoints = Math.floor(likesThisWeek / 5);
        const maxWeeklyPoints = 5;
        const pointsToAdd = Math.min(earnedPoints, maxWeeklyPoints - currentWeekPoints);

        if (pointsToAdd > 0) {
            await gainPoints(req, res, '일기에 좋아요', pointsToAdd, t);
        }

        await t.commit();
        res.status(201).json({ message: 'Like created successfully', data: createLike });

    } catch (error) {
        await t.rollback();
        console.error('Error creating like:', error);
        res.status(500).json({ error: 'An error occurred while creating the like' });
    }
};

// 좋아요 삭제
exports.deleteLike = async (req, res) => {
    try {
        const likeId = req.params.like_id;
        const signId = req.locals.decoded.sign_id;
        const user = await User.findOne({ where: { sign_id: signId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 좋아요 확인
        const like = await Like.findOne({
            where: { like_id: likeId, user_id: user.user_id }
        });

        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        // 좋아요 삭제
        await like.destroy();
        return res.status(200).json({ message: 'Like deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting like:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
