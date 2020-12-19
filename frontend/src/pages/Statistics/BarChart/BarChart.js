import React from 'react';
import { Bar } from 'react-chartjs-2';
const BarChart = (props) => {
    const labels = Object.keys(props.data)
    const data = Object.values(props.data)

    let chartDataArr = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    '#ecd1a8',
                    '#b5ead6',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    '#ecd1a8',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    '#b5ead6',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    '#b5ead6',
                    '#ecd1a8',
                    '#b5ead6',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    '#b5ead6',
                    '#ecd1a8',
                ],
            },
        ],
    };
    return (
        <div>
            <Bar
                data={chartDataArr}
                options={{
                    legend: {
                        display: false,
                        position: 'top',
                        align: 'end',
                    },
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    callback: function (value) {
                                        return value.substr(0, 20); //truncate
                                    },
                                },
                            },
                        ],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                    },
                }}></Bar>
        </div>
    );
};

export default BarChart;
