/*
* c_menubutton.tsx
* component menubutton
* @input -
* @output menubutton
* @author Nattapak,Kamin
* @Create Date 2566-11-11
*/
import React from 'react'
import "/src/css/menubutton.css"
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
type Props = {}

export default function Menubutton({}: Props) {
  const [activePage, setActivePage] = useState('/v_action_plan/v_cost_plan'); // Initialize with a default value
  const [text_left, set_text_left] = useState('') 
  const [text_right, set_text_right] = useState('') 
  const [css_left, set_css_left] = useState('')
  const [css_right, set_css_right] = useState('') 
  const [link_left, set_link_left] = useState('')
  const [link_right, set_link_right] = useState('')
  
  useEffect(() => {
    // Use window.location.pathname to set the activePage state when the component mounts
    setActivePage(window.location.pathname);
    if(window.location.pathname==="/v_action_plan/v_cost_plan"||window.location.pathname==="/v_action_plan/v_case_plan"){
      set_link_left("/v_action_plan/v_cost_plan");
      set_link_right("/v_action_plan/v_case_plan");
      set_text_left("COST PLAN");
      set_text_right("CASE PLAN");
    }else if(window.location.pathname==="/v_user_manage/v_approval"||window.location.pathname==="/v_user_manage/v_permission"){
      set_link_left("/v_user_manage/v_approval");
      set_link_right("/v_user_manage/v_permission");
      set_text_left("APPROVAL");
      set_text_right("PERMISSION");
    }
    if(window.location.pathname==="/v_action_plan/v_cost_plan"||window.location.pathname==="/v_user_manage/v_approval"){
      set_css_left("left_bar_action");
      set_css_right("right_bar_not_action");
    }else{
      set_css_left("left_bar_not_action");
      set_css_right("right_bar_action");
    }
  }, [activePage]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <main>
        <Button className={css_left} href={link_left} id="menubutton_left">
        {text_left}
          </Button>
        <Button className={css_right} href={link_right} id="menubutton_right">
          {text_right}
        </Button>
            <div className="outer_circle">
                <div className="inner_circle"></div>
            </div>
    </main>
  )
}