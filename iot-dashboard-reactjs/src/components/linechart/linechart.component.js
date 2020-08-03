import React from 'react';
import {Line} from 'react-chartjs-2';
const LineChart = (ref, data) => (
    <div className="container-line-chart">
      <Line ref={ref} data={data}/>
    </div>
)
export default LineChart;