import React, { useEffect } from 'react';
import { BsFillPeopleFill } from "react-icons/bs";
import { FaRegCaretSquareRight, FaRegUser, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from 'react-redux';
import { dashboard_index_data_get } from '../../store/actions/Dashborad/dashboardAction';

const DashboradIndex = () => {

    const dispatch = useDispatch()

    // const { categoryCount } = useSelector(state => state.dashboradCategory)
    // const { tagCount } = useSelector(state => state.dashboradTag)
    // const { articleCount } = useSelector(state => state.dashboradArtical)

    const { dashboard_data, articleCount, categoryCount, tagCount, subAdminCount, userCount } = useSelector(state => state.dashboardIndex)

    let graphData = []

    if (dashboard_data.monthArray?.length > 0) {

        for (let i = 0; i < 12; i++) {
            graphData.push(dashboard_data.monthArray[i].viewer)
        }

    }

    // Charts
    const chartOptions = {
        series: [
            {
                name: "Visitors",
                data: graphData
            }
        ],
        options: {
            color: ['#181ee8', '#181ee8'],
            chart: {
                background: 'transparent'
            },
            //Hien thi du lieu cot
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'soomth'
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apl', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            legend: {
                position: 'top'
            },
            grid: {
                show: 'false'
            }
        }
    }

    useEffect(() => {
        dispatch(dashboard_index_data_get())
    }, [])

    return (
        <div className='dashborad-main-content-elements'>
            <div className="dashborad-elements">
                <div className="cards">
                    {/* Visitors */}
                    <div className="single-card">
                        <div className="card_icon">
                            <BsFillPeopleFill/>
                        </div>
                        <div className="card_info">
                            <h2>{dashboard_data.viewer > 10 ? `${dashboard_data.viewer - 1}+` : dashboard_data.viewer}</h2>
                            <span>Visitors</span>
                        </div>
                    </div>
                    {/* Articals */}
                    <Link className="single-card" to='/dashborad/all-article/:currentPage?'>
                        <div className="card_icon">
                            <BsFillPeopleFill />
                        </div>
                        <div className="card_info">
                            <h2>{articleCount > 1 ? `${articleCount - 1}+` : articleCount}</h2>
                            <span>Articals</span>
                        </div>
                    </Link>
                    {/* Categorys */}
                    <Link className="single-card" to='/dashborad/all-category/:currentPage?'>
                        <div className="card_icon">
                            <FaRegCaretSquareRight />
                        </div>
                        <div className="card_info">
                            <h2>{categoryCount > 1 ? `${categoryCount - 1}+` : categoryCount}</h2>
                            <span>Categories</span>
                        </div>
                    </Link>
                    {/* Tags */}
                    <Link className="single-card" to='/dashborad/all-tag/:currentPage?'>
                        <div className="card_icon">
                            <FaTag />
                        </div>
                        <div className="card_info">
                            <h2>{tagCount > 1 ? `${tagCount - 1}+` : tagCount}</h2>
                            <span>Tags</span>
                        </div>
                    </Link>
                    {/* Sub Admins */}
                    <Link to='/dashborad/all-sub-admin/:currentPage?' className="single-card">
                        <div className="card_icon">
                            <FaRegUser />
                        </div>
                        <div className="card_info">
                            <h2>{subAdminCount > 1 ? `${subAdminCount - 1}+` : subAdminCount}</h2>
                            <span>Sub Admins</span>
                        </div>
                    </Link>
                    {/* Users */}
                    <Link to='/dashborad/all-user/:currentPage?' className="single-card">
                        <div className="card_icon">
                            <FaRegUser />
                        </div>
                        <div className="card_info">
                            <h2>{userCount > 1 ? `${userCount - 1}+` : userCount}</h2>
                            <span>Users</span>
                        </div>
                    </Link>
                </div>
                {/* Chart from "react-apexcharts"*/}
                <div className="card-chart">
                    <Chart
                        options={chartOptions.options}
                        series={chartOptions.series}
                        type='bar'
                        height='100%'
                        width='100%'
                    />
                    <br/><p style={{textAlign: 'center',fontWeight: 'bold'}}>[ UserView Chart ]</p>
                </div>
            </div>
        </div>
    )
}

export default DashboradIndex