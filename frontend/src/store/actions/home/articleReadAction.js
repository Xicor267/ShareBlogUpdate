import axios from 'axios'

export const get_article_details = (articleSlug) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/rest-api/home/article-details/${articleSlug}`, { withCredentials: true })
        dispatch({
            type: 'READ_ARTICLE_GET_SUCCESS',
            payload: response.data
        })
    } catch (error) {
        console.log(error.response)
    }
}

export const like_dislike_get = (articleSlug) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:5000/rest-api/home/like-dislike-get/${articleSlug}`, { withCredentials: true })
        dispatch({
            type: "LIKE_DISLIKE_GET_SUCCESS",
            payload: response.data
        })
    } catch (error) {
        console.log(error.response)
    }
}


export const user_article_like = (data) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/rest-api/user-like-article`, data, { withCredentials: true })
        dispatch({
            type: 'USER_LIKE_SUCCESS',
            payload: response.data
        })
    } catch (error) {
        console.log(error.response)
    }
}


export const user_article_dislike = (data) => async (dispatch) => {
    try {
        const response = await axios.put(`http://localhost:5000/rest-api/user-dislike-article`, data, { withCredentials: true })
        dispatch({
            type: 'USER_DISLIKE_SUCCESS',
            payload: response.data
        })
    } catch (error) {
        console.log(error.response)
    }
}