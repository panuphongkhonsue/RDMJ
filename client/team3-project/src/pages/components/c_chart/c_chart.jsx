/*
* c_chart.tsx
* Show Chart
* @input -
* @output show Chart
* @author Tassapol
* @Create Date 2567-02-19
*/
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 

const ChartComponent = ({ data, options, type }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, { type: 'bar', data, options });
    }


    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
