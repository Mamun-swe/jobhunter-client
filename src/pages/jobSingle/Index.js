import React, { useEffect, useState, useCallback } from 'react'
import HtmlParser from 'react-html-parser'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { Images } from '../../utils/Images'
import { dateFormate, StringShort } from '../../utils/_helpers'
import Requests from '../../utils/Requests/Index'

import Apply from '../../components/modal/Apply'
import Header from '../../components/header/Index'
import Footer from '../../components/footer/Index'
import Preloader from '../../components/preloader/Index'

const Index = () => {
    const { id } = useParams()
    const [job, setJob] = useState(null)
    const [show, setShow] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Website.ShowJob(id)
            if (response) setJob(response.job)
            setLoading(false)
        } catch (error) {
            if (error) setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Handle apply
    const handleApply = async () => {
        try {
            const response = await Requests.Website.ApplyJob(id, header)
            if (response) {
                toast.success(response.message)
                setShow(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading) return <Preloader />
    return (
        <div>
            <Header />
            {job ?
                <main>
                    {/* Header */}
                    <div className="slider-area ">
                        <div className="single-slider section-overly slider-height2 d-flex align-items-center" style={{ backgroundImage: `url(${Images.SearchHeaderbg})` }}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="hero-cap text-center">
                                            <h2>{job.title}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job details */}
                    <div className="job-post-company pt-120 pb-120">
                        <div className="container">
                            <div className="row justify-content-between">
                                <div className="col-xl-7 col-lg-8">
                                    <div className="single-job-items mb-50">
                                        <div className="job-items">
                                            <div className="company-img company-img-details border rounded flex-center flex-column"
                                                style={{ width: 85, height: 85 }}
                                            >
                                                <h3 className="font-weight-bold mb-0">{StringShort(job.createdBy.name)}</h3>
                                            </div>
                                            <div className="job-tittle pl-4">
                                                <h4>{job.title}</h4>
                                                <ul>
                                                    <li>{job.createdBy.name}</li>
                                                    <li className="mx-3">{job.location}</li>
                                                    <li>Tk. {job.startSalary} - Tk. {job.endSalary}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="job-post-details">
                                        <div className="post-details1 mb-50">
                                            <div className="small-section-tittle">
                                                <h4>Job Description</h4>
                                            </div>
                                            <p>{HtmlParser(job.description)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-4 col-lg-4">
                                    <div className="post-details3  mb-50">

                                        <div className="small-section-tittle">
                                            <h4>Job Overview</h4>
                                        </div>
                                        <ul>
                                            <li>Posted date : <span>{dateFormate(job.createdAt)}</span></li>
                                            <li>Location : <span>{job.location}</span></li>
                                            <li>Vacancy : <span>{job.vacancy}</span></li>
                                            <li>Job nature : <span className="text-capitalize">{job.jobType}</span></li>
                                            <li>Salary : </li>
                                            <li><span className="text-capitalize pl-3">Tk. {job.startSalary} - Tk. {job.endSalary} {job.salaryType}</span></li>
                                            <li>Application date : <span>{dateFormate(job.expiredAt)}</span></li>
                                        </ul>
                                        <div className="apply-btn2">
                                            <button type="button" className="btn" onClick={() => setShow(true)}>Apply Now</button>
                                        </div>
                                    </div>
                                    <div className="post-details4  mb-50">

                                        <div className="small-section-tittle">
                                            <h4>Company Information</h4>
                                        </div>
                                        <span>{job.createdBy.name}</span>
                                        <p>{job.createdBy.description}</p>
                                        <ul>
                                            <li>Name: <span>{job.createdBy.name} </span></li>
                                            <li>Web : <span> {job.createdBy.website}</span></li>
                                            <li>Email: <span>{job.createdBy.email}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {show ?
                        <Apply
                            show={show}
                            onHide={() => setShow(false)}
                            submit={handleApply}
                        />
                        : null}

                </main>
                : null}
            <Footer />
        </div>
    )
}

export default Index;