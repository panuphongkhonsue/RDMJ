/*
* index.tsx
* Show Summary Report And Graph
* @input 
* @output show data Summary Report
* @author Tassapol,Panuphong
* @Create Date 2567-02-19
*/

import React from 'react';
import Menubar from '../components/c_menubar/c_menubar';
import ChartContainer from '../components/c_chart_container/c_chart_container';
import Selectcomponent from '@/pages/components/c_select/c_select';
import "/src/css/summary_report.css";
import Image from 'next/image'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from '../components/c_note/c_note'
import LoadingModal from '../components/c_loading/c_loading_modal';
import Table_group from '../components/c_table_group/c_table_group';
import Cookies from "js-cookie";
import Head from 'next/head'
type Props = {};
const currentMonth = new Date().getMonth() + 1;
const options_month = [
  { value: 1, label: 'January' },
  { value: 2, label: 'Febuary' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];
const currentYear = new Date().getFullYear();
const options_year = [
  { value: currentYear, label: currentYear.toString() },
  { value: currentYear - 1, label: (currentYear - 1).toString() },
  { value: currentYear - 2, label: (currentYear - 2).toString() },
  { value: currentYear - 3, label: (currentYear - 3).toString() },
  { value: currentYear - 4, label: (currentYear - 4).toString() },
];

export default function MyChartPage({ }: Props) {
  const [get_cost_p, setCostP] = useState<any>('');
  const [get_cost_p_actual, setCostPActual] = useState<any>('');
  const [get_compare, setCompare] = useState<any>('');
  // ตัวแปรค่าของตัวเลือกปี
  const [selected_year_value, setSelectedYearValue] = React.useState(currentYear);
  // ตัวแปรค่าของตัวเลือกเดือน
  const [selected_month_value, setSelectedMonthValue] = React.useState(currentMonth);
  // ตัวแปรเก็บข้อมูลแสดงตาราง
  const [table_summary_value, setTableSummaryValue] = React.useState<any>('');
  //ตัวแปรสำหรับเก็บคุกกี้
  const token = Cookies.get('user');
  // ตัวแปรสำหรับเก็บค่าแอนิเมชันโหลดถ้าเป็น true จะขึ้นหน้าโหลดแบบ Modal
  const [loading, setLoading] = useState(true);
  // ฟังก์ชันสำหรับรับค่า value จาก component Select พื้นฐานแล้วจะรับมาเป็นค่า string
  const getSelectedYearValue = (new_status: string) => {
    // เรียกฟังก์ชัน set_selected_value และเปลี่ยนค่าเป็น int 
    setSelectedYearValue(parseInt(new_status));
  };
  const getSelectedMonthValue = (new_status: string) => {
    setSelectedMonthValue(parseInt(new_status));
  };
  const pathurl = process.env.NEXT_PUBLIC_APP_URL;
  const chartWidths = {
    chart1: '100%',
    chart2: '100%',
    chart3: '90%',
  }

  const [chart_data_1, setChartData1] = useState({
    labels: ['PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8'],
    datasets: [
      {
        label: 'BM',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'PM',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
    options: {
      plugins: {
        title: {
          display: true,
          text: 'BM And PM Plan By PD Dept.'
        },
      },
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'PD Dept.',
          },
        },
        y: {
          title: {
            display: true,
            text: 'จำนวน',
          },
          beginAtZero: true,
          stacked: true,
        },
      },
    },
  });


  const [chart_data_2, setChartData2] = useState({
    labels: ['PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8'],
    datasets: [
      {
        label: 'Cost Plan',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        xAxisID: 'x-axis-1',
      },
      {
        label: 'Cost Actual',
        data: [],
        borderColor: 'rgba(93,180,239,255)',
        borderWidth: 2,
        xAxisID: 'x-axis-1',
      },
    ],
    options: {
      plugins: {
        title: {
          display: true,
          text: 'BM And PM Plan By PD Dept.',
        },
      },
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'จำนวน',
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: 'PD Dept.',
          },
        },
      },
    },
  });

  const [chart_data_3, setChartData3] = useState({
    labels: ['BM', 'PM'],
    type: 'bar',
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Bar Chart - Stacked',
        },
      },
      responsive: true,
      interaction: {
        intersect: false,
      },
    },
  });


  const chartOptions1 = {
    scales: {
      x: {
        stacked: true,
      },
      y: {

      },
    },
  };

  const chartOptions2 = {
    scales: {
      y: {
        beginAtZero: true,
      },
      'y-axis-1': {
        position: 'none',

      },
    },
  };

  const chartOptions3 = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      }
    }
  };

  const fetchDataPdDept = async () => {
    let configpddept = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/summary-report/get-cost-pd-dept?select_year=${Number(selected_year_value)}&select_month=${Number(selected_month_value)}`,
      headers: {'Cookie': `user=${token}`},
      withCredentials: true,
    };

    const response_pd_dept = await axios.request(configpddept)
    setChartData1((prevChartData1: any) => {
      return {
        ...prevChartData1,
        datasets: [
          {
            label: 'BM Plan',
            data: [response_pd_dept.data.plan.planbm[0],
            response_pd_dept.data.plan.planbm[1],
            response_pd_dept.data.plan.planbm[2],
            response_pd_dept.data.plan.planbm[3],
            response_pd_dept.data.plan.planbm[4],
            response_pd_dept.data.plan.planbm[5],
            response_pd_dept.data.plan.planbm[6],
            response_pd_dept.data.plan.planbm[7]], // ข้อมูลแต่ละตัว
            backgroundColor: 'rgba(255,99,132,255)',
            stack: 'Stack 0',
          },
          {
            label: 'BM Actual',
            data: [response_pd_dept.data.costbm[0],
            response_pd_dept.data.costbm[1],
            response_pd_dept.data.costbm[2],
            response_pd_dept.data.costbm[3],
            response_pd_dept.data.costbm[4],
            response_pd_dept.data.costbm[5],
            response_pd_dept.data.costbm[6],
            response_pd_dept.data.costbm[7]],
            backgroundColor: 'rgba(75,192,192,255)',
            stack: 'Stack 0',
          },
          {
            label: 'PM Plan',
            data: [response_pd_dept.data.plan.planpm[0],
            response_pd_dept.data.plan.planpm[1],
            response_pd_dept.data.plan.planpm[2],
            response_pd_dept.data.plan.planpm[3],
            response_pd_dept.data.plan.planpm[4],
            response_pd_dept.data.plan.planpm[5],
            response_pd_dept.data.plan.planpm[6],
            response_pd_dept.data.plan.planpm[7]], // ข้อมูลแต่ละตัว
            backgroundColor: 'rgba(54,162,235,255)',
            stack: 'Stack 1',
          },
          {
            label: 'PM Actual',
            data: [response_pd_dept.data.costpm[0],
            response_pd_dept.data.costpm[1],
            response_pd_dept.data.costpm[2],
            response_pd_dept.data.costpm[3],
            response_pd_dept.data.costpm[4],
            response_pd_dept.data.costpm[5],
            response_pd_dept.data.costpm[6],
            response_pd_dept.data.costpm[7]],
            backgroundColor: 'rgba(255,205,86,255)',
            stack: 'Stack 1',
          },
        ]
      };
    });

  }

  const fetchDataAllByPdDept = async () => {
    let configallpddept = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/summary-report/get-all-data-by-pddept?select_year=${Number(selected_year_value)}&select_month=${Number(selected_month_value)}`,
      headers: {'Cookie': `user=${token}`},
      withCredentials: true,
    };

    const response_all_pd_dept = await axios.request(configallpddept)

    setChartData2((prevChartData2: any) => {
      return {
        ...prevChartData2,
        datasets: [
          {
            ...prevChartData2.datasets[0],
            data: [response_all_pd_dept.data.cost_plan_all_by_pddept[0],
            response_all_pd_dept.data.cost_plan_all_by_pddept[1],
            response_all_pd_dept.data.cost_plan_all_by_pddept[2],
            response_all_pd_dept.data.cost_plan_all_by_pddept[3],
            response_all_pd_dept.data.cost_plan_all_by_pddept[4],
            response_all_pd_dept.data.cost_plan_all_by_pddept[5],
            response_all_pd_dept.data.cost_plan_all_by_pddept[6],
            response_all_pd_dept.data.cost_plan_all_by_pddept[7]],
            backgroundColor: 'rgba(255,177,193,255)',
          },
          {
            ...prevChartData2.datasets[1],
            data: [response_all_pd_dept.data.cost_actual_all_by_pddept[0],
            response_all_pd_dept.data.cost_actual_all_by_pddept[1],
            response_all_pd_dept.data.cost_actual_all_by_pddept[2],
            response_all_pd_dept.data.cost_actual_all_by_pddept[3],
            response_all_pd_dept.data.cost_actual_all_by_pddept[4],
            response_all_pd_dept.data.cost_actual_all_by_pddept[5],
            response_all_pd_dept.data.cost_actual_all_by_pddept[6],
            response_all_pd_dept.data.cost_actual_all_by_pddept[7]],
            backgroundColor: 'rgba(154,208,245,255)',
          },
        ],
      };
    });
  }

  const fetchAllData = async () => {

    try {
      const configbmandpm = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${pathurl}/api/summary-report/get-mc-cost-bm-and-pm?select_year=${Number(selected_year_value)}&select_month=${Number(selected_month_value)}`,
        headers: {'Cookie': `user=${token}`},
        withCredentials: true,
      };


      const response = await axios.request(configbmandpm);
      // Log the response data


      setCostP(response.data.getcostplan[0]);
      setCostPActual(response.data.getcostactual[0]);
      setCompare(response.data.compare[0]);


    } catch (error) {
      // Handle errors
      console.error(error);
    }


  }
   //ดึงข้อมูลจาก API แสดงในตาราง
   const fetchDataTable = async () => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${pathurl}/api/summary-report/table-cost-plan?select_year=${Number(selected_year_value)}&select_month=${Number(selected_month_value)}`,
        headers: { 'Content-Type': 'application/json','Cookie': `user=${token}`},
        withCredentials: true,
      };

      const response = await axios.request(config);
      setTableSummaryValue(response.data.getcostplantotal);
      setLoading(false);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  }
  // กราฟ 3
  const fetchDataTotal = async () => {

    const configtotal = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/summary-report/get-total-plan-and-actual?select_year=${Number(selected_year_value)}&select_month=${Number(selected_month_value)}`,
      headers: {'Cookie': `user=${token}`},
      withCredentials: true,
    };

    const response = await axios.request(configtotal);
    // การเซ็ทค่าข้อมูลกราฟที่ 3
    setChartData3((prevChartData3: any) => {
      return {
        ...prevChartData3,
        datasets: [
          {
            label: 'BM Actual',
            data: [response.data.getcostactualtotal[0].MCBMCOST], // BM Actual
            backgroundColor: 'rgba(75,192,192,255)'
          },
          {
            label: 'PM Actual',
            data: [response.data.getcostactualtotal[0].MCPMCOST],  // PM Actual
            backgroundColor: 'rgba(255,205,86,255)'
          },
        ],
      };
    });
  };

  // ทำการเรียกใช้ฟังก์ชันดึงข้อมูลจาก Database
  useEffect(() => {
    const fetchData = async () => {
      await fetchAllData();
      await fetchDataPdDept();
      await fetchDataAllByPdDept();
      await fetchDataTotal();
      await fetchDataTable();
      setLoading(false);
    };
    if (loading) {
      fetchData();
    }
    else {
      const intervalId = setInterval(() => {
        fetchData();
      }, 300000); // Fetch data every 5 minute
      return () => {
        clearInterval(intervalId); // Cleanup the interval on component unmount
      };
    }
  }, [get_cost_p, get_cost_p_actual, get_compare]);
  useEffect(() => {
    if (!loading) {
      const fetchData = async () => {
        await fetchAllData();
        await fetchDataPdDept();
        await fetchDataAllByPdDept();
        await fetchDataTotal();
        await fetchDataTable();
        setLoading(false);
      };
      if (selected_month_value !== 0 || selected_year_value !== 0) {
        fetchData();
      }
    }
  }, [selected_year_value, selected_month_value]);
  // get_cost_p

  return (
    <main>
        <Head>
            <link rel="icon" href="/icon_denso.svg" />
            <title>RDMJ</title>
        </Head>
      <Menubar />
      {loading ? (
        <LoadingModal open={loading} />
      ) : (
        <div className="background">
          {/* หัวข้อหลัก */}
          <div className='text_header ms-4 pt-5'>
            ACCUMULATED DATE
          </div>
          {/* ส่วนเนื้อหา */}
          <div className="row mt-4 ms-3">
            {/* select กรองตัวค้นหา */}
            <div className="row select pt-3 pb-3">
              {/* เรียกใช้ component Select โดยจะต้องใส่ parameter get_val สำหรับเรียกใช้ฟงัก์ชันที่สร้างเอาไว้ข้างบน 
                            width ไว้สำหรับปรับความกว้าง size_select สำหรับเลือกขนาด มี 'small' , 'medium' , large text คือ label บอกว่า select
                            ตัวนี้คืออะไร option คือ ค่าใน select มีอะไรบ้าง pad คือค่า padding และ font size สำหรับปรับขนาดตัวหนังสือ */}
              <div className='position_select col d-flex flex-row gap-2 flex-wrap'>
                <Selectcomponent get_val={getSelectedYearValue} width={210} size_select={"small"} text={"Year"} pad={'5px 0px 8px 15px'} font_size={16} options={options_year} />
                <Selectcomponent get_val={getSelectedMonthValue} width={188} size_select={"small"} text={"Month"} pad={'5px 0px 8px 15px'} font_size={16} options={options_month} />
              </div>
              <div className="col d-flex flex-row-reverse">
                <Note />
              </div>
            </div>
          </div>
          {/* ส่วนเนื้อหากราฟกับข้อมูลทั้งหมด */}
          <div className="row border_overall ms-3">
            {/* ส่วนรูปภาพกราฟ */}
            <div className="col-sm-2 mt-3 mb-3 picture_graph">
              <Image src='/icon_graph.svg' className="logo_graph ms-4 mt-3" width={150} height={100} alt="icon_graph" priority />
            </div>
            <div className="col-3 mt-2 amcuborder">
              {/* ส่วนแสดงค่าข้อมูล M/C Cost ทั้งหมด กับเป้าหมาย และ ค่าที่ได้ล่าสุด */}
              <div className="cirandtext">
                <div className={`circle circle-accum ${get_compare[0] ? 'bg-danger' : 'bg-success'}`} style={{ transition: 'all 0.3s ease' }}></div>
                <div className="amcu">Accumulated M/C Cost</div>
              </div>
              <div className="targetamcu ms-4">Target {'≤'} {get_cost_p.TotalMCCost}</div>
              <div className={`amcu-case me-5 ${get_compare[0] ? 'text-danger' : ''}`}>
                {get_cost_p_actual.MCALL}
              </div>
            </div>
            {/* เนื้อหาส่วน BM และ PM */}
            <div className="col-sm-7">
              {/* กรอบสองกรอบของ BM และ PM */}
              <div className="row row-cols-auto twobox">
                {/* กรอบ BM */}
                <div className="col-6 col-sm-5 border_accumulated mt-3 mb-3">
                  {/* ส่วนแสดงค่าข้อมูล M/C BM Cost กับเป้าหมาย และ ค่าที่ได้ล่าสุด */}
                  <div className="cirandtext">
                  <div className={`circle circle-accum ${get_compare[0] ? 'bg-danger' : 'bg-success'}`} style={{ transition: 'all 0.3s ease' }}></div>
                    <div className="amcubm">M/C BM Cost</div>
                  </div>
                  {/* การเรียกข้อมูลจาก Array ที่เก็บไว้ในตัวแปรจากหลังบ้าน */}
                  <div className="targetbm ms-4">Target {'≤'} {get_cost_p.CostBM}</div>
                  <div className={`amcu-case-bm me-6 ${get_compare[1] ? 'text-danger' : ''}`}>
                    {get_cost_p_actual.MCBMCOST}
                  </div>
                </div>
                {/* เว้นที่ว่างระหว่างกรอบ BM กับ PM */}
                <div className="col blank">
                </div>
                {/* กรอบ BM */}
                <div className="col-6 col-sm-5 border_bm_cost mt-3 mb-3">
                  {/* ส่วนแสดงค่าข้อมูล M/C PM Cost กับเป้าหมาย และ ค่าที่ได้ล่าสุด */}
                  <div className="cirandtext">
                  <div className={`circle circle-accum ${get_compare[0] ? 'bg-danger' : 'bg-success'}`} style={{ transition: 'all 0.3s ease' }}></div>
                    <div className="amcupm">M/C PM Cost</div>
                  </div>
                  {/* การเรียกข้อมูลจาก Array ที่เก็บไว้ในตัวแปรจากหลังบ้าน */}
                  <div className="targetpm ms-4">Target {'≤'} {get_cost_p.CostPM}</div>
                  <div className={`amcu-case-pm me-6 ${get_compare[2] ? 'text-danger' : ''}`}>
                    {get_cost_p_actual.MCPMCOST}</div>
                </div>

              </div>
            </div>
          </div>
          {/* ส่วนเนื้อหากราฟ */}
          <div className="cost_graph row ms-3">
            {/* ส่วนเนื้อหากราฟส่วนที่ 1 */}
            <div className="col-5 cost_section g-3 d-flex justify-content-center ">
              <div className="amcu ms-4 justify-content-center">Cost Plan and Actual by PD.Dept</div>
              <ChartContainer
                chartData={chart_data_2}
                chartOptions={{ ...chartOptions2, indexAxis: 'y' }} // เพิ่ม indexAxis: 'y' เพื่อแสดงแนวนอน
                chartTitle="Chart 2"
                chartType="bar"
                width={chartWidths.chart2}
              />
            </div>
            <div className="col-1 center-box"></div>
            {/* ส่วนเนื้อหากราฟส่วนที่ 2 */}
            <div className="col-6 cost_plan_actual g-3 d-flex justify-content-center ">
              <div className="amcu ms-4 justify-content-center">BM and PM by PD.Dept</div>
              <ChartContainer
                chartData={chart_data_1}
                chartOptions={{ ...chartOptions1, indexAxis: 'x' }}
                chartTitle="Chart 1"
                chartType="bar"
                width={chartWidths.chart1}
              />
            </div>
          </div>
          {/* ส่วนเนื้อหากราฟ และตาราง */}
          <div className="row mt-3">
            <div className="col-8 table_section">
              <Table_group data={table_summary_value} />
            </div>
            {/* ส่วนเนื้อหากราฟส่วนที่ 2 */}
            <div className="col-4 border_total_mc_cost g-3 d-flex justify-content-center">
              <div className="amcu ms-4 justify-content-center">Actual Cost by Category</div>
              <ChartContainer chartData={chart_data_3} chartOptions={chartOptions3} chartTitle="Chart 3" chartType="bar" width={chartWidths.chart3} />
            </div>
          </div>

        </div>
      )}
    </main>
  );
};

