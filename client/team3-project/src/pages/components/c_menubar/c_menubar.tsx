/*
* c_menubar.tsx
* component menubar
* @input -
* @output menubar
* @author Tassapol
* @Create Date 2567-03-05
*/
import Link from "next/link"
import 'bootstrap/dist/css/bootstrap.css'
import "/src/css/menubar.css?v=1"
import Image from 'next/image'
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import router from "next/router"
import Cookies from "js-cookie";
import Head from 'next/head'

export default function Menubar() {
  const [active_page, setActivePage] = useState('/'); // Initialize with a default value
  const [user_auth, setUserAuth] = useState<any>('');
  const pathurl = process.env.NEXT_PUBLIC_APP_URL;
  const token = Cookies.get('user');

  // Create a memoized function for the Axios request
  const fetchUserData = async () => {
    try {
      if (!token) {
        router.push("/")
      }
      const requiredOptions = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${pathurl}/api/users/token`,
        headers: {
          'Content-Type': 'application/json',
          // Include the JWT token as a cookie in the request headers
          'Cookie': `user=${token}`,
        }, withCredentials: true
      };

      const response = await axios.request(requiredOptions);
      if (response.data.user.user_permission == 1) {
        document?.getElementById("choice4")?.classList.add("disnone") || "";
      } else {
        document?.getElementById("choice4")?.classList.add("disflax") || "";
      }
      if (response.data.user.user_permission == 1) {
        document?.getElementById("choice5")?.classList.add("disnone") || "";
      } else {
        document?.getElementById("choice5")?.classList.add("disflax") || "";
      }
      if (response.data.user.user_permission == 1) {
        document?.getElementById("choice6")?.classList.add("disnone") || "";
      } else {
        document?.getElementById("choice6")?.classList.add("disflax") || "";
      }
      // Set the user data in state
      setUserAuth(response.data.user);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  }

  const setActiveClass = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add("active", "text_active");
    }
  };
  useEffect(() => {
    fetchUserData()
    // Use state (activePage) to conditionally style navigation elements
    setActivePage(window.location.pathname)
    switch (active_page) {
      case '/v_layout':
        setActiveClass('v_layout');
        break;
      case '/v_maintenance':
        setActiveClass('v_maintenance');
        break;
      case '/v_summary_report':
        setActiveClass('v_summary_report');
        break;
      case '/v_check_attendance':
        setActiveClass('v_check_attendance');
        break;
      case '/v_permission':
        setActiveClass('v_user_manage');
        break;
      case '/v_action_plan/v_cost_plan':
      case '/v_action_plan/v_case_plan':
        setActiveClass('v_action_plan');
        break;
      // Add other cases as needed
      default:
        break;
    }
  }, [active_page]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const logout = () => {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${pathurl}/api/users/logout`,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `user=${token}`
      },
      withCredentials: true,
    }
    Cookies.remove('user')
    router.push('/')
    axios.request(config)
      .catch((error) => {
        console.log(error);
      });

  }
  const namearray = user_auth?.name || '';
  const spaceIndex = namearray.indexOf(" ");
  const firstname = spaceIndex !== -1 ? namearray.substring(0, spaceIndex) : namearray;
  const trpefn = typeof firstname;

  return (

    <nav>
        <Head>
            <link rel="icon" href="/icon_denso.svg" />
            <title>RDMJ</title>
        </Head>
      <div className="row_nav row">
        <div className="col-2">
          <Image className="logo col" src="/DensoLoGo.png" alt="DensoLoGo.png" width={120} height={50} priority />
        </div>
        <ul className="nav col justify-content-end" id="menu">
          <li className="nav choice choice1" id="choice1"><Link className="text nav-link text" href="/v_layout" id="v_layout">Layout</Link></li>
          <li className="nav choice choice2" id='choice2'><Link className="text nav-link text" href="/v_maintenance" id="v_maintenance">Maintenance</Link></li>
          <li className="nav choice choice3" id='choice3'><Link className="text nav-link text" href="/v_summary_report" id="v_summary_report">Summary Report</Link></li>
          <li className="nav choice choice4" id='choice4'><Link className="text nav-link text" href="/v_check_attendance" id="v_check_attendance">Check Attendance</Link> </li>
          <li className="nav choice choice5" id='choice5'><Link className="text nav-link text" href="/v_permission" id="v_user_manage">Permission</Link></li>
          <li className="nav choice choice6" id='choice6'><Link className="text nav-link text" href="/v_action_plan/v_cost_plan" id="v_action_plan">Action Plan</Link></li>

          <li className="nav dropdown choice-for-dropdown"> Show More...
              <ul className="dropdown-content">
              <li className="nav choice show-more-1" id="choice1"><Link className="text nav-link text" href="/v_layout" id="v_layout">Layout</Link></li>
              <li className="nav choice show-more-2" id='choice2'><Link className="text nav-link text" href="/v_maintenance" id="v_maintenance">Maintenance</Link></li>
                <li className="nav choice show-more-3" id='choice3'><Link className="text nav-link text" href="/v_summary_report" id="v_summary_report">Summary Report</Link></li>
                <li className="nav choice show-more-4" id='choice4'><Link className="text nav-link text" href="/v_check_attendance" id="v_check_attendance">Check Attendance</Link> </li>
                <li className="nav choice show-more-5" id='choice5'><Link className="text nav-link text" href="/v_permission" id="v_user_manage">Permission</Link></li>
                <li className="nav choice show-more-6" id='choice6'><Link className="text nav-link text" href="/v_action_plan/v_cost_plan" id="v_action_plan">Action Plan</Link></li>
                <Button className="button_logout_show_more" onClick={logout}>
                <Image src="/icon_logout.svg" alt="icon_logout.svg" width={50} height={39}></Image>
                <div className="button_logout_text_show_more">Logout</div>
              </Button>
                
                
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorPosition={{ top: 250, left: 800 }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <div className="khobkhangnai">
                    <div>
                      <div><div className="personal">Personal</div></div>
                      <div>
                        <div><Image src="/icon_profile.svg" alt="icon_profile.svg" width={36.105} height={27.648}></Image>{user_auth?.name} <br /></div>
                        <div className="personal_email">
                          <Image src="/icon_email.svg" alt="icon_email.svg" width={36.105} height={18}></Image>{user_auth?.user_email}
                        </div>
                      </div>
                    </div>
                    <div><hr /></div>
                    <Button className="button_logout" onClick={logout}>
                      <Image src="/icon_logout.svg" alt="icon_logout.svg" width={55} height={39}></Image>
                      <div className="button_logout_text">Logout</div>
                    </Button>
                  </div>
                </Popover>
                    </ul>
              </li>

          <Button className="profile" aria-describedby={id} variant="contained" onClick={handleClick}>
            <div className="fullname text-start">
              {firstname}
              <p className="position">• {user_auth?.user_roles}</p>
            </div>
            <div className="keed">
              <Image src="/tab.svg" alt="tab.svg" width={20} height={40}></Image>
              <div className="kon">
                <Image src="/icon_person.svg" alt="icon_person.svg" width={30} height={30} id="picture_people"></Image>
              </div>
            </div>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorPosition={{ top: 250, left: 800 }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className="khobkhangnai">
              <div>
                <div><div className="personal">Personal</div></div>
                <div>
                  <div><Image src="/icon_profile.svg" alt="icon_profile.svg" width={36.105} height={27.648}></Image>{user_auth?.name} <br /></div>
                  <div className="personal_email">
                    <Image src="/icon_email.svg" alt="icon_email.svg" width={36.105} height={18}></Image>{user_auth?.user_email}
                  </div>
                </div>
              </div>
              <div><hr /></div>
              <Button className="button_logout" onClick={logout}>
                <Image src="/icon_logout.svg" alt="icon_logout.svg" width={55} height={39}></Image>
                <div className="button_logout_text">Logout</div>
              </Button>
            </div>
          </Popover>
        </ul>
      </div>
    </nav>

  )
};