const Comment = require('../models/comment'); 
const Diary = require('../models/diary');
const Report = require('../models/report');
const User = require('../models/user');
const { deductPoints } = require('./point'); 

// 신고하기
exports.createReport = async (req, res) => {
    try {
        const signId = res.locals.decoded.sign_id; // JWT에서 sign_id 가져오기
        const { diary_id, comment_id, report_type, report_reason, is_false_report } = req.body;

        // 신고된 다이어리 정보 가져오기
        const diary = await Diary.findOne({ where: { diary_id: diary_id } });

        if (!diary) {
            return res.status(404).json({ error: 'Diary not found' });
        }

        const reportedUserSignId = diary.sign_id; // 다이어리 작성자의 sign_id

        // 신고된 댓글 정보 가져오기
        let commentAuthorSignId = null;
        if (comment_id) {
            const comment = await Comment.findOne({ where: { comment_id: comment_id } });
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            commentAuthorSignId = comment.sign_id; // 댓글 작성자의 sign_id
        }

        // 신고 생성
        const createReport = await Report.create({
            reporter_id: signId,     // 신고한 유저의 sign_id
            reported_id: reportedUserSignId, // 신고당한 유저의 sign_id
            diary_id: diary_id,      // 신고된 다이어리 ID
            comment_id: comment_id || null, // 신고된 댓글 ID
            report_type: report_type, // 신고 유형
            report_reason: report_reason // 신고 이유 (선택 사항)
        });

        if (is_false_report) {
            // 허위 신고일 경우, 신고한 유저의 10포인트 차감 
            await deductPoints(req, res, '허위 신고', 10);
        } else {
            // 신고당한 유저의 ban_count 증가
            const reportedUser = await User.findOne({ where: { sign_id: reportedUserSignId } });
            if (reportedUser) {
                await reportedUser.increment('ban_count', { by: 1 }); // ban_count 1 증가

                // ban_count가 3 이상일 경우 15포인트 차감
                if (reportedUser.ban_count >= 3) {
                    await deductPoints(req, res, '반복적인 신고 접수', 15);
                }

                // 다이어리 신고 시 다이어리 작성자에게 10포인트 차감
                await deductPoints(req, res, '게시글 신고', 10);
            }

            // 댓글이 신고된 경우 댓글 작성자의 5포인트 차감
            if (commentAuthorSignId) {
                const commentAuthor = await User.findOne({ where: { sign_id: commentAuthorSignId } });
                if (commentAuthor) {
                    await deductPoints(req, res, '댓글 신고', 5);
                }
            }
        }

        res.status(201).json({
            message: 'Report created successfully',
            data: createReport
        });
    } catch (error) {
        console.error('Error creating Report:', error);
        res.status(500).json({ error: 'An error occurred while creating the Report' });
    }
};

// 신고 목록 조회 (최신순)
exports.reportList = async (res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // 페이지와 항목 수 받아옴
        const offset = (page - 1) * limit;

        const report = await Report.findAll({
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit), // 항목 수 제한
            offset: offset, // 시작 지점 설정
        });

        console.log(report);
        res.json(report);
    } catch (error) {
        console.error('Error listing Reports:', error);
        res.status(500).json({ error: 'An error occurred while listing Reports' });
    }
}