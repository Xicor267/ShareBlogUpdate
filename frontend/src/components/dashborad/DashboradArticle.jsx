import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { FaRegEye, FaSearch } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import htmlToText from "react-html-parser";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Pagination from '../home/Pagination';
import toast, { Toaster } from "react-hot-toast";

import { get_all_article, delete_article } from "../../store/actions/Dashborad/articalAction";

const DashboradArticle = () => {

    const dispatch = useDispatch();

    const { currentPage } = useParams();

    const { allArticle, parPage, articleCount, articleSuccessMessage } = useSelector(state => state.dashboradArtical)

    //
    useEffect(() => {
        dispatch(get_all_article(currentPage ? currentPage.split('-')[1] : 1, ''))
    }, [currentPage, dispatch])

    //
    useEffect(() => {
        if (articleSuccessMessage) {
            toast.success(articleSuccessMessage)
            dispatch({ type: 'ART_SUCCESS_MESSAGE_CLEAR' })
            dispatch(get_all_article(currentPage ? currentPage.split('-')[1] : 1, ''))
        }
    }, [dispatch, articleSuccessMessage])

    return (
        <div className="dashborad-article">
            <Helmet>
                <title>All Article</title>
            </Helmet>
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

            <div className="article-action-pagination">
                <div className="numof-search-newAdd">
                    {/* Title */}
                    <div className="numof">
                        <h2>Article ({articleCount})</h2>
                    </div>
                    {/* Search */}
                    <div className="searchOf">
                        <div className="search">
                            <input onChange={(e) => dispatch(get_all_article(currentPage ? currentPage.split('-')[1] : 1, e.target.value))} type="text" placeholder='search article' className="form-control" />
                        </div>
                        <span><FaSearch /></span>
                    </div>
                    <div className="newAdd">
                        <Link className='btn' to='/dashborad/article-add'>Add New</Link>
                    </div>
                </div>
                {/* Artical */}
                <div className="height-70vh">
                    <div className="articles">
                        {
                            allArticle.length > 0 ? allArticle.map((art, index) =>
                                <div className="article">
                                    <img src={`http://localhost:3000/articalImage/${art.image}`} alt="" />
                                    
                                    <Link to={`/dashborad/all-tag`} style={{color:"#0d798f",
                                    fontWeight: "lighter", fontStyle:'italic'}}>#{art.tag}</Link>

                                    <Link to={`/artical/details/${art.slug}`} style={{fontStyle:'italic'}}>{htmlToText(art.title.slice(0, 30))}</Link>
                                    <p>{htmlToText(art.articleText.slice(0, 50))}</p>
                                    <div className="action">
                                        <span>
                                            <Link to={`/dashborad/article/edit/${art.slug}`}><MdEdit /></Link>
                                        </span>
                                        <span>
                                            <Link to={`/artical/details/${art.slug}`}><FaRegEye /></Link>
                                        </span>
                                        <span onClick={() => dispatch(delete_article(art._id))}><MdDelete /></span>
                                    </div>
                                </div>
                            ) : 'Article not found...'
                        }
                    </div>
                </div>
                {
                    articleCount === 0 || articleCount < parPage ? "" : <Pagination
                        pageNumber={currentPage ? currentPage.split('-')[1] : 1}
                        parPage={parPage}
                        itemCount={articleCount}
                        path='/dashborad/all-article'
                    />
                }
            </div>
        </div>
    )
}

export default DashboradArticle