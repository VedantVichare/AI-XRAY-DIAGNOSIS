import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';
import axios from 'axios';
import './visualization.css';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, toZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Visualization = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [patientData, setPatientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ fullName: '', age: '', startDate: '', endDate: '' });
  const [filterApplied, setFilterApplied] = useState(false);
  const today1 = new Date();
  const timeZone = 'Asia/Kolkata'; // Replace with your local time zone if needed
  const todayInTimezone = format(today1, 'yyyy-MM-dd', { timeZone });
  const today = todayInTimezone; // This is now correctly adjusted for time zones


  // Handle input changes for filter fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Check if both start and end date are filled
  const isFilterActive = filter.startDate && filter.endDate;

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchPatientData = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/infos/${user.email}`);
          setPatientData(response.data);
          setFilteredData(response.data); // Initially show all data
        } catch (error) {
          console.error('Error fetching patient data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPatientData();
    }
  }, [isAuthenticated, user]);

  // Handle filter submit event
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const { fullName, age, startDate, endDate } = filter;
  
    // Parse dates
    const start = startDate ? new Date(startDate) : null;
    let end = endDate ? new Date(endDate) : null;
  
    // If an end date is provided, set it to the end of the day
    if (end) {
      end.setHours(23, 59, 59, 999); // Set time to end of day
    }
  
    // Filter by name and age if provided
    const filteredByNameAndAge = patientData.filter((patient) => {
      const fullNameMatch = `${patient.name} ${patient.surname}`.toLowerCase().includes(fullName.toLowerCase());
      const ageMatch = age ? patient.age === parseInt(age) : true;
      return fullNameMatch && ageMatch;
    });
  
    // Then filter by date range
    const filteredByDate = filteredByNameAndAge.filter((patient) => {
      const patientDate = new Date(patient.date);
      // Check if the patient date is within the selected range (inclusive)
      const dateMatch = (!start || patientDate >= start) && (!end || patientDate <= end);
      return dateMatch;
    });
  
    if (filteredByDate.length > 0) {
      setFilteredData(filteredByDate);
      setFilterApplied(true);
    } else {
      // If no data found for the given filter, show data from the start and end dates as a fallback
      const fallbackData = patientData.filter((patient) => {
        const patientDate = new Date(patient.date);
        // Return data that is between the start and end date range
        return (!start || patientDate >= start) && (!end || patientDate <= end);
      });
      setFilteredData(fallbackData);
      setFilterApplied(true);
      alert('No exact data found for the given search criteria, but showing data in the date range.');
    }
  };
  
  const resetFilter = () => {
    setFilteredData(patientData); // Show all data again
    setFilter({ fullName: '', age: '', startDate: '', endDate: '' }); // Clear inputs
    setFilterApplied(false);
  };

  const sortDataByDateAscending = (data) => {
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatPatientDate = (dateString) => {
    const timeZone = 'Asia/Kolkata'; // Update to India Standard Time (IST)
    return format(toZonedTime(parseISO(dateString), timeZone), 'dd/MM/yyyy');
  };
  
  const getDataForGraphs = (dataToUse) => {
    const sortedData = sortDataByDateAscending(dataToUse);
    const labels = sortedData.map((patient) => {
      const dateStr = formatPatientDate(patient.date);
      return `${patient.name} ${patient.surname} (${dateStr})`;
    });

    const pneumoniaPercentages = sortedData.map((patient) => patient.pneumonia_percentage);
    const normalPercentages = sortedData.map((patient) => patient.normal_percentage);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Pneumonia Percentage',
          data: pneumoniaPercentages,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
        },
        {
          label: 'Normal Percentage',
          data: normalPercentages,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          
        },
      ],
    };
  };

  const getPieData = (dataToUse) => {
    const sortedData = sortDataByDateAscending(dataToUse);
    return {
      labels: ['Pneumonia', 'Normal'],
      datasets: [
        {
          data: [
            sortedData.filter((patient) => patient.prediction === 'Pneumonia').length,
            sortedData.filter((patient) => patient.prediction === 'Normal').length,
          ],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
          hoverOffset: 4,
        },
      ],
    };
  };

  const getLineData = (dataToUse) => {
    const sortedData = sortDataByDateAscending(dataToUse);
    const pneumoniaCountByDate = {};
    const normalCountByDate = {};

    sortedData.forEach((patient) => {
      const dateStr = formatPatientDate(patient.date);
      pneumoniaCountByDate[dateStr] = (pneumoniaCountByDate[dateStr] || 0) + (patient.prediction === 'Pneumonia' ? 1 : 0);
      normalCountByDate[dateStr] = (normalCountByDate[dateStr] || 0) + (patient.prediction === 'Normal' ? 1 : 0);
    });

    return {
      labels: Object.keys(pneumoniaCountByDate),
      datasets: [
        {
          label: 'Pneumonia Cases',
          data: Object.values(pneumoniaCountByDate),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.4)',
          fill: true,
        },
        {
          label: 'Normal Cases',
          data: Object.values(normalCountByDate),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.4)',
          fill: true,
        },
      ],
    };
  };

  const getScatterData = (dataToUse) => {
    const sortedData = sortDataByDateAscending(dataToUse);
    return {
      datasets: [
        {
          label: 'Pneumonia Percentage by Age',
          data: sortedData.map((patient) => ({
            x: patient.age,
            y: patient.pneumonia_percentage,
            label: patient.name,
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          pointRadius: 6,
          pointHoverRadius: 10,
        },
      ],
    };
  };

  return (
    <div className="visualization-container">
      {loading ? (
        <p>Loading patient data...</p>
      ) : (
        <div>
          <h2 className="visualization-title">Patient Data Visualization</h2>
          
          {/* Filter Form */}
          <form onSubmit={handleFilterSubmit} className="filter-form">
            <input
              type="text"
              name="fullName"
              placeholder="Name Surname"
              value={filter.fullName}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={filter.age}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="startDate"
              placeholder="Start Date"
              value={filter.startDate}
              onChange={handleInputChange}
              required
              max={today}
            />
            <input
              type="date"
              name="endDate"
              placeholder="End Date"
              value={filter.endDate}
              onChange={handleInputChange}
              required
              max={today}
            />
            <button type="submit" className={`filter-btn ${!isFilterActive ? 'disabled' : ''}`} disabled={!isFilterActive}>
              Filter
            </button>
            <button type="button" className="reset-btn" onClick={resetFilter}>
              Reset
            </button>
          </form>

          {/* Graphs */}
          <div className="charts-container">
        <div className="chart">
               <h3>Pneumonia and Normal Percentage</h3>
            <Bar data={getDataForGraphs(filteredData)} options={{ responsive: true }} />
           </div>

           <div className="chart">
             <h3>Patient Prediction Distribution:</h3>
             <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
                <Pie data={getPieData(filterApplied ? filteredData : patientData)} />
              </div>
            </div>

            <div className="chart">
             <h3>Cases Over Time</h3>
               <Line data={getLineData(filteredData)} options={{ responsive: true }} />
            </div>

            <div className="chart">
              <h3>Pneumonia Percentage by Age</h3>
              <Scatter data={getScatterData(filteredData)} options={{ responsive: true }} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualization;
