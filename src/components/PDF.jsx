import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PDF.css'

import logo from '../assets/logo.png'
import Location from '../assets/location.svg'

import { LineChart } from '@mui/x-charts/LineChart';

import generatePDF from 'react-to-pdf';
import { useRef } from 'react';

import moment from 'moment';

function PDFRENDER() {
    const targetRef = useRef();

    const printPDF = () => {
        generatePDF(targetRef, { filename: 'report.pdf' });
    };

    // first lets get the data from the api

    const CrimeGraph = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);



        useEffect(() => {
            // Fetch data from the API when the component mounts
            axios
                .get('https://api.usa.gov/crime/fbi/cde/arrest/state/AK/all?from=2015&to=2020&API_KEY=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv')
                .then(res => {
                    setData(res.data.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                    setLoading(false);
                });
        }, []);

        if (loading) {
            return <div>Loading...</div>;
        }

        // Calculate percentage increase in arrests for burglary by each year
        const percentageData = data.map((item, index, array) => {
            // first we total the number of arrests for Burglary for all years
            const total = array.reduce((acc, curr) => {
                return acc + curr.Burglary;
            }
                , 0);

            // then we calculate the percentage of arrests for each year
            const percentage = (item.Burglary / total) * 100;
            return percentage.toFixed(2);
        });

        const chartData = data.map(item => {
            return {
                data_year: item.data_year.toString(), // Convert year to string for display
                Burglary: item.Burglary,
            };
        });

        return (
            <div>
                <LineChart
                    xAxis={[
                        {
                            dataKey: 'data_year',
                            valueFormatter: (v) => v.toString(),
                            min: data[0].data_year.toString(),
                            max: data[data.length - 1].data_year.toString(),
                            tickNumber: data.length + 1
                        }]}
                    series={[{ data: data.map(item => item.Burglary), color: '#1464FF', showMark: true }]}
                    height={500}
                    dataset={chartData}
                />{/* 
        <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} xAxis={[
            {
              dataKey: 'data_year',
              valueFormatter: (v) => v.toString(),
              min: '2015',
              max: '2020',
              tickNumber: 6
            }]} 
            dataset={chartData}
            series={[{ data: percentageData, color: '#1464FF', showMark: false }]} height={500} /> */}
            </div>
        );
    };


    // now we can use the data to create an HTML page that we can convert to a PDF
    return (
        <div className="fullScreen">
            <div className="header-container">
                <div className="header">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="companyAddress">
                        123 Main Street, Dover, NH 03820-4667
                    </div>
                </div>
                <div className="divider"></div>
            </div>
            <div className="graphContainer">
                <div className="graphTitle">
                    <div className="graphIcon">
                        <img src={Location} alt="" width="20" />
                    </div>
                    <h4>Crime</h4>
                    <div className="divider" ></div>
                </div>


                <div className="graph-wrapper">
                    <div className="graph-header">
                        Burglary
                    </div>
                    <div className="graph">
                        <div className="graphItem">
                            <CrimeGraph />
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-container">
                <div className="divider"></div>
                <div className="footer">
                    <h3 className="Date">Report Generated On {
                        moment().format('MMMM DD, YYYY')
                    }</h3>
                    <div className="pages">
                        <h3>Page 1 of 1</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PDFRENDER;