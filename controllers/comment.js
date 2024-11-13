const Comment = require('../models/comment');
const Diary = require('../models/diary');
const User = require('../models/user');
const Profile = require('../models/profile');
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const { gainPoints, getWeeklyPoints} = require('./point'); 

// 댓글 작성
exports.createComment = async (req, res) => {
    try {
        const diaryId = req.params.diary_id;
        const sign_id = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기
        const { content } = req.body;

        // content가 문자열인지 확인
        if (typeof content !== 'string') {
            return res.status(400).json({ message: 'content must be a string' });
        }

        // 해당 일기가 존재하는지 확인
        const diary = await Diary.findOne({ where: { diary_id: diaryId } });
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }

        // 새로운 댓글 생성
        const newComment = await Comment.create({
            diary_id: diaryId,
            sign_id: sign_id, // 사용자 sign_id 추가
            comment_text: content
        });

        // 현재 주의 댓글 수를 계산 (월요일 ~ 일요일 기준)
        const startOfWeek = dayjs().startOf('week').add(1, 'day').toDate();
        const endOfWeek = dayjs().endOf('week').add(1, 'day').toDate();

        const commentsThisWeek = await Comment.count({
            where: {
                sign_id: sign_id,
                createdAt: {
                    [Op.between]: [startOfWeek, endOfWeek],
                },
            },
        });

        // 3개 댓글마다 1포인트, 최대 5포인트 제한
        const earnedPoints = Math.floor(commentsThisWeek / 3);
        const maxWeeklyPoints = 5;

        if (earnedPoints > 0) {
            const currentWeekPoints = await getWeeklyPoints(sign_id);
            const pointsToAdd = Math.min(earnedPoints, maxWeeklyPoints - currentWeekPoints);

            if (pointsToAdd > 0) {
                await gainPoints(req, res, '일기에 댓글', pointsToAdd);
            }
        }
        
        // 생성된 댓글 반환
        res.status(201).json({ message: '댓글이 성공적으로 생성되었습니다.', data: { newComment } });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
    try {
        const { diary_id, comment_id } = req.params;
        const { content } = req.body;
        const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기

        const diary = await Diary.findOne({ where: { diary_id: diary_id } });
        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }
      
        // 수정할 댓글이 존재하는지 확인
        const comment = await Comment.findOne({
            where: { comment_id: comment_id, diary_id: diary_id, sign_id: signId }
        });
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to edit this comment' });
        }

        comment.comment_text = content 
       

        // 변경사항 저장
        await comment.save();
     

        res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.', data: { comment } });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// 댓글 조회
exports.renderComments = async (req, res) => {
    try {
        const diaryId = req.params.diary_id;
        const commentId = req.params.comment_id; // 특정 댓글 ID 가져오기
        let comments;

        if (commentId) {
            // 특정 댓글 조회
            comments = await Comment.findOne({
                where: { diary_id: diaryId, comment_id: commentId },
                include: [
                    { 
                        model: User, 
                        attributes: ['sign_id', 'user_nick'],
                        include: [
                            {
                                model: Profile, 
                                attributes: ['profile_img']
                            }
                        ]
                    },
                ],
            });
            
            if (!comments) {
                return res.status(200).json({ data: [] });  
            }
        } else {
            // 해당 일기에 대한 모든 댓글을 조회
            comments = await Comment.findAll({
                where: { diary_id: diaryId },
                include: [
                    { 
                        model: User, 
                        attributes: ['sign_id', 'user_nick'],
                        include: [
                            {
                                model: Profile, 
                                attributes: ['profile_img'] 
                            }
                        ]
                    },
                ],
                order: [['createdAt', 'ASC']]
            });

            if (!comments || comments.length === 0) {
                return res.status(200).json({ data: [] }); 
            }
        }
        
        res.json({ data: comments });

        console.log('Comments Response:', comments);

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const commentId = req.params.comment_id;
  const signId = res.locals.decoded.sign_id; // JWT에서 사용자 sign_id 가져오기

    try {
    // 댓글이 존재하는지 확인
    const comment = await Comment.findOne({
        where: {
            comment_id: commentId,
            sign_id: signId // 해당 사용자에 대한 댓글인지 확인
        }
    });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await comment.destroy();

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};