import React, { useState, useEffect } from 'react';
import SummaryCard from '../../pages/SummaryCard';
import axios from "axios";
import { 
  FaBuilding, 
  FaCheckCircle, 
  FaFileAlt, 
  FaHourglassHalf, 
  FaMoneyBillWave, 
  FaTimesCircle, 
  FaUsers 
} from 'react-icons/fa';

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard/summary", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSummary(response.data);
      } catch (error) {
        setError(error.response?.data?.error || error.message || "Failed to fetch dashboard data");
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!summary) {
    return <div className="p-6">No data available</div>;
  }

  // Format the salary to a more readable format
  const formattedSalary = summary.totalSalary ? 
    `$${summary.totalSalary.toLocaleString()}` : 
    '$0';

  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
        <SummaryCard 
          icon={<FaUsers />} 
          text="Total Employees" 
          number={summary.totalEmployees} 
          color="bg-teal-600" 
        />
        <SummaryCard 
          icon={<FaBuilding />} 
          text="Total Departments" 
          number={summary.totalDepartments} 
          color="bg-yellow-600" 
        />
        <SummaryCard 
          icon={<FaMoneyBillWave />} 
          text="Monthly Salary" 
          number={formattedSalary} 
          color="bg-red-600" 
        />
      </div>

      <div className='mt-12'>
        <h4 className='text-center text-2xl font-bold'>Leave Details</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <SummaryCard 
            icon={<FaFileAlt />} 
            text="Leave Applied" 
            number={summary.leaveSummary.appliedFor} 
            color="bg-teal-600" 
          />
          <SummaryCard 
            icon={<FaCheckCircle />} 
            text="Leave Approved" 
            number={summary.leaveSummary.approved} 
            color="bg-green-600" 
          />
          <SummaryCard 
            icon={<FaHourglassHalf />} 
            text="Leave Pending" 
            number={summary.leaveSummary.pending} 
            color="bg-yellow-600" 
          />
          <SummaryCard 
            icon={<FaTimesCircle />} 
            text="Leave Rejected" 
            number={summary.leaveSummary.rejected} 
            color="bg-red-600" 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;