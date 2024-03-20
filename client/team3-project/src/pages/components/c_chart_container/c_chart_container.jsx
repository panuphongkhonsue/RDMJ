/*
* c_chart_container.tsx
* Show Chart Container
* @input -
* @output show Chart Container
* @author Tassapol
* @Create Date 2567-02-19
*/
import React, { useState } from 'react';
import ChartComponent from '../../components/c_chart/c_chart';


const ChartContainer = ({ chartData, chartOptions, chartTitle, chartType, width }) => {
  const [localChartType, setLocalChartType] = useState(chartType);

  const handleChartTypeChange = (newType) => {  
    setLocalChartType(newType);
  };

  return (
    <div className="chart-container" style={{ width }}>
      <ChartComponent data={chartData} options={chartOptions} type={localChartType} />
    </div>
  );
};

export default ChartContainer;