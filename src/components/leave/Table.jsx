import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { columns, LeaveButtons } from '../../utils/LeaveHelper'; // Ensure LeaveButtons is exported here
import axios from 'axios';

const Table = () => {
  const [leaves, setLeaves] = useState([]); // Initialize with an empty array to avoid null reference errors
  const [loading, setLoading] = useState(true); // Track loading state
  const [filteredLeaves, setFilteredLeaves] = useState([]); // Filtered leaves state

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leave', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days:
            Math.ceil(
              (new Date(leave.endDate) - new Date(leave.startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1, // Correct day calculation
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));
        setLeaves(data);
        setFilteredLeaves(data);
        setLoading(false); // Stop loading after data fetch
      }
    } catch (error) {
      console.error(error.message);
      alert('Failed to fetch leaves');
      setLoading(false); // Stop loading in case of error
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []); // Empty dependency ensures it runs once on mount

  const filterByInput = (e) => {
    const value = e.target.value.toLowerCase();
    const data = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(value)
    );
    setFilteredLeaves(data);
  };

  return (
    <>
      {loading ? (
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold">Loading...</h3>
        </div>
      ) : (
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold">Manage Leaves</h3>
          </div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search By Emp ID"
              className="px-4 py-1 border rounded"
              onChange={filterByInput}
            />
            <div className="space-x-3">
              <button
                className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
                onClick={() =>
                  setFilteredLeaves(leaves.filter((leave) => leave.status === 'Pending'))
                }
              >
                Pending
              </button>
              <button
                className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
                onClick={() =>
                  setFilteredLeaves(leaves.filter((leave) => leave.status === 'Approved'))
                }
              >
                Approved
              </button>
              <button
                className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
                onClick={() =>
                  setFilteredLeaves(leaves.filter((leave) => leave.status === 'Rejected'))
                }
              >
                Rejected
              </button>
            </div>
          </div>
          <div className="mt-3">
            <DataTable columns={columns} data={filteredLeaves} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
