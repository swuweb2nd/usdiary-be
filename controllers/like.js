const { Op } = require('sequelize');
const dayjs = require('dayjs');
const Like = require('../models/like');
const gainPoints = require('../controllers/point').gainPoints; // 포인트 획득 함수 가져오기

// 좋아요 누르기
exports.likeDiary = async (req, res) => {
    try {
        const signId = req.locals.decoded.sign_id; // 유저 아이디 가져오기

        const createLike = await Like.create({
            user_id: signId,
            diary_id: req.body.diary_id
        });

        const startOfWeek = dayjs().startOf('week').add(1, 'day').toDate();
        const endOfWeek = dayjs().endOf('week').add(1, 'day').toDate();

        // 이번 주에 사용자가 누른 좋아요 수 계산
        const likesThisWeek = await Like.count({
            where: {
                user_id: signId,
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
        
    req.status(201).json({
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

        // 좋아요가 존재하는지 확인
        const like = await Like.findOne({
            where: {
                like_id: likeId,
                user_id: signId 
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