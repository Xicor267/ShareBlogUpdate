const articleModel = require('../../models/articleModel')
const notificationModel = require('../../models/NotificationModel')


module.exports.getArticleDetails = async (req, res) => {
    const { articleSlug } = req.params;
    try {
        const read_article = await articleModel.findOne({ slug: articleSlug })
        const related_article = await articleModel.aggregate([{
            $match: {
                $and: [{
                    category_slug: {
                        $eq: read_article.category_slug
                    }
                }, {
                    slug: {
                        $ne: articleSlug
                    }
                }]
            }
        },
        {
            $sample: {
                size: 3
            }
        }
        ])

        const readMore = await articleModel.aggregate([{
            $match: {
                $and: [{
                    category_slug: {
                        // Các $eq toán tử khớp với các tài liệu trong đó
                        // giá trị của một trường bằng với giá trị đã chỉ định.
                        $eq: read_article.category_slug
                    }
                }, {
                    slug: {
                        // $ne (Khác (Not Equals)) chọn các tài liệu trong đó giá trị của trường không bằng 
                        //giá trị đã chỉ định. Điều này bao gồm các tài liệu không chứa trường này.

                        //VD khi click detail ARTICLE_3 => readmore la ARTICLE_5 neu co $ne
                        $ne: articleSlug
                    }
                }]
            }
        },
        {
            $sample: {
                size: 1
            }
        }
        ])
        const moreTag = await articleModel.distinct('tag_slug', {
            tag_slug: {
                // $ne (Khác (Not Equals))
                $ne: read_article.tag_slug
            }
        })
        res.status(200).json({
            related_article,
            readMore: {
                title: readMore.length > 0 ? readMore[0].title : "",
                slug: readMore.length > 0 ? readMore[0].slug : "",
            },
            read_article,
            moreTag
        })
    } catch (error) {
        // console.log(error.message)
        res.status(500).json({ errorMessage: { error: "Iternal server error" } })
    }
}

module.exports.like_dislike_get = async (req, res) => {

    const { articleSlug } = req.params

    const { userId, userName, role } = req

    try {
        const get = await articleModel.findOne({ slug: articleSlug }).select({ like: 1, dislike: 1, like_dislike: 1 })
        
        const check_user = get.like_dislike.find(u => u.like_disliker_id === userId)
        if (check_user) {
            if (check_user.like_or_dislike === 'like') {
                res.status(200).json({
                    like_status: 'like',
                    dislike_status: '',
                    like: get.like,
                    dislike: get.dislike
                })
            } else {
                res.status(200).json({
                    like_status: '',
                    dislike_status: 'dislike',
                    like: get.like,
                    dislike: get.dislike
                })
            }
        } else {
            res.status(200).json({
                like_status: "",
                dislike_status: "",
                like: get.like,
                dislike: get.dislike
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports.like_article = async (req, res) => {

    const { articleId, like_status, dislike_status, adminId } = req.body 

    const { userName, userId } = req

    try {
        //Lets try to Find a user
        const { like, slug, dislike } = await articleModel.findOne({ _id: articleId })

        //Neu chua co like_dislike status thi create like or dislike
        if (!like_status && !dislike_status) {
            //Để có thể sửa đổi một bản ghi duy nhất trong MongoDB 
            //thì sử dụng phương thức updateOne()
            await articleModel.updateOne(
                { _id: articleId },
                {
                    like: like + 1,
                    $push: {
                        like_dislike: {
                            like_or_dislike: 'like',
                            like_disliker_id: userId
                        }
                    }
                }
            )

            //Thong bao khi like hoac dislike bai blog
            await notificationModel.create({
                subject: `${userName} like your article`,
                slug,
                adminId
            })
            res.status(200).json({ successMessage: 'you like this article' })
        }
        //Neu chua co like status va chua codislike status thi create like or dislike
        else if (like_status && !dislike_status) {
            await articleModel.updateOne(
                { _id: articleId },
                {
                    like: like - 1,
                    $pull: {
                        like_dislike: {
                            like_disliker_id: userId
                        }
                    }
                }
            )

            //Thong bao khi like hoac dislike bai blog
            await notificationModel.create({
                subject: `${userName} like remove your article`,
                slug,
                adminId
            })
            res.status(200).json({ successMessage: 'undo like this article' })
        }
        else if (!like_status && dislike_status) {
            await articleModel.updateOne(
                {
                    _id: articleId,
                    'like_dislike.like_disliker_id': userId
                },
                {
                    like: like + 1,
                    dislike: dislike - 1,
                    $set: {
                        'like_dislike.$.like_or_dislike': 'like'
                    }
                }
            )

            //Thong bao khi like hoac dislike bai blog
            await notificationModel.create({
                subject: `${userName} like or dislike your article`,
                slug,
                adminId
            })
            res.status(200).json({ successMessage: 'you like this article' })
        }
    } catch (error) {
        res.status(500).json({ errorMessage: { error: "Iternal server error" } })
    }
}

module.exports.dislike_article = async (req, res) => {
    const { articleId, like_status, dislike_status, adminId } = req.body
    const { userName, userId } = req

    try {
        const { like, slug, dislike } = await articleModel.findOne({ _id: articleId })
        if (!like_status && !dislike_status) {
            await articleModel.updateOne(
                { _id: articleId },
                {
                    dislike: dislike + 1,
                    $push: {
                        like_dislike: {
                            like_or_dislike: 'dislike',
                            like_disliker_id: userId
                        }
                    }
                }
            )

            //Thong bao khi like hoac dislike bai blog
            await notificationModel.create({
                subject: `${userName} dislike your article`,
                slug,
                adminId
            })
            res.status(200).json({ successMessage: 'you dislike this article' })
        }
        else if (!like_status && dislike_status) {
            await articleModel.updateOne(
                { _id: articleId },
                {
                    dislike: dislike - 1,
                    $pull: {
                        like_dislike: {
                            like_disliker_id: userId
                        }
                    }
                }
            )

            //Thong bao khi like hoac dislike bai blog
            await notificationModel.create({
                subject: `${userName} remove dislike your article`,
                slug,
                adminId
            })
            res.status(200).json({ successMessage: 'undo dislike' })
        }
        else if (like_status && !dislike_status) {
            await articleModel.updateOne(
                {
                    _id: articleId,
                    'like_dislike.like_disliker_id': userId
                },
                {
                    dislike: dislike + 1,
                    like: like - 1,
                    $set: {
                        'like_dislike.$.like_or_dislike': 'dislike'
                    }
                }
            )
            
            //Thong bao khi like hoac dislike bai blog
            await notificationModel.create({
                subject: `${userName} dislike your article`,
                slug,
                adminId
            })
            res.status(200).json({ successMessage: 'you dislike this article' })
        }
    } catch (error) {
        res.status(500).json({ errorMessage: { error: "Iternal server error" } })
    }
}