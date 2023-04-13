const categoryModel = require('../../models/categoryModel');
const tagModel = require('../../models/tagModel');
const formidable = require('formidable');
const { article_validator } = require('../../validator/validator')

const fs = require('fs');
const articleModel = require('../../models/articleModel');

// Get allTag_allCategory
module.exports.get_tag_category = async (req, res) => {
    try {
        const allTag = await tagModel.find({});
        const allCategory = await categoryModel.find({});
        res.status(200).json({ allCategory, allTag })
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}

//Add Artical
module.exports.add_artical = (req, res) => {

    //Module formidable là một module rất tuyệt vời để làm việc với form, file uploads.
    const formDataHendle = formidable({
        multiples: true
    })
    const { adminId, adminName } = req;

    
    // Xử lý upload file với hàm .parse
    formDataHendle.parse(req, (err, fields, files) => {
        if (!err) {

            //Neu ko loi bao gom 5 thuoc tinh
            const { title, category, slug, tag, text } = fields;
            //Validator category
            const validate = article_validator(fields, files);
            //Kiem tra dk validate
            if (validate.validated) {
                //Category
                const categoryName = category.split('-').join(' ');
                //Tag
                const tagName = tag.split('-').join(' ');
                //Lấy ra đường dẫn tạm của tệp tin trên server
                files.image.originalFilename = Date.now() + files.image.originalFilename;

                //Đường dẫn mới khi upload 
                const uploadPath = __dirname + `../../../../frontend/public/articalImage/${files.image.originalFilename}`;
                
                //Sử dung module fs để đọc nội dung file viewUploadForm
                fs.copyFile(files.image.filepath, uploadPath, async (error) => {
                    if (error) {
                        res.status(400).json({
                            errorMessage: {
                                imageUpload: 'Image upload file'
                            }
                        })
                    } else {
                        try {
                            await articleModel.create({
                                adminId,
                                adminName,
                                title,
                                slug,
                                category: categoryName,
                                category_slug: category,
                                tag: tagName,
                                tag_slug: tag,
                                articleText: text,
                                image: files.image.originalFilename
                            })
                            res.status(201).json({
                                successMessage: 'Article add successfull'
                            })
                        } catch (error) {
                            console.log(error.message)
                            res.status(500).json({
                                errorMessage: {
                                    error: 'Internal server error'
                                }
                            })
                        }
                    }
                })
            } else {
                res.status(400).json({ errorMessage: validate.error })
            }
        }
    })
}

module.exports.get_artical = async (req, res) => {
    const { role, adminId } = req;
    const { currentPage, searchValue } = req.query;

    const parPage = 4;

    const skipPage = parseInt(currentPage - 1) * parPage;

    let articals = [];

    try {
        let articleCount = 0;

        if (searchValue) {
            if (role === 'admin') {
                articleCount = await articleModel.find({}).countDocuments();
                articals = await articleModel.find({}).skip(skipPage).limit(parPage).sort({ createAt: -1 });
                articals = articals.filter(ar => ar.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            } else {
                articleCount = await articleModel.find({ adminId }).countDocuments();
                articals = await articleModel.find({ adminId }).skip(skipPage).limit(parPage).sort({ createAt: -1 });
                articals = articals.filter(ar => ar.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1);
            }
        } else {
            if (role === 'admin') {
                articleCount = await articleModel.find({}).countDocuments();
                articals = await articleModel.find({}).skip(skipPage).limit(parPage).sort({ createAt: -1 });
            } else {
                articleCount = await articleModel.find({ adminId }).countDocuments();
                articals = await articleModel.find({ adminId }).skip(skipPage).limit(parPage).sort({ createAt: -1 });
            }
        }

        res.status(200).json({
            allArticle: articals,
            parPage,
            articleCount
        })
    } catch (error) {
        res.status(500).json({
            errorMessage: {
                error: 'Internal server error'
            }
        })
    }
}

module.exports.edit_artical = async (req, res) => {

    const { articleSlug } = req.params;
    const { adminId, role } = req;

    try {
        const getArticle = await articleModel.findOne({ slug: articleSlug });
        if (getArticle && getArticle.adminId === adminId || getArticle.role === role) {
            res.status(200).json({ editArticle: getArticle })
        } else {
            res.status(404).json({
                errorMessage: {
                    error: 'You can not edit this article'
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

module.exports.update_artical = async (req, res) => {
    const { title, category, slug, tag, text, articleId } = req.body;
    const { adminId, role } = req;
    const validate = article_validator(req.body, '');

    if (validate.validated) {
        try {
            const getArticle = await articleModel.findById(articleId);

            if (getArticle && getArticle.adminId === adminId || getArticle.role === role) {
                const categoryName = category.split('-').join(' ');
                const tagName = tag.split('-').join(' ');
                await articleModel.findByIdAndUpdate(articleId, {
                    //trim() dùng để xóa tất cả những khoảng trắng ở đầu và cuối chuỗi.
                    title: title.trim(),
                    slug: slug.trim(),
                    category: categoryName,
                    category_slug: category,
                    tag: tagName,
                    tag_slug: tag,
                    articleText: text,
                })
                res.status(201).json({
                    successMessage: 'Article edit successfull'
                })

            } else {
                res.status(404).json({
                    errorMessage: {
                        error: 'You can not edit this article'
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
    } else {
        res.status(400).json({ errorMessage: validate.error })
    }
}

module.exports.delete_artical = async (req, res) => {
    const { articleId } = req.params;
    const { adminId, role } = req;
    try {
        const getArticle = await articleModel.findById(articleId);

        if (getArticle && getArticle.adminId === adminId || getArticle.role === role) {
            await articleModel.findByIdAndDelete(articleId);
            res.status(201).json({
                successMessage: 'Article delete successfull'
            })

        } else {
            res.status(404).json({
                errorMessage: {
                    error: 'You can not edit this article'
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