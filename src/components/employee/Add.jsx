import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { fetchDepartments } from '../../utils/EmployeeHelper'
import axios from 'axios'

const Add = () => {
    const [departments, setDepartments] = useState([])
    const [formData, setFormData] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments)
        }
        getDepartments(departments)
    }, [])

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }))
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formDataObj = new FormData()
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key])
        })

        try {
            const response = await axios.post('https://employee-api1.vercel.app/api/employee/add', formDataObj, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            if (response.data.success) {
                navigate("/admin-dashboard/employees")
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }

    return (
        <div className='max-w-4x1 mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
            <h2 className='text-2x1 font-bold mb-6'>Add New Employee</h2>
            <form onSubmit={handleSubmit}>
                {/* ... (rest of your form JSX remains exactly the same) ... */}
            </form>
        </div>
    )
}

export default Add