const validator = require('validator')
// admin-login
const adminModel = require('../models/adminModel')
const bcrpty = require('bcrypt');
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const userModel = require('../models/userModel')
const nodeMiler = require('nodemailer')
const fs = require('fs')

module.exports.admin_login = async(req, res) => {
    const { email, password } = req.body

    const error = {

    }

    if (email && !validator.isEmail(email)) {
        error.email = "Please provide your valid email"
    }
    if (!email) {
        error.email = "please provide your email";
    }
    if (!password) {
        error.password = "please provide your password"
    }

    if (Object.keys(error).length > 0) {
        return res.status(400).json({ errorMessage: error })
    } else {
        try {
            const getAdmin = await adminModel.findOne({email}).select('+password')
            
            if(getAdmin) {
                const matchPassword = await bcrpty.compare(password, getAdmin.password);
                if (matchPassword) {
                    //So sanh token sau khi dung password
                    const token = jwt.sign({
                        id: getAdmin._id,
                        name: getAdmin.adminName,
                        role: getAdmin.role,
                        image: getAdmin.image
                    }, process.env.SECRET, { expiresIn: '7d' });
                    
                    //Neu success thi tra ve 200 cung voi time token 
                    // hour * minute * second * milisecond
                    res.status(200).cookie('blog_token', token, {
                        expires: new Date(
                            Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }).json({
                        successMessage: 'login successfull',
                        token
                    })

                } else {
                    return res.status(400).json({ errorMessage: { error: "Passwod does not match" } });
                }
            } else {
                return res.status(400).json({ errorMessage: { error: "Email does not exists" } })
            }
        } catch (error) {
            return res.status(500).json({ errorMessage: { error: "Internal server error" } })            
        }
    }
}

module.exports.user_register = async (req, res) => {
    //Module formidable là một module rất tuyệt vời để làm việc với form, file uploads
    const formData = formidable()

    // Xử lý upload file với hàm .parse
    formData.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ errorMessage: { error: "form data parse filed" } });
        } else {
            const { name, email, password } = fields
            var lowerCaseLetters = /[a-z]/g

            //Validator
            const errorData = {}
            if (!name) {
                errorData.name = 'Please provide your name'
            }

            if (!email) {
                errorData.email = 'Please provide your email'
            }

            if (email && !validator.isEmail(email)) {
                errorData.email = 'Please provide your valid email'
            }

            if (!password) {
                errorData.password = 'Please provide your password'
            } else if (password.length <= 3) {
                errorData.password = 'Should be more than 3 characters'
            } else if(!password.match(lowerCaseLetters)) {
                errorData.password = 'Should be character letter'
            }

            if (Object.keys(files).length === 0) {
                errorData.image = 'Please provide your image'
            }

            if (Object.keys(errorData).length === 0) {
                try {
                    const getUser = await userModel.findOne({ email })
                    //Kiem tra email trung ko
                    if (getUser) {
                        return res.status(500).json({ errorMessage: { error: "Your email already use" } });
                    } else {

                        //Math.floor() Trả về số nguyên lớn nhất nhỏ hơn hoặc bằng tham số truyền 
                        //vào hay còn gọi nôm na làm tròn xuống
                        const otp = Math.floor(Math.random() * 100000 + 345678)

                        //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
                        const transporter = nodeMiler.createTransport({ // config mail server
                            service: 'Gmail',
                            auth: {
                                user: process.env.USER_EMAIL,
                                pass: process.env.USER_PASSWORD
                            }
                        })

                        const mailOption = { // thiết lập đối tượng, nội dung gửi mail
                            from: process.env.USER_EMAIL,
                            to: email,
                            subject: ' Sending email mern blog',
                            html: `
                                <div style="max-width: 500px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                                <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the ShareBlog Website.</h2>
                                <div style="text-align: center; font-weight: bold">
                                    <p>Congratulations! You're almost set to start using ShareBlog</p>
                                    <p>Your OTP to validate your email address : <a href="" style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
                                    ${otp}</a></p>
                                    <p>Thank you for using shareblog website !!!</p>
                                </div>
                                </div>
                                `
                        }

                        transporter.sendMail(mailOption, async (error) => {
                            if (error) {
                                return res.status(500).json({ errorMessage: { error: "Somethings else please try again" } });
                            } else {

                                //sign đã được "chỉnh sửa" để tạo access token
                                const verifyEmailToken = jwt.sign({
                                    email,
                                    name,
                                    password: await bcrpty.hash(password, 10),
                                    imageInfo: files,
                                    otpCode: otp
                                }, process.env.SECRET, {
                                    expiresIn: process.env.TOKEN_EXP
                                })

                                const option = {
                                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
                                }
                                res.status(201).cookie('emailVerifyToken', verifyEmailToken, option).json({ successMessage: "Check your email and submit otp" })
                            }
                        })
                    }
                } catch (error) {
                    return res.status(500).json({ errorMessage: { error: "Internal server error" } });
                }
            } else {
                return res.status(400).json({ errorMessage: errorData })
            }
        }
    })
}

module.exports.verify_email = async (req, res) => {
    const { otp } = req.body

    const { emailVerifyToken } = req.cookies

    if (!otp) {
        res.status(404).json({ errorMessage: 'please provide yout otp' })
    } else {
        const { name, email, password, otpCode, imageInfo } = await jwt.verify(emailVerifyToken, process.env.SECRET)

        const imageName = Date.now() + imageInfo.image.originalFilename;

        const disPath = __dirname + `../../../frontend/public/userImage/${imageName}`

        try {
            if (parseInt(otp) !== otpCode) {
                res.status(404).json({ errorMessage: { error: 'please provide yout valid otp' } })
            } else {
                //Sử dung module fs để đọc nội dung file viewUploadForm
                fs.copyFile(imageInfo.image.filepath, disPath, async (err) => {
                    if (!err) {
                        const createUser = await userModel.create({
                            userName: name,
                            email,
                            loginMethod: 'manually',
                            password,
                            image: `http://localhost:3000/userImage/${imageName}`
                        })

                        const token = jwt.sign({
                            id: createUser._id,
                            email: createUser.email,
                            name: createUser.userName,
                            image: createUser.image,
                            role: createUser.role,
                            loginMethod: createUser.loginMethod,
                            accessStatus: createUser.accessStatus,
                            createdAt: createUser.createdAt
                        }, process.env.SECRET, {
                            expiresIn: process.env.TOKEN_EXP
                        })

                        const option = {
                            //Token luu tru dc 3 ngay
                            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                        }

                        //Sau khi nhap dung OPT hop le 
                        //thi verifyemailtoken se bi xoa di
                        res.clearCookie('emailVerifyToken')
                        res.status(201).cookie('blog_token', token, option).json({
                            successMessage: "Your register successfull",
                            token
                        })
                    }
                })
            }
        } catch (error) {
            return res.status(500).json({ errorMessage: { error: "Internal server error" } });
        }
    }
}

module.exports.user_login = async (req, res) => {
    const { email, password } = req.body;

    const error = {

    }

    if (email && !validator.isEmail(email)) {
        error.email = "please provide your valid email"
    }
    if (!email) {
        error.email = "please provide your email";
    }
    if (!password) {
        error.password = "please provide your password"
    } else if (password.length < 3) {
        errorData.password = 'Should be more than 3 characters'
    }

    if (Object.keys(error).length > 0) {
        return res.status(400).json({ errorMessage: error })
    } else {
        try {
            const getUser = await userModel.findOne({ email }).select('+password');
            if (getUser) {
                const matchPassword = await bcrpty.compare(password, getUser.password);
                if (matchPassword) {
                    const token = jwt.sign({
                        id: getUser._id,
                        email: getUser.email,
                        name: getUser.userName,
                        image: getUser.image,
                        role: getUser.role,
                        loginMethod: getUser.loginMethod,
                        accessStatus: getUser.accessStatus,
                        createdAt: getUser.createdAt
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXP
                    })

                    const option = {
                        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                    }
                    res.status(201).cookie('blog_token', token, option).json({
                        successMessage: "Your log successfull",
                        token
                    })

                } else {
                    return res.status(400).json({ errorMessage: { error: "Passwod does not match" } });
                }

            } else {
                return res.status(400).json({ errorMessage: { error: "Email does not exits" } });
            }
        } catch (error) {
            return res.status(500).json({ errorMessage: { error: "Internal server error" } });
        }
    }
}

module.exports.user_logout = async (req, res) => {

    const option = {
        expires: new Date(Date.now())
    }

    res.cookie('blog_token', null, option)
    res.status(200).json({ message: 'success' })
}