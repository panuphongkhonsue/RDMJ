/*
* v_layout.tsx
* Display Layout
* @input -
* @output Layout data
* @author Panuphong,Nattapak,Tassapol
* @Create Date 2567-03-04
*/
import React, { useEffect, useState } from 'react';
import Menubar from '../components/c_menubar/c_menubar';
import axios from 'axios';
import "/src/css/layout.css";
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.css';
import { Column } from '@/pages/type/table_type';
import Table_layout from '../components/c_table_layout/c_table_layout';
import LoadingModal from '../components/c_loading/c_loading_modal';
import Manpower from '../components/c_manpower/c_manpower';
import HoverMaintenance from '../components/c_hover_layout/c_hover_layout';
import Cookies from "js-cookie";

type Props = {};

const columns: Column[] = [
  { id: 'maincategory', label: 'Maintenance Categories', minWidth: 150, align: 'left' },
  { id: 'request', label: 'Request', minWidth: 5, align: 'left' },
  { id: 'process', label: 'Processing', minWidth: 5, align: 'left', format: (value: number) => value.toLocaleString('en-US') },
  { id: 'finish', label: 'Finished', minWidth: 5, align: 'left', format: (value: number) => value.toLocaleString('en-US') },
];

export default function Layout({ }: Props) {
  const [current_time, setCurrentTime] = useState<any>('');
  const [current_day, setCurrentDay] = useState<any>('');
  const [monthly_case, setMonthlyCase] = useState<any>('');
  const [data_manpower, setDataManpower] = useState<any>('');
  const [daily_case, setDailyCase] = useState<any>('');
  const [row, setRow] = useState<any>('');
  const pathurl: string = process.env.NEXT_PUBLIC_APP_URL!;
  const [loading, setLoading] = useState(true);
  const [selected_status_manpower, setSelectedStatusManpower] = React.useState(0);
  const [count_manpower, setCountManpower] = useState<any>('');
  const [count_available, setCountAvailable] = useState<any>('');
  const [count_processing, setCountProcessing] = useState<any>('');
  const [data_map, setDataMap] = useState<any>('');
  const [mttr_mtbf, setMttrMtbf] = useState<any>('');
  const [loading_manpower, setLoadingManpower] = useState(true);
  const token = Cookies.get('user');
  const formatTime = (time: any) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(time).toString();
  };

  const formatTimeMonth = (time: any) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(time).toString();
  };

  const fetchDataDailyCase = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/show-data/daily-case`,
      headers: {
        'Content-Type': 'application/json',
        // Include the JWT token as a cookie in the request headers
        'Cookie': `user=${token}`,
      }, withCredentials: true
    }
    axios.request(config)
      .then((response) => {
        const rows = [
          { maincategory: 'Breakdown Maintenance (BM)', request: response.data.count_request[0].BM, process: response.data.count_processing[0].BM, finish: response.data.count_finished[0].BM },
          { maincategory: 'Preventive Maintenance (PM)', request: response.data.count_request[0].PM, process: response.data.count_processing[0].PM, finish: response.data.count_finished[0].PM },
          { maincategory: 'Corrective Maintenance (CM)', request: response.data.count_request[0].CM, process: response.data.count_processing[0].CM, finish: response.data.count_finished[0].CM },
          { maincategory: 'Predictive Maintenance (PD)', request: response.data.count_request[0].PD, process: response.data.count_processing[0].PD, finish: response.data.count_finished[0].PD },
        ];
        setRow(rows);
        setDailyCase(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDataMonthlyCase = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/show-data/layout`,
      headers: {
        'Content-Type': 'application/json',
        // Include the JWT token as a cookie in the request headers
        'Cookie': `user=${token}`,
      }, withCredentials: true
    }
    axios.request(config)
      .then((response) => {
        setMonthlyCase(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchMttrMtbf = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/show-data/mttr-mtbf`,
      headers: {
        'Content-Type': 'application/json',
        // Include the JWT token as a cookie in the request headers
        'Cookie': `user=${token}`,
      }, withCredentials: true
    }
    axios.request(config)
      .then((response) => {
        setMttrMtbf(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDataManpower = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/show-data/manpower?selectStatusManpower=${Number(selected_status_manpower)}`,
      headers: {
        'Content-Type': 'application/json',
        // Include the JWT token as a cookie in the request headers
        'Cookie': `user=${token}`,
      }, withCredentials: true
    }
    axios.request(config)
      .then((response) => {
        setDataManpower(response.data.manpower);
        setCountManpower(response.data.count_manpower);
        setCountAvailable(response.data.count_available);
        setCountProcessing(response.data.count_processing);
        setLoadingManpower(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDataMap = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/show-data/map-layout`,
      headers: {
        'Content-Type': 'application/json',
        // Include the JWT token as a cookie in the request headers
        'Cookie': `user=${token}`,
      }, withCredentials: true
    }
    axios.request(config)
      .then((response) => {
        setDataMap(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchDataMonthlyCase();
      await fetchDataDailyCase();
      await fetchDataMap();
      await fetchMttrMtbf();
      await fetchDataManpower();
      const time = new Date();
      const day = new Date();
      setCurrentTime(formatTime(time));
      setCurrentDay(formatTimeMonth(day));
    };
    if (loading) {
      fetchAllData();
    } else {
      const intervalId = setInterval(fetchAllData, 15000);
      return () => clearInterval(intervalId);
    }
  }, [loading,selected_status_manpower]);

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchDataManpower();
      await fetchDataMap();
      await fetchMttrMtbf();
    };
    if (!loading) {
      fetchAllData();
    }
  }, [selected_status_manpower]);

  return (
    <div className='main-container'>
      <Menubar />
      {loading ? (
        <LoadingModal open={loading} />
      ) : (
        <div className="content">
          <div className="row head border pb-2 pt-2">
            {/* Time Column */}
            <div className="col time ms-3 d-flex align-items-center">
              <Image src='/icon _time_.svg' width={25} height={20} alt="time-icon" style={{ marginRight: '5px' }} />
              <div className="d-flex flex-column">
                <h5 className='last-update text-md-start text-center-md mb-0'>Last Updated : {current_time}</h5>
              </div>
            </div>

            {/* Category Status Column */}
            <div className="col category-status me-2">
              <div className="white circle"></div>
              Normal
              <div className="green circle"></div>
              PM, CM
              <div className="yellow circle"></div>
              BM {'≤'} 30 Min.
              <div className="orange circle"></div>
              BM {'>'} 30 Min. - {'<'} 2 Hrs.
              <div className="red circle"></div>
              BM {'≥'} 2 Hrs.
            </div>
          </div>
          <div className="row">
            {/* Left Column */}
            <div className="col-4">
              {/* Your content for the left column */}
              {/* แสดงหัว Monthly Case */}
              <div className="container Show-Monthly-Case ps-3 rounded-top">
                <div className="text-case">Monthly Case
                  <div className="accumulate">Accumulated on {current_day}</div>
                </div>
              </div>
              {/* แสดงตัว Mtbf Mttr */}
              <div className="monthly-case container pb-2">
                <div className="row mtbg-mttr">
                  <div className="col-5 bg-mtbf rounded-3">
                    <div className="cirandtext">
                      <div className="o_circle circle-monthly" style={{ backgroundColor: mttr_mtbf?.MTBF?.ColorCode, transition: 'all 0.3s ease' }}></div>
                      <div className="text-mtbf">MTBF</div>
                    </div>
                    <div className="cirandtext ms-4">
                      <div className="d-flex flex-row flex-wrap ">
                        <div className="me-2"><Image src='/img_mtbf.svg' width={30} height={40} alt="img_mtbf" /></div>
                        <div className="text-num" style={{ color: mttr_mtbf?.MTBF?.ColorCode, display: 'flex', flexDirection: 'row', transition: 'all 0.3s ease' }}>
                          <div>{mttr_mtbf?.MTBF?.Actual}</div>
                          <div className="case-text hr mb-2" style={{ display: 'inline', alignSelf: 'flex-end', height: '25px' }}>Hrs.</div>
                        </div>
                      </div>
                    </div>
                    <div className="cirandtext ms-4">
                      <div className="text-target-mtbf"> Target {'>'}  {mttr_mtbf?.MTBF?.Target} Hrs. </div>
                    </div>
                  </div>
                  <div className="col-5 bg-mttr rounded-3">
                    <div className="cirandtext">
                      <div className="o_circle circle-monthly" style={{ backgroundColor: mttr_mtbf?.MTTR?.ColorCode, transition: 'all 0.3s ease' }}></div>
                      <div className="text-mttr">MTTR</div>
                    </div>
                    <div className="cirandtext ms-4">
                      <div className="d-flex flex-row flex-wrap">
                        <div className="me-2"><Image src='/img_mttr.svg' width={40} height={40} alt="img_mttr" /></div>
                        <div className="text-num" style={{ color: mttr_mtbf?.MTTR?.ColorCode, display: 'flex', flexDirection: 'row', transition: 'all 0.3s ease' }}>
                          <div>{mttr_mtbf?.MTTR?.Actual}</div>
                          <div className="case-text hr hrcase mb-2" style={{ display: 'inline', alignSelf: 'flex-end', height: '25px' }}>Hrs./Cases</div>
                        </div>
                      </div>
                    </div>
                    <div className="cirandtext ms-4">
                      <div className="text-target-mtbf"> Target {'<'} {mttr_mtbf?.MTTR?.Target} Hrs./Cases </div>
                    </div>
                  </div>
                </div>
                {/* M/C Case*/}
                <div className="mc-case container pb-2">
                  <div className="cirandtext" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image src='/mc_case.svg' width={40} height={42} alt="mc_case" />
                    <div className="text-mc mt-1">M/C Case</div>
                  </div>
                  <div className="accumulate-actual-case">
                    <div className="container">
                      <div className="row acmurow">
                        <div className="col cirandtext acmucol">
                          <div className="o_circle circle-monthly" style={{ backgroundColor: monthly_case?.checktarget?.[4] ?? "", transition: 'all 0.3s ease' }}></div>
                          <div className="amcu">Accumulated M/C BM  {/* <div className="col-2 bor"></div> */}
                            <div className="targetamcu" style={{}}>Target {'<'} {monthly_case?.plan?.[0]?.totalcase ?? ""} Cases</div>
                          </div>
                        </div>
                      </div>
                      <div className="row acmurow">
                        <div className="col amcu-case" style={{ color: monthly_case?.checktarget?.[4] ?? "", transition: 'all 0.3s ease' }}>{monthly_case?.active?.[0]?.totalcase ?? ""} <div className="case-mc-case mb-2 ms-2" style={{ display: 'inline' }}>Cases</div></div>
                      </div>
                      <div className="row mc-box">
                        <div className="col mc-bm-white">
                          <div className="row acmurow">
                            <div className="cirandtext acmucol">
                              <div className="o_circle circle-monthly" style={{ backgroundColor: monthly_case?.checktarget?.[2] ?? "", transition: 'all 0.3s ease' }}></div>
                              <div className="text-mc-bm">M/C BM {'≥'} 2 Hrs.
                                <div className="targetamcu-mc">Target {'<'} {monthly_case?.plan?.[0]?.casep_case_more_2 ?? ""} Cases</div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col"></div>
                            <div className="col mc-bm-2" style={{ color: monthly_case?.checktarget?.[2] ?? "", transition: 'all 0.3s ease' }}> {monthly_case?.active?.[0]?.count_hassei_greater_than_120 ?? ""} <div className="case-mc-case ms-2 mb-2 bg-white-case" style={{ display: 'inline' }}>Cases</div></div>
                          </div>
                        </div>
                        <div className="col mc-bm-white mt-1">
                          <div className="row acmurow">
                            <div className="cirandtext acmucol">
                              <div className="o_circle circle-monthly" style={{ backgroundColor: monthly_case?.checktarget?.[1] ?? "", transition: 'all 0.3s ease' }}></div>
                              <div className="text-mc-bm">
                                M/C BM {'>'} 30 Min ~ {'<'} 2 Hrs.
                                <div className="col targetamcu-mc">Target {'<'} {monthly_case?.plan?.[0]?.casep_case_less_2 ?? ""} Cases</div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col"></div>
                            <div className="col mc-bm-2" style={{ color: monthly_case?.checktarget?.[1] ?? "", transition: 'all 0.3s ease' }}> {monthly_case?.active?.[0]?.count_hassei_between_30_and_120 ?? ""} <div className="case-mc-case ms-2 mb-2 bg-white-case" style={{ display: 'inline' }}>Cases</div></div>
                          </div>
                        </div>
                        <div className="col mc-bm-white mt-1">
                          <div className="row acmurow">
                            <div className="cirandtext acmucol">
                              <div className="o_circle circle-monthly" style={{ backgroundColor: monthly_case?.checktarget?.[0] ?? "", transition: 'all 0.3s ease' }}></div>
                              <div className="text-mc-bm">
                                M/C BM {'≤'} 30 Min
                                <div className="col targetamcu-mc">Target {'<'} {monthly_case?.plan?.[0]?.casep_case_less_30 ?? ""} Cases</div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col"></div>
                            <div className="col mc-bm-2" style={{ color: monthly_case?.checktarget?.[0] ?? "", transition: 'all 0.3s ease' }}> {monthly_case?.active?.[0]?.count_hassei_less_than_30 ?? ""} <div className="case-mc-case ms-2 mb-2 bg-white-case" style={{ display: 'inline' }}>Cases</div></div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="cirandtext" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image src='/icon _alarm.svg' width={15} height={20} alt="icon _alarm" />
                    <div className="text-mc ms-2 mt-1">M/C Time</div>
                  </div>
                  <div className="accumulate-actual-case">
                    <div className="container">
                      <div className="row acmurow">
                        <div className="cirandtext acmucol">
                          <div className="o_circle circle-monthly" style={{ backgroundColor: monthly_case?.checktarget?.[3] ?? "", transition: 'all 0.3s ease' }}></div>
                          <div className="amcu ms-2">Accumulated M/C BM Time<div className="targetamcu">Target {'<'} {monthly_case?.plan?.[0]?.casp_time ?? ""} Hour</div></div>
                        </div>
                      </div>
                      <div className="row amcu-row-last">
                        <div className="col amcu-case" style={{ color: monthly_case?.checktarget?.[3] ?? "", transition: 'all 0.3s ease' }}>{monthly_case?.active?.[0]?.totaltime ?? ""} <div className="case-mc-case ms-2 mb-2" style={{ display: 'inline' }}>Hour</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* DailyPlan*/}
              <div className="container daily-case-show rounded-top">
                <div className="col text-daily">Daily Case<div className="text-daily-day ms-2 mt-1">: {current_time}</div></div>

              </div>
              {/* กล่องแสดงจำนวนใบคำร้องขอ*/}
              <div className="container bg-table">
                <div className="row daily-case_actual">
                  <div className="col-1 bg-daily container mt-2">
                    <div className="row container sum-case">
                      <div className="col case-request rounded-4">
                        <div className="text-daily-request mb-2">Request</div>
                        <div className="cirandtext mt-2">
                          <Image className="Image" src='/img_Request.svg' width={30} height={30} alt="img_Request" />
                          <div className="text-dailycase ms-4" style={{ color: '#3B3B3B' }}> {daily_case?.count_request?.[0]?.ALL ?? ''} </div>
                        </div>
                      </div>
                      <div className="col case-process rounded-4">
                        <div className="text-daily-process mb-2">Processing</div>
                        <div className="cirandtext mt-2">
                          <Image className="Image" src='/img_Processing.svg' width={30} height={30} alt="img_Processing" />
                          <div className="text-dailycase ms-4" style={{ color: '#3B3B3B' }}> {daily_case?.count_processing?.[0]?.ALL ?? ''} </div>
                        </div>
                      </div>
                      <div className="col case-finish rounded-4">
                        <div className="text-daily-finished mb-2">Finished</div>
                        <div className="cirandtext mt-2">
                          <Image className="Image" src='/img_Finished.svg' width={30} height={30} alt="img_Finished" />
                          <div className="text-dailycase ms-4" style={{ color: '#3B3B3B' }}> {daily_case?.count_finished?.[0]?.ALL ?? ''} </div>
                        </div>
                      </div>
                    </div>
                    <div className="ta_ble mt-3"><Table_layout columns={columns} rows={row} /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            {/* ส่วนของแผนที่และจำนวนพนักงานที่กำลังปฏิิบัติงาน */}
            <div className="col-8">
              <table className="table mt-2" style={{ width: '100%'}}>
                <tbody>
                  {/* แถวที่ 1 */}
                  <tr>
                    {/* แถว 1 คอลัมน์ 1 */}
                    <td>
                      <table className="table mt-0 h-100 w-100" >
                        <tr>
                          <td className="change-color" rowSpan={2} ><HoverMaintenance product_name='HP3-Assembly' pd_dept={1} ColorCode={data_map[1]?.['HP3-Assembly']?.ColorCode} />
                          </td>
                          <td className="change-color"><HoverMaintenance product_name='HP3-Common rail' pd_dept={1} ColorCode={data_map[1]?.['HP3-Common rail']?.ColorCode} />
                          </td>
                        </tr>
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='HP3-Inspection' pd_dept={1} ColorCode={data_map[1]?.['HP3-Inspection']?.ColorCode} /></td>
                        </tr>
                        <tr>
                          <td className="change-color" rowSpan={2}><HoverMaintenance product_name='HP5-Common rail' pd_dept={1} ColorCode={data_map[1]?.['HP5-Common rail']?.ColorCode} /></td>
                          <td className="change-color"><HoverMaintenance product_name='HP3-Machining' pd_dept={1} ColorCode={data_map[1]?.['HP3-Machining']?.ColorCode} /></td>
                        </tr>
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='HP5-Assembly' pd_dept={1} placement='left' ColorCode={data_map[1]?.['HP5-Assembly']?.ColorCode} /></td>
                        </tr>
                        <tr>
                          <td className="change-color" rowSpan={2}><HoverMaintenance product_name='HP5-Inspection' placement='left'  pd_dept={1} ColorCode={data_map[1]?.['HP5-Inspection']?.ColorCode} /></td>
                          <td className="change-color"><HoverMaintenance product_name='HP5-Machining' placement='left' pd_dept={1} ColorCode={data_map[1]?.['HP5-Machining']?.ColorCode} /></td>
                        </tr>
                        <tr>
                        </tr>
                      </table>
                    </td>
                    {/* แถว 1 คอลัมน์ 2 */}
                    <td colSpan={2}>
                      <table className="table mt-0 mb-0 h-50 w-100">
                        <td>
                          <table className="table mt-0 h-100 w-100">
                            <td className="change-color" ><HoverMaintenance product_name='G2,G3-Assembly' pd_dept={2} ColorCode={data_map[2]?.['G2,G3-Assembly']?.ColorCode} /></td>
                            <td className="change-color" ><HoverMaintenance product_name='G2,G3-Inspection' pd_dept={2} ColorCode={data_map[2]?.['G2,G3-Inspection']?.ColorCode} /></td>
                            <td className="change-color" ><HoverMaintenance product_name='G2,G3-Machining' pd_dept={2} ColorCode={data_map[2]?.['G2,G3-Machining']?.ColorCode} /></td>
                          </table>
                        </td>
                        <td>
                          <table className="table mt-0 h-100 w-100">
                            <tr>
                                <td className="change-color" rowSpan={2}><HoverMaintenance product_name='G4S-Assembly' pd_dept={3} ColorCode={data_map[3]?.['G4S-Assembly']?.ColorCode} /></td> 
                                <td className="change-color"><HoverMaintenance product_name='G4S-Inspection' pd_dept={3} ColorCode={data_map[3]?.['G4S-Inspection']?.ColorCode} /></td>
                            </tr>
                            <tr>
                                <td className="change-color"><HoverMaintenance product_name='G4S-Machining' pd_dept={3} ColorCode={data_map[3]?.['G4S-Machining']?.ColorCode} /></td>
                            </tr>
                          </table>
                        </td>
                          </table>
                          <table className="table mt-0 h-50 w-100">
                        <td>
                            <table className="table mt-0 h-100 w-100">
                              <tr>
                                  <td className="change-color"><HoverMaintenance product_name='UC-Assembly' pd_dept={4} ColorCode={data_map[4]?.['UC-Assembly']?.ColorCode} /></td>
                              </tr>
                              <tr>
                                  <td className="change-color"><HoverMaintenance product_name='UC-Machining' pd_dept={4} ColorCode={data_map[4]?.['UC-Assembly']?.ColorCode} /></td>
                              </tr>
                            </table>
                        </td>
                        <td>
                          <table className="table mt-0 h-100 w-100">
                            <td className="change-color" rowSpan={2}><HoverMaintenance product_name='PD' pd_dept={11} ColorCode={data_map[11]?.['PD']?.ColorCode} /></td>
                          </table>
                        </td>
                        <td>
                          <table className="table mt-0 h-100 w-100">
                            <td className="change-color" rowSpan={2}><HoverMaintenance product_name='PD common' pd_dept={12} ColorCode={data_map[12]?.['PD common']?.ColorCode} /></td>
                          </table>
                        </td>
                      </table>
                    </td>
                    {/* แถว 1 คอลัมน์ 3 */}
                    {/* <td>
                      <table className="table mt-0 h-100 w-100">
                        <tr>
                          <td className="change-color" rowSpan={8}><HoverMaintenance product_name='PD common' pd_dept={12}/></td>
                          
                          <td className="change-color" colSpan={8}><HoverMaintenance product_name='G4S-Assembly' pd_dept={3}/></td>

                        </tr>
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='G4S-Inspection' pd_dept={3}/></td>
                        </tr>
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='G4S-Machining ' pd_dept={3}/></td>
                        </tr>
                        
                      </table>
                    </td> */}
                  </tr>
                  {/* แถวที่ 2 */}
                  <tr>
                    {/* แถวที่ 2 คอลัมน์ 1 */}
                    <td>
                      <table className="table mt-0 h-100 w-100">
                        <tr>
                          <td className="change-color" rowSpan={2}><HoverMaintenance product_name='GDP-Assembly' pd_dept={5} ColorCode={data_map[5]?.['GDP-Assembly']?.ColorCode} /></td>
                          <td className="change-color"><HoverMaintenance product_name='GDP-Inspection' pd_dept={5} ColorCode={data_map[5]?.['GDP-Inspection']?.ColorCode} /></td>
                        </tr>
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='GDP-Machining' pd_dept={5} ColorCode={data_map[5]?.['GDP-Machining']?.ColorCode} /></td>
                        </tr>
                      </table>
                    </td>
                    {/* แถวที่ 2 คอลัมน์ 2 */}
                    <td>  
                      <table className="table mt-0 h-100 w-100">
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='GDP-Assembly' pd_dept={9} ColorCode={data_map[9]?.['GDP-Assembly']?.ColorCode} /></td>
                          <td className="change-color"><HoverMaintenance product_name='HP3-Common rail' pd_dept={9} ColorCode={data_map[9]?.['HP3-Common rail']?.ColorCode} /></td>
                          <td className="change-color"><HoverMaintenance product_name='QA' pd_dept={9} ColorCode={data_map[9]?.['QA']?.ColorCode} /></td>
                        </tr>
                      </table>
                    </td>
                    {/* แถวที่ 2 คอลัมน์ 3 */}
                    <td rowSpan={3}>
                      <table className="table mt-0 h-100 w-100">
                        <tr>
                          <td className="change-color" rowSpan={3}><HoverMaintenance product_name='Diesel filter' pd_dept={8} ColorCode={data_map[8]?.['Diesel filter']?.ColorCode} /></td>
                          <td className="change-color"><HoverMaintenance product_name='Element' pd_dept={8} ColorCode={data_map[8]?.['Element']?.ColorCode} /></td>
                        </tr>
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='Fuel filter' pd_dept={8} ColorCode={data_map[8]?.['Fuel filter']?.ColorCode} /></td>
                        </tr>
                        <tr>
                          <td className="change-color"><HoverMaintenance product_name='SIFS' pd_dept={8} ColorCode={data_map[8]?.['SIFS']?.ColorCode} /></td>
                        </tr>
                        <tr>
                          <td className="change-color" colSpan={2} rowSpan={3}><HoverMaintenance product_name='HP3-Common rail' pd_dept={8} ColorCode={data_map[8]?.['HP3-Common rail']?.ColorCode} /></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  {/* แถวที่ 3 */}
                  <tr>
                    {/* แถวที่ 3 คอลัมน์ 1 */}
                    <td>
                      <table className="table mt-0 h-100 w-100">
                        <td>
                          <table className="table mt-0 h-100 w-100">
                            <tr>
                              <td className="change-color" colSpan={2}><HoverMaintenance product_name='Solenoid G2,G3' pd_dept={7} ColorCode={data_map[7]?.['Solenoid G2,G3']?.ColorCode} /></td>
                            </tr>
                            <tr>
                              <td className="change-color" rowSpan={2}><HoverMaintenance product_name='Solenoid G4.5' pd_dept={7} ColorCode={data_map[7]?.['Solenoid G4.5']?.ColorCode} /></td>
                            </tr>
                            <tr>
                              <td className="change-color" rowSpan={2}><HoverMaintenance product_name='Solenoid G4S' pd_dept={7} ColorCode={data_map[7]?.['Solenoid G4S']?.ColorCode} /></td>
                            </tr>
                          </table>
                        </td>
                        <td>
                          <table className="table mt-0 h-100 w-100">
                            <tr>
                              <td className="change-color" rowSpan={2}><HoverMaintenance product_name='PCV/PRV' pd_dept={6} ColorCode={data_map[6]?.['PCV/PRV']?.ColorCode} /></td>
                              <td className="change-color" rowSpan={2}><HoverMaintenance product_name='SCV' pd_dept={6} ColorCode={data_map[6]?.['SCV']?.ColorCode} /></td>
                            </tr>
                          </table>
                        </td>
                      </table>
                    </td>
                    {/* แถวที่ 3 คอลัมน์ 2 */}
                    <td>
                      <table className="table mt-0 h-100 w-100">
                        <tr>
                          <td className="change-color" rowSpan={8}><HoverMaintenance product_name='Jig Shop' pd_dept={10} ColorCode={data_map[10]?.['Jig Shop']?.ColorCode} /></td>
                          <td className="change-color" rowSpan={8}><HoverMaintenance product_name='Mold Kaizen' pd_dept={10} ColorCode={data_map[10]?.['Mold Kaizen']?.ColorCode} /></td>
                          <td className="change-color" colSpan={8}><HoverMaintenance product_name='PC' pd_dept={10} ColorCode={data_map[10]?.['PC']?.ColorCode} /></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <Manpower getIndex={setSelectedStatusManpower} manpower_all_count={count_manpower} manpower_available={count_available} manpower_processing={count_processing} data={data_manpower} value={selected_status_manpower} loading={loading_manpower} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}