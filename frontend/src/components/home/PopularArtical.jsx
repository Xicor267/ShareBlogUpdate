import React, { useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { get_old_recent_acticle } from '../../store/actions/home/homeAction'
import { get_article_details } from '../../store/actions/home/articleReadAction';

const PopularArtical = () => {

    const dispatch = useDispatch()

    const { slug } = useParams()

    const { oldArticle, recentArticle } = useSelector(state => state.homeReducer)

    // const { related_article, readMore, read_article, moreTag } = useSelector(state => state.homeReducer)

    useEffect(() => {
        dispatch(get_article_details(slug))
    }, [slug])

    useEffect(() => {
        dispatch(get_old_recent_acticle())
    }, [])

    return (
        <>
            
            {
                recentArticle.length > 0 && recentArticle.map((art, index) => 
                <>
                <div className="row">
                    <div key= {index} className="col-4">
                        <Link to='/' className='image'><img src={`http://localhost:3000/articalImage/${art.image}`} alt="" /></Link>
                    </div>
                    <div className="col-8">
                        <div className="title-time" key={index}>
                            <Link to={`/artical/details/${art.slug}`}>{art.title}</Link>
                            <br />
                            <span>{moment(art.createdAt).fromNow()}</span>
                        </div>
                    </div>
                </div>
                </>
                )
            }
            
        </>
    )
};

export default PopularArtical;