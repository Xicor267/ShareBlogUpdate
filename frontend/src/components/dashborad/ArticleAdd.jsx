import React, { useState, useRef, useEffect } from 'react'
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { BsCardImage } from "react-icons/bs";
import JoditEditor from "jodit-react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { get_tag_category, add_articale} from "../../store/actions/Dashborad/articalAction";

const ArticleAdd = ({history}) => {
    const [text, setText] = useState('')
    const editor = useRef()
    const config = {
        readonly: false
    }

    const { allCategory, allTag, loader ,articleError,articleSuccessMessage} = useSelector(state => state.dashboradArtical)

    const [slug, setSlug] = useState('')

    const [updateBtn, setUpdateBtn] = useState(false)

    const dispatch = useDispatch()

    const [state, setState] = useState({
        title: '',
        category: '',
        tag: '',
        image: ''
    })

    //Chon image
    const [image, setImage] = useState({
        imageName: '',
        img: ''
    })

    //Nhap input
    const inputHendle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    //Xu ly title
    const titleHendler = (e) => {
        setState({
            ...state,
            title: e.target.value
        })
        const createSlug = e.target.value.trim().split(' ').join('-');
        setSlug(createSlug)
    }

    //Xu ly slug
    const slugHendle = (e) => {
        setSlug(e.target.value);
        setUpdateBtn(true)
    }

    //Update button slug
    const updateSlug = (e) => {
        e.preventDefault();
        const newSlug = slug.trim().split(' ').join('-');
        setSlug(newSlug)
        //neu chua update thi se ko hien thi btn ||
        //neu update roi btn se bien mat 
        setUpdateBtn(false)
    }

    //Xu li event image
    const imageHendle = (e) => {
        console.log(e.target.files)
        //Kiem tra file image
        if (e.target.files.length !== 0) {
            setState({
                ...state,
                image: e.target.files[0]
            })
            //Doc data file image
            const imageReader = new FileReader();
            imageReader.onload = () => {
                setImage({
                    ...image,
                    //Tạo phần tử image và gán bằng dữ liệu data base64 của reader result
                    img: imageReader.result,
                    imageName: e.target.files[0].name
                })
            }
            //Tiến hành đọc file thông qua phương thức readAsDataURL
            imageReader.readAsDataURL(e.target.files[0]);
        }
    }
    
    // Xu li event add thoon qua form data 
    const add = (e) => {
        e.preventDefault();
        const { title, image, category, tag } = state;

        //Su dung FormData có thể submit dữ liệu lên server
        //thông qua AJAX như là đang submit form bình thường
        const formData = new FormData();

        //append() cho phép chèn thêm một cặp key => value vào trong FormData
        //có thể sử dụng để chèn giá trị mới cho key có sẵn hoặc chèn mới
        //tương tự việc update giá trị cho input
        formData.append('title', title);
        formData.append('image', image);
        formData.append('category', category);
        formData.append('tag', tag);
        formData.append('slug', slug);
        formData.append('text', text);

        //truyen vao addw_article
        dispatch(add_articale(formData))
    }

    //Get category && tag
    useEffect(() => {
        dispatch(get_tag_category())
    }, [])

    useEffect(()=>{
        if(articleSuccessMessage){
            toast.success(articleSuccessMessage);
            dispatch({type :'ART_SUCCESS_MESSAGE_CLEAR'})
            history.push('/dashborad/all-article');
        }
    },[articleSuccessMessage])

    return (
        <div className="add-article">
            <Toaster position={'bottom-center'}
                reverseOrder={false}
                toastOptions={
                    {
                        style: {
                            fontSize: '15px'
                        }
                    }
                }
            />

            <Helmet>
                <title>Article add</title>
            </Helmet>
            <div className="add">
                <div className="title-show-article">
                    <h2>Add Article</h2>
                    <Link className='btn' to="/dashborad/all-article">All Article</Link>
                </div>
                <form onSubmit={add}>
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title">Article title</label>
                        <input onChange={titleHendler} value={state.title} type="text" name='title' placeholder='article title' className="form-control" id='title' />
                        {
                            articleError?<p className='error'>{articleError.title}</p>:''
                        }

                    </div>
                    {/* Slug */}
                    <div className="form-group">
                        <label htmlFor="slug">Article slug</label>
                        <input onChange={slugHendle} value={slug} type="text" placeholder='article slug' className="form-control" name='slug' id='slug' />
                        {
                            articleError?<p className='error'>{articleError.slug}</p>:''
                        }
                    </div>
                    {/* Update */}
                    {
                        updateBtn ? <button onClick={updateSlug} className='btn'>Update</button> : ''
                    }
                    {/* Category */}
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select onChange={inputHendle} value={state.category} className='form-control' name="category" id="category">
                            <option value="">--select article category--</option>
                            {
                                allCategory.length > 0 ? allCategory.map((c, index) => {
                                    return <option key={index} value={c.categorySlug}>{c.categoryName}</option>
                                }) : ''
                            }
                        </select>
                        {
                            articleError?<p className='error'>{articleError.category}</p>:''
                        }
                    </div>
                    {/* Tag */}
                    <div className="form-group">
                        <label htmlFor="tag">Tag</label>
                        <select onChange={inputHendle} value={state.tag} className='form-control' name="tag" id="tag">
                            <option value="">--select article tag--</option>
                            {
                                allTag.length > 0 ? allTag.map((t, index) => { 
                                    return <option key={index} value={t.tagSlug}>{t.tagName}</option>
                                }) : ''
                            }
                        </select>
                        {
                            articleError?<p className='error'>{articleError.tag}</p>:''
                        }
                    </div>
                    {/* Text Artical */}
                    <div className="form-group img_upload">

                        <div className="upload">
                            <label htmlFor="upload_image"><BsCardImage style={{fontSize:'30px'}}/></label>
                            <input type="file" id='upload_image' />
                        </div><br/>

                        <label htmlFor="article text">Article text</label>
                        <JoditEditor
                             value={text}
                             tabIndex={1}
                             ref={editor}
                             config={config}
                             onBlur={newText => setText(newText)}
                             onChange={newText => { }} 
                        />
                        {
                            articleError?<p className='error'>{articleError.text}</p>:''
                        }
                    </div>
                    {/* Image */}
                    <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <div className="image-select">
                            {
                                image.imageName ? <span>{image.imageName}</span> : <span></span>
                            }
                            <label htmlFor="image">Select Image</label>
                            <input onChange={imageHendle} type="file" className="form-control" name='image' id='image' />
                        </div>
                        <div className="image">
                            {
                                image.img ? <img src={image.img} alt="" /> : ''
                            }
                        </div>
                        {
                            articleError?<p className='error'>{articleError.image}</p>:''
                        }
                    </div>
                    {/* Spinner */}
                    <div className="form-group">
                        {
                            loader ? <button className="btn btn-block">
                                <div className="spinner">
                                    <div className="spinner1"></div>
                                    <div className="spinner2"></div>
                                    <div className="spinner3"></div>
                                </div>
                            </button> : <button className="btn btn-block">Add Article</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ArticleAdd