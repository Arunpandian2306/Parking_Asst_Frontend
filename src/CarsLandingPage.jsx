import React, { useState, useEffect } from 'react';
import axios from 'axios';
import carsImage from './assets/cars.png';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('carname');
  const [sortOrder, setSortOrder] = useState('asc');
  const limit = 6;

  const fetchCars = async (page, field = 'carname', order = 'asc') => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:3000/carDetails/get-all/cars?page=${page}&limit=${limit}&sortField=${field}&sortOrder=${order}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { cars, pagination } = response.data.result;
      setCars(cars);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    fetchCars(currentPage, sortField, sortOrder);
  }, [currentPage, sortField, sortOrder]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
    setCurrentPage(1); // Reset to first page when changing sort field
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1); // Reset to first page when changing sort order
  };

  return (
    <div className="car-list">
      <h2>Available Cars</h2>
      <div className="sort-controls">
        <div>
          <label htmlFor="sortField">Sort By:</label>
          <select id="sortField" value={sortField} onChange={handleSortFieldChange} className="sort-dropdown">
            <option value="carname">Name</option>
            <option value="number">Number</option>
            <option value="color">Color</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder">Order:</label>
          <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange} className="sort-dropdown">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="car-grid">
        {cars.map((car) => (
          <div key={car._id} className="car-item">
            <img src={carsImage} alt="Car" className="car-image" />
            <p><strong>Car Name:</strong> {car.carname}</p>
            <p><strong>Number:</strong> {car.number}</p>
            <p><strong>Color:</strong> {car.color}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarList;
