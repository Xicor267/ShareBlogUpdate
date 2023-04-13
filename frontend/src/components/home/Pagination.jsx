import React from 'react';
import { Link } from "react-router-dom";
import { BsChevronDoubleLeft,BsChevronDoubleRight } from "react-icons/bs";

const Pagination = ({pageNumber,parPage,itemCount,path}) => {
    
    //ceil(), Làm tròn một số lên số nguyên gần nó nhất
    const totalPage =  Math.ceil(itemCount/parPage)

    let startLink = pageNumber
    
    let diff = totalPage - pageNumber

    //Toi thieu 4 phan trang
    if(diff<=4){
        startLink = parseInt(totalPage) - 4;
    }

    ////Toi thieu 4 phan trang
    let endLink = parseInt(startLink) + 4 ;
    //Neu ko co tren 2 phan trang => 1 phan trang
    if(startLink <=0){
        startLink = 1 ;
    }

    //Active neu co tren 1 phan trang
    const createLink  = () =>{
        const storeLink = [] ;

        for(var i = startLink ; i < endLink ; i++){
            storeLink.push(
                <li key={i} className={parseInt(pageNumber) === i ? 'active':''}><Link to={`${path}/page-${i}`} >{i}</Link></li>
            )
        }
        return storeLink
    }

    //netxpage 
    const nextPage = () =>{
        if(pageNumber < totalPage){
            return <li><Link to={`${path}/page-${parseInt(pageNumber) + 1}`}><BsChevronDoubleRight/></Link></li>
        }else{
            return <button className='not-hover' disabled ><span><BsChevronDoubleRight/></span></button>
        }
    }

    //prepage 
    const prePage = () =>{
        if(pageNumber>1){
            return <li><Link to={`${path}/page-${parseInt(pageNumber) - 1}`}><BsChevronDoubleLeft/></Link></li>
        }else{
            return <button className='not-hover' disabled ><span><BsChevronDoubleLeft/></span></button>
        }
    }
    
    return (
        <div className='pagination'>
            <ul>
                {prePage()}
                {createLink()}
                {nextPage()}               
            </ul>
        </div>
    )
}

export default Pagination