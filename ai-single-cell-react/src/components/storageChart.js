import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { getCookie } from '../utils/utilFunctions';

let jwtToken = getCookie('jwtToken');
const SERVER_URL = "http://" + process.env.REACT_APP_HOST_URL + ":3001";


const StorageChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [usedStorage, setUsedStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(1);
  const percentUsed = Math.round((usedStorage / totalStorage) * 100);

  const getStorageDetails = async () => {

    jwtToken = getCookie('jwtToken');

    fetch(`${SERVER_URL}/getStorageDetails?authToken=${jwtToken}`)
      .then(response => {
        if (response.status === 403) {
          throw new Error('Please log in first');
        }
        return response.json();
      })
      .catch(error => {
        if (error.message === 'Please log in first') {
          window.alert('Please log in first');
        } else {
          console.error(error);
        }

      })
      .then(data => {
        setUsedStorage(data.used);
        setTotalStorage(data.allowed);
      });

  }


  useEffect(() => {
    getStorageDetails();
    const chartCtx = chartRef.current?.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Used Space', 'Free Space'],
        datasets: [{
          label: 'Size (GB)',
          data: [usedStorage, totalStorage - usedStorage],
          backgroundColor: ['#287ccc', '#ddf1f4']
        }]
      },
      options: {
        rotation: -0.0000001,
        maintainAspectRatio: false,
        height: "350px",
        width: "350px"
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [totalStorage, usedStorage]);

  if (jwtToken != undefined && jwtToken != '') {
    return (
      <>
        <h2>My Data</h2> <br />
        {`${percentUsed}% of ${totalStorage} GB used up.`}
        <div width="350px" height="350px">
          <canvas ref={chartRef} />
        </div>
      </>
    );
  }
}

export default StorageChart;
