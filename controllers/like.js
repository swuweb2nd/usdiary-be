const Diary = require('../models/diary');
const User = require('../models/user');
const { use } = require('../routes/diary');

// 좋아요 누르기
exports.likeDiary = async (req, res) => {
    const signId = req.locals.decoded.sign_id; // 유저 아이디 가져오기

    try {
        const createLike = await Like.create({
            user_id: signId,
            diary_id: req.body.diary_id
        });

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
    const likeId = req.params.like_id;
    const signId = req.locals.decoded.sign_id;

    try {
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