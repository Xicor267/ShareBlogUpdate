const commentModel = require('../../models/commentModel');
const articleModel = require('./../../models/articleModel')
const notificationModel = require('../../models/NotificationModel')


module.exports.user_comment = async (req, res) => {
    const {
        articleId,
        articleSlug,
        commentText,
        userName,
        userImage
    } = req.body;

    const { role } = req

    try {
        await commentModel.create({
            articleId,
            commentText,
            userName : role === 'admin' ? 'Admin' : userName,
            userImage
        })

        const { adminId } = await articleModel.findById(articleId)

        //Thong bao dashboard khi cmt blog
        await notificationModel.create({
            subject: `${userName} comment your article`,
            slug: articleSlug,
            adminId
        })

        res.status(201).json({
            successMessage: 'Successful comment'
        })
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }

}

module.exports.get_user_comment = async (req, res) => {
    const { articleId } = req.params;
    try {
        const getComment = await commentModel.find({ articleId })
        res.status(200).json({
            comment: getComment
        })
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}

module.exports.comment_reply = async (req, res) => {

    const { commentId, replyText, replyName, replyImage } = req.body
    
    const { role } = req

    try {
        await commentModel.updateOne({
            _id: commentId
        }, {
            $push: {
                replyComment: {
                    replyText,
                    replyImage,
                    replyName: role === 'admin' ? 'Admin' : replyName,
                    replyTime: new Date()
                }
            }
        })

        // const { adminId } = await articleModel.findById(articleId)
        
        // //Thong bao dashboard khi cmt blog
        // await notificationModel.create({
        //     subject: `${userName} reply comment your article`,
        //     slug: articleSlug,
        //     adminId
        // })


        res.status(200).json({
            successMessage: "Reply comment success"
        })
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}

module.exports.comment_home_delete = async (req, res) => {

    const { commentId, role, articleId, adminId } = req.body;

    if (role === 'admin') {
        try {
            await commentModel.findByIdAndDelete(commentId);
            res.status(200).json({ successMessage: "Comment delete success" })
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }
    } else {
        try {
            const getArticle = await articleModel.findById(articleId)

            if (getArticle.adminId === adminId) {
                await commentModel.findByIdAndDelete(commentId)
                res.status(200).json({ successMessage: "Comment delete success" })
            }

        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }
    }
}

module.exports.comment_reply_home_delete = async (req, res) => {

    const { commentId, role, articleId, adminId, replyId } = req.body

    if (role === 'admin') {
        try {
            await commentModel.updateOne(
                { _id: commentId },
                {
                    //$pull toán tử loại bỏ khỏi một mảng hiện có tất cả các phiên bản
                    //của một giá trị hoặc các giá trị khớp với một điều kiện đã chỉ định.
                    $pull: {
                        replyComment: {
                            _id: replyId
                        }
                    }
                }
            )
            res.status(200).json({ successMessage: "Comment reply delete success" })
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }
    } else {
        try {
            const getArticle = await articleModel.findById(articleId);
            if (getArticle.adminId === adminId) {
                await commentModel.updateOne(
                    { _id: commentId },
                    {
                        $pull: {
                            replyComment: {
                                _id: replyId
                            }
                        }
                    }
                )
                res.status(200).json({ successMessage: "Comment reply delete success" })
            } else {
                res.status(401).json({
                    errorMessage: {
                        error: 'you can not delete this reply'
                    }
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: {
                    error: 'Internal server error'
                }
            })
        }
    }
}