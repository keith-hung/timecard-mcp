


















<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Timecard System</title>


<script type="text/javascript" src="js/tw.js"></script>
<script type="text/javascript" src="js/overtime.js"></script>
<script type="text/javascript">
    // config normal working hours
    var confWorkingHours = 8;

    var durationText = new Array("0.5","1","1.5","2","2.5","3","3.5","4","4.5","5","5.5","6","6.5","7","7.5","8"/*,"8.5","9","9.5","10","10.5","11","11.5","12","12.5","13","13.5","14","14.5","15","15.5","16"*/);
    //to do the activity dynamic change
    function fillTimerecord(rowNumber,colNumber) {
        var timeSelect = eval("document.weekly_info.record"+rowNumber+"_"+colNumber);
        timeSelect.options[0] = new Option("","",true,false);
        for (var j = 1; j < 17; j++) {
            // �_�Ʀ줣�Υ[.0
            if (j%2 != 0)
                timeSelect.options[j] = new Option(durationText[j-1],durationText[j-1],true,false);
            // ���Ʀ춷�[.0
            else
                timeSelect.options[j] = new Option(durationText[j-1],durationText[j-1]+".0",true,false);
        }
    }

    function fillOvertimerecord(rowNumber,colNumber) {
        var timeSelect = eval("document.weekly_info.overrecord"+rowNumber+"_"+colNumber);
        timeSelect.options[0] = new Option("","",true,false);
        for (var j = 1; j < 17; j++) {
            // �_�Ʀ줣�Υ[.0
            if (j%2 != 0)
                timeSelect.options[j] = new Option(durationText[j-1],durationText[j-1],true,false);
            // ���Ʀ춷�[.0
            else
                timeSelect.options[j] = new Option(durationText[j-1],durationText[j-1]+".0",true,false);
        }
    }
</script>
<script type="text/javascript">
    //to do the activity dynamic change
    function unit(pId,sName,is_bottom,uid,progress) {
        this.pid = pId;
        this.name = sName;
        this.cnt = -1;
        this.bottom = is_bottom;
        this.uid = uid;
        this.progress = progress;
        this.collect = new Array();

        //collect�̦s���Ounit
        this.append = appendUnit;
    }

    function appendUnit(pId,sName,is_bottom,uid,progress) {
        this.cnt++;
        t = new unit(pId,sName,is_bottom,uid,progress);
        this.collect[this.cnt] = t;
    }

    var act;
    act = new unit();

act.append('17647','2025_DIL <<1>>','false','1','0');
act.append('17647','  General <<1.1>>','false','2','0');
act.append('17647','    學習成長 <<1.1.1>>','true','3','0');
act.append('17647','    服務支援 <<1.1.2>>','true','4','0');
act.append('17647','    會議 <<1.1.3>>','true','5','0');
act.append('17647','    休假 <<1.1.4>>','true','6','0');
act.append('17647','    公司活動 <<1.1.5>>','true','7','0');
act.append('17647','    行政庶務 <<1.1.6>>','true','8','0');
act.append('17647','    溝通協調 <<1.1.7>>','true','9','0');
act.append('17647','    專案管理 <<1.1.8>>','true','10','0');
act.append('17647','    研究技術 <<1.1.9>>','true','11','0');
act.append('17647','    開發 <<1.1.10>>','true','12','0');
act.append('17647','    測試 <<1.1.11>>','true','13','0');
act.append('17647','    上版及佈署 <<1.1.12>>','true','14','0');
act.append('17647','    維運 <<1.1.13>>','true','15','0');
act.append('17647','    文件 <<1.1.14>>','true','16','0');
act.append('17525','Ai點數腦 <<1>>','false','1','0');
act.append('17525','  US需求檢視討論及確認 <<1.1>>','true','19','0');
act.append('17525','  UIUX 使用者體驗與介面設計 <<1.2>>','true','18','0');
act.append('17525','  PM 專案管理 <<1.3>>','true','17','0');
act.append('17525','  SA 系統分析 <<1.4>>','true','16','0');
act.append('17525','  SD 系統設計 <<1.5>>','true','15','0');
act.append('17525','  PG 程式開發 <<1.6>>','true','14','0');
act.append('17525','  SIT 系統整合測試 <<1.7>>','true','13','0');
act.append('17525','  UAT使用者驗證測試 <<1.8>>','true','12','0');
act.append('17525','  上線準備及作業 <<1.9>>','true','11','0');
act.append('17525','  文件與記錄 <<1.10>>','true','10','0');
act.append('17525','  平台維運及(監測) <<1.11>>','true','9','0');
act.append('17525','  Bug調查與修復 <<1.12>>','true','8','0');
act.append('17525','  技術研究 <<1.13>>','true','7','0');
act.append('17525','  Internal Meeting 內部會議 <<1.14>>','true','6','0');
act.append('17525','  External Meeting 外部會議 <<1.15>>','true','5','0');
act.append('17525','  Pre-sale 支援 <<1.16>>','true','4','0');
act.append('17525','  支援其他專案開發 <<1.17>>','true','3','0');
act.append('17525','  支援其他專案維運 <<1.18>>','true','2','0');
act.append('17570','CYS-會員點數忠誠度行銷系統研發 <<1>>','false','1','0');
act.append('17570','  Pre-sale 支援 (支援業務銷售工作、可行性方案研究) <<1.1>>','true','2','0');
act.append('17570','  PM 專案管理 (專案計畫、專案監控、溝通協調) <<1.2>>','true','3','0');
act.append('17570','  SA 系統分析 (需求蒐集、系統分析、UCM撰寫) <<1.3>>','true','4','0');
act.append('17570','  SD 系統設計 (架構設計、系統設計、資料庫設計) <<1.4>>','true','5','0');
act.append('17570','  PG 程式開發 (程式撰寫、單元測試) <<1.5>>','true','6','0');
act.append('17570','  SIT 系統整合測試 (FT、SIT測試及Debug工作) <<1.6>>','true','7','0');
act.append('17570','  UAT使用者驗證測試 (User驗證及Debug工作) <<1.7>>','true','8','0');
act.append('17570','  Internal Meeting 內部會議 (專案例會、技術會議、議題討論) <<1.8>>','true','9','0');
act.append('17570','  External Meeting 外部會議 (專案例會、需求討論、技術會議、議題討論) <<1.9>>','true','10','0');
act.append('17615','數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發 <<1>>','false','1','0');
act.append('17615','  Pre-sale 支援 (支援業務銷售工作、可行性方案研究) <<1.1>>','true','2','0');
act.append('17615','  PM 專案管理 (專案計畫、專案監控、溝通協調) <<1.2>>','true','3','0');
act.append('17615','  SA 系統分析 (需求蒐集、系統分析、UCM撰寫) <<1.3>>','true','4','0');
act.append('17615','  SD 系統設計 (架構設計、系統設計、資料庫設計) <<1.4>>','true','5','0');
act.append('17615','  PG 程式開發 (程式撰寫、單元測試) <<1.5>>','true','6','0');
act.append('17615','  SIT 系統整合測試 (FT、SIT測試及Debug工作) <<1.6>>','true','7','0');
act.append('17615','  UAT使用者驗證測試 (User驗證及Debug工作) <<1.7>>','true','8','0');
act.append('17615','  Internal Meeting 內部會議 (專案例會、技術會議、議題討論) <<1.8>>','true','9','0');
act.append('17615','  External Meeting 外部會議 (專案例會、需求討論、技術會議、議題討論) <<1.9>>','true','10','0');


    //�M���ª�activity�ﶵ
    function clearOptions(formElement) {
        formObject = eval("document.weekly_info." + formElement);
        formObject.length = 0;
    }

    //��J�s�諸project�ҥ]�t��activity�ﶵ
    function fill(pId, list, formElement) {
        formObject = eval("document.weekly_info." + formElement);
        cnt = 0;
        /*modified by hychang 2006-09-08*/
        //formObject.options[cnt++] = new Option("-- select activity --","-- select activity --",true,false);
        formObject.options[cnt++] = new Option("-- select activity --","false$-1$-1$0",true,false);
        if (list.collect.length > 0) {
            for (var i = 0; i < list.collect.length; i++) {
                if (list.collect[i].pid == pId)
                {
                    // text, value, xxx, xxx
                    // activitySelect value : is_bottom $ activity_uid $ project_id & progress
                    formObject.options[cnt++] = new Option(list.collect[i].name,list.collect[i].bottom+"$"+list.collect[i].uid+"$"+list.collect[i].pid+"$"+list.collect[i].progress,true,false);
                }
            }
            //alert(formObject.options.length);
        }
    }

    function fillActivity(project,activity) {
        //alert("hi");
        var projectSelect = eval("document.weekly_info."+project);
        var projectValue = projectSelect.options[projectSelect.selectedIndex].value;
        var activitySelect = eval("document.weekly_info."+activity);
        clearOptions(activity);
        fill(projectValue, act, activity);
    }

    // �H�Ȧs�̭�l���A
    var tempTimeArray = new Array(25);
    for (var i = 0; i < 25; i++) {
        tempTimeArray[i] = new Array(25);
        for (var j = 0; j < 25; j++) {
            // 0,1 �Ψө�m projectNum, activityNum
            tempTimeArray[i][j] = new Array(9);
        }
    }

    // �H�Ȧsovertime�̭�l���A
    var tempOvertimeArray = new Array(25);
    for (var i = 0; i < 25; i++) {
        tempOvertimeArray[i] = new Array(25);
        for (var j = 0; j < 25; j++) {
            // 0,1 �Ψө�m projectNum, activityNum
            tempOvertimeArray[i][j] = new Array(9);
        }
    }

    var timearray,overtimeArray;

        //�T��}�C, project, activity, record
        timearray = new Array(4);
        //�T��}�C, project, activity, overtimerecord
        overtimeArray = new Array(4);
        // �s closed activity work hours
        closedActTimeArray = new Array(7);
        // �s closed activity overtime work hours
        closedActOvertimeArray = new Array(7);
            /*modified by hychang 2006-09-08*/
               //part_act_ids[i].length �� +1
               timearray[0] = new Array(17);
               overtimeArray[0] = new Array(17);
                  timearray[0][0] = new Array(7);
                    overtimeArray[0][0] = new Array(7);
                  timearray[0][1] = new Array(7);
                    overtimeArray[0][1] = new Array(7);
                  timearray[0][2] = new Array(7);
                    overtimeArray[0][2] = new Array(7);
                  timearray[0][3] = new Array(7);
                    overtimeArray[0][3] = new Array(7);
                  timearray[0][4] = new Array(7);
                    overtimeArray[0][4] = new Array(7);
                  timearray[0][5] = new Array(7);
                    overtimeArray[0][5] = new Array(7);
                  timearray[0][6] = new Array(7);
                    overtimeArray[0][6] = new Array(7);
                  timearray[0][7] = new Array(7);
                    overtimeArray[0][7] = new Array(7);
                  timearray[0][8] = new Array(7);
                    overtimeArray[0][8] = new Array(7);
                  timearray[0][9] = new Array(7);
                    overtimeArray[0][9] = new Array(7);
                  timearray[0][10] = new Array(7);
                    overtimeArray[0][10] = new Array(7);
                  timearray[0][11] = new Array(7);
                    overtimeArray[0][11] = new Array(7);
                  timearray[0][12] = new Array(7);
                    overtimeArray[0][12] = new Array(7);
                  timearray[0][13] = new Array(7);
                    overtimeArray[0][13] = new Array(7);
                  timearray[0][14] = new Array(7);
                    overtimeArray[0][14] = new Array(7);
                  timearray[0][15] = new Array(7);
                    overtimeArray[0][15] = new Array(7);
                  timearray[0][16] = new Array(7);
                    overtimeArray[0][16] = new Array(7);
            /*modified by hychang 2006-09-08*/
               //part_act_ids[i].length �� +1
               timearray[1] = new Array(20);
               overtimeArray[1] = new Array(20);
                  timearray[1][0] = new Array(7);
                    overtimeArray[1][0] = new Array(7);
                  timearray[1][1] = new Array(7);
                    overtimeArray[1][1] = new Array(7);
                  timearray[1][2] = new Array(7);
                    overtimeArray[1][2] = new Array(7);
                  timearray[1][3] = new Array(7);
                    overtimeArray[1][3] = new Array(7);
                  timearray[1][4] = new Array(7);
                    overtimeArray[1][4] = new Array(7);
                  timearray[1][5] = new Array(7);
                    overtimeArray[1][5] = new Array(7);
                  timearray[1][6] = new Array(7);
                    overtimeArray[1][6] = new Array(7);
                  timearray[1][7] = new Array(7);
                    overtimeArray[1][7] = new Array(7);
                  timearray[1][8] = new Array(7);
                    overtimeArray[1][8] = new Array(7);
                  timearray[1][9] = new Array(7);
                    overtimeArray[1][9] = new Array(7);
                  timearray[1][10] = new Array(7);
                    overtimeArray[1][10] = new Array(7);
                  timearray[1][11] = new Array(7);
                    overtimeArray[1][11] = new Array(7);
                  timearray[1][12] = new Array(7);
                    overtimeArray[1][12] = new Array(7);
                  timearray[1][13] = new Array(7);
                    overtimeArray[1][13] = new Array(7);
                  timearray[1][14] = new Array(7);
                    overtimeArray[1][14] = new Array(7);
                  timearray[1][15] = new Array(7);
                    overtimeArray[1][15] = new Array(7);
                  timearray[1][16] = new Array(7);
                    overtimeArray[1][16] = new Array(7);
                  timearray[1][17] = new Array(7);
                    overtimeArray[1][17] = new Array(7);
                  timearray[1][18] = new Array(7);
                    overtimeArray[1][18] = new Array(7);
                  timearray[1][19] = new Array(7);
                    overtimeArray[1][19] = new Array(7);
            /*modified by hychang 2006-09-08*/
               //part_act_ids[i].length �� +1
               timearray[2] = new Array(11);
               overtimeArray[2] = new Array(11);
                  timearray[2][0] = new Array(7);
                    overtimeArray[2][0] = new Array(7);
                  timearray[2][1] = new Array(7);
                    overtimeArray[2][1] = new Array(7);
                  timearray[2][2] = new Array(7);
                    overtimeArray[2][2] = new Array(7);
                  timearray[2][3] = new Array(7);
                    overtimeArray[2][3] = new Array(7);
                  timearray[2][4] = new Array(7);
                    overtimeArray[2][4] = new Array(7);
                  timearray[2][5] = new Array(7);
                    overtimeArray[2][5] = new Array(7);
                  timearray[2][6] = new Array(7);
                    overtimeArray[2][6] = new Array(7);
                  timearray[2][7] = new Array(7);
                    overtimeArray[2][7] = new Array(7);
                  timearray[2][8] = new Array(7);
                    overtimeArray[2][8] = new Array(7);
                  timearray[2][9] = new Array(7);
                    overtimeArray[2][9] = new Array(7);
                  timearray[2][10] = new Array(7);
                    overtimeArray[2][10] = new Array(7);
            /*modified by hychang 2006-09-08*/
               //part_act_ids[i].length �� +1
               timearray[3] = new Array(11);
               overtimeArray[3] = new Array(11);
                  timearray[3][0] = new Array(7);
                    overtimeArray[3][0] = new Array(7);
                  timearray[3][1] = new Array(7);
                    overtimeArray[3][1] = new Array(7);
                  timearray[3][2] = new Array(7);
                    overtimeArray[3][2] = new Array(7);
                  timearray[3][3] = new Array(7);
                    overtimeArray[3][3] = new Array(7);
                  timearray[3][4] = new Array(7);
                    overtimeArray[3][4] = new Array(7);
                  timearray[3][5] = new Array(7);
                    overtimeArray[3][5] = new Array(7);
                  timearray[3][6] = new Array(7);
                    overtimeArray[3][6] = new Array(7);
                  timearray[3][7] = new Array(7);
                    overtimeArray[3][7] = new Array(7);
                  timearray[3][8] = new Array(7);
                    overtimeArray[3][8] = new Array(7);
                  timearray[3][9] = new Array(7);
                    overtimeArray[3][9] = new Array(7);
                  timearray[3][10] = new Array(7);
                    overtimeArray[3][10] = new Array(7);
          closedActTimeArray[0] = 0.0;
            closedActOvertimeArray[0] = 0.0;
          closedActTimeArray[1] = 0.0;
            closedActOvertimeArray[1] = 0.0;
          closedActTimeArray[2] = 0.0;
            closedActOvertimeArray[2] = 0.0;
          closedActTimeArray[3] = 0.0;
            closedActOvertimeArray[3] = 0.0;
          closedActTimeArray[4] = 0.0;
            closedActOvertimeArray[4] = 0.0;
          closedActTimeArray[5] = 0.0;
            closedActOvertimeArray[5] = 0.0;
          closedActTimeArray[6] = 0.0;
            closedActOvertimeArray[6] = 0.0;

                /*modified by hychang 2006-09-08*/
                timearray[0][6][0] = "8.0$submit$$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][9][1] = "1.5$submit$$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][5][2] = "2.0$submit$weekly meeting$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][9][2] = "1.5$submit$$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][12][1] = "6.5$submit$PDR POC$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][12][2] = "4.5$submit$CI/CD 本地端驗證$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][4][3] = "5.0$submit$新需求評估 報到系統討論與 POC$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][4][4] = "2.5$submit$新需求評估$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][9][3] = "1.5$submit$$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][9][4] = "1.5$submit$$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][12][3] = "1.5$submit$CI/CD 本地端驗證$0";

                /*modified by hychang 2006-09-08*/
                timearray[0][12][4] = "4.0$submit$CI/CD 本地端驗證$0";

</script>

<script LANGUAGE="JavaScript" type="text/javascript">

    function datechange(){
        window.location.href="timecard_weekly.jsp";
    }
</script>

<style type="text/css">
<!--
.style2 {font-style: italic}
.style3 {font-weight: bold; color: #000000;}
-->
</style>
</head>

<!--add by hychang 2006-12-27-->
<body onload="Tooltip.init(),initialProject('Sun'),updateWeekTotalTime();">

    ﻿





<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>Timecard System</title>
   <link rel="stylesheet" href="/TCRS/Timecard/2col_leftNav4.css" type="text/css" />

<style type="text/css">
<!--
.style1 {
	color: #111111;
	font-weight: bold;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 16px;
}
.style2 {font-size: 14px}


/* This is where you can customize the appearance of the tooltip */
div#tipDiv {
  position:absolute; visibility:hidden; left:0; top:0; z-index:10000;
  background-color:#dee7f7; border:1px solid #336;
  width:250px; padding:4px;
  color:#000; font-size:11px; line-height:1.2;
}
/* These are optional. They demonstrate how you can individually format tooltip content  */
div.tp1 { font-size:12px; color:#336; font-style:italic }
div.tp2 { font-weight:bolder; color:#337; padding-top:4px }
-->
</style>
<script src="../js/dw_event.js" type="text/javascript"></script>
<script src="../js/dw_viewport.js" type="text/javascript"></script>
<script src="../js/dw_tooltip.js" type="text/javascript"></script>
<script type="text/javascript">
/*************************************************************************
  This code is from Dynamic Web Coding at dyn-web.com
  Copyright 2003-5 by Sharon Paine
  See Terms of Use at http://www.dyn-web.com/bus/terms.html
  regarding conditions under which you may use this code.
  This notice must be retained in the code as is!
*************************************************************************/

function doTooltip(e, msg) {
  if ( typeof Tooltip == "undefined" || !Tooltip.ready ) return;
  Tooltip.show(e, msg);
}

function hideTip() {
  if ( typeof Tooltip == "undefined" || !Tooltip.ready ) return;
  Tooltip.hide();
}

// variables for tooltip content
//var tipRich = '<div class="tp1">This text is in a div with it\'s own class for different style specifications than the tooltip. </div>';
//var tipImg = '<div style="text-align:center"><img src="images/dot-com-btn.gif" width="176" height="30" alt="" border="0"></div>';
//var tipImgTxt = '<img src="images/sm-duck.gif" width="90" height="44" alt="" border="0"><div class="tp2">Images and text can go together in a tooltip.</div>';
//var tipTerms = "If you plan to use our code, please follow our terms. Thank you.";

</script>
<!-- European format dd-mm-yyyy -->
<script language="JavaScript" src="calendar1.js"></script><!-- Date only with year scrolling -->
<!-- American format mm/dd/yyyy -->
<script language="JavaScript" src="calendar2.js"></script><!-- Date only with year scrolling -->
<style type="text/css">
<!--
body {
	background-color: #59728F;
}
-->
</style>
</head>
<body onload="Tooltip.init()">

<div align="center">
  <TABLE WIDTH=880 BORDER="0" CELLPADDING="0" CELLSPACING="0">
    <tr><td colspan="19" background="/TCRS/images/a01_03.gif">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <TR>
		  <TD COLSPAN=4 WIDTH=152>
			  <IMG SRC="/TCRS/images/a01_01.gif" WIDTH=152 HEIGHT=93 ALT=""></TD>
		  <TD COLSPAN=10 WIDTH=418>
			  <IMG SRC="/TCRS/images/a01_02.gif" WIDTH=418 HEIGHT=93 ALT=""></TD>
		  <TD COLSPAN=2 WIDTH=111>
			  <IMG SRC="/TCRS/images/a01_03.gif" WIDTH=111 HEIGHT=93 ALT=""></TD>
		  <TD COLSPAN="3" align="right">
			  <IMG SRC="/TCRS/images/a01_04.gif" WIDTH=199 HEIGHT=93 ALT=""></TD>
	  </TR></table>
	  </td></tr>
<tr><td colspan="19" bgcolor="white" align="left" background="/TCRS/images/img03.gif">



<table  border="0" cellpadding="2" cellspacing="0" width="100%" align="left">
  <tr>
    <td  nowrap="nowrap" height="25"  width="100%">&nbsp;
    <a class="mainMenu2" href="/TCRS/Timecard/project/ini_mainframe.jsp" onmouseover="doTooltip(event,'Welcome to timecard system.');this.style.color = 'yellow';" onmouseout="hideTip();this.style.color = 'white';" style="color:white;text-decoration: none;">Help </a>&nbsp;<font color="lightblue">|</font>&nbsp;



    <a class="mainMenu2" href="/TCRS/Timecard/project/projects.jsp" onmouseover="doTooltip(event,'List information of projects that involved.');this.style.color = 'yellow';" onmouseout="hideTip();this.style.color = 'white';" style="color:white;text-decoration: none;"> Project Info </a>&nbsp;<font color="lightblue">|</font>&nbsp;
    <a class="mainMenu2" href="/TCRS/Timecard/activity/activity.jsp" onmouseover="doTooltip(event,'List information of activities that invloved.');this.style.color = 'yellow';" onmouseout="hideTip();this.style.color = 'white';" style="color:white;text-decoration: none;"> Activity Info </a>&nbsp;<font color="lightblue">|</font>&nbsp;
    <a class="mainMenu2" href="/TCRS/Timecard/report/report.jsp" onmouseover="doTooltip(event,'Query timecard records according to your authority.');this.style.color = 'yellow';" onmouseout="hideTip();this.style.color = 'white';" style="color:white;text-decoration: none;"> Timecard Query </a>&nbsp;<font color="lightblue">|</font>&nbsp;
    <a class="mainMenu2" href="/TCRS/Timecard/timecard_week/daychoose.jsp" onmouseover="doTooltip(event,'Input personal weekly timecard information.');this.style.color = 'yellow';" onmouseout="hideTip();this.style.color = 'white';" style="color:white;text-decoration: none;"> Timecard </a>&nbsp;<font color="lightblue">|</font>&nbsp;
   
    </td>
	<td><a href="/TCRS/servlet/LogoutServlet" class="mainMenu2"  onmouseover="this.style.color = 'red';" onmouseout="this.style.color = 'white';" style="color:white;text-decoration: none;">Logout</a>&nbsp;</td></tr>

</table>
</td></tr>
<tr><td colspan="19" bgcolor="white" class="mainMenu1" align="left">
<div class="story">




<table border="0" cellpadding="0" cellspacing="0">
    <tr>
        <td colspan="2"></td>
    </tr>
    <tr>
        <td width="800" class="sectionHeader"><p class="head">Timecard</p></td>
    </tr>
</table>
<table width="839" height="201" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="502">
      <table width="404">
        <tr>
          <td align="left"><div align="right"><span class="style3">today:&nbsp&nbsp&nbsp&nbsp </span></div></td>
          <td>2025-09-25</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td valign="middle">&nbsp;</td>
        </tr>
        <tr>
          <td width="195"><p align="right"><strong>select a week by a date:<span class="style3">&nbsp</span><span class="style3">&nbsp</span><span class="style3">&nbsp</span><span class="style3">&nbsp</span></strong></p></td>
          <td width="197" valign="middle">
            <form name="form1" action="timecard_weekly.jsp" method="post">
              <input size="10" type="Text" name="date" value="2025-09-08" onChange="" readonly>
              <a href="javascript:cal1.popup();"><img src="img/cal.gif" width="16" height="16" border="0" alt="Click Here to Pick up the date"></a><br>
          </form></td>
        </tr>
        <tr>
          <td colspan="2"><a href="daychoose.jsp?cho_date=2025-09-01"> </a><a href="daychoose.jsp?cho_date=2025-09-01">&lt&lt last_week</a> &nbsp;&nbsp;&nbsp; <a href="daychoose.jsp">this_week</a> &nbsp;&nbsp;&nbsp; <a href="daychoose.jsp?cho_date=2025-09-15">next_week &gt&gt</a> </td>
        </tr>
    </table></td>
    <td width='17'>&nbsp; </td>
    <td width="320">
      <table width="320">
        <tr>
          <td width='10' bgcolor='green'></td>
          <td>The record status is approved.</td>
        </tr>
        <tr>
          <td width='10' bgcolor='red'></td>
          <td>The record status is rejected.</td>
        </tr>
        <tr>
          <td width='10' height="15" bgcolor='blue'></td>
          <td>The record status is submitted.</td>
        </tr>
      </table>
      <table >
        <tr>
          <td><img src="img/note.png" alt="" width="15" height="15"></td>
          <td> Blank note.</td>
        </tr>
        <tr>
          <td><img src="img/updateNote.png" alt="" width="15" height="15"></td>
          <td> Modified note.</td>
        </tr>
        <tr>
          <td><img src="img/accessNote.png" alt="" width="15" height="15"></td>
          <td> Saved note.</td>
        </tr>
      </table>
      <p>&nbsp;</p></td>
  </tr>
  <td height="3">
  <tr>
    <td>
      
      <table width="502">
        <tr>
          <td width="183" align="left">records before this week:</td>
          <td width="307" align="left"> &nbsp;&nbsp;<a href="#" onClick="javascript:window.open('beforeRecord.jsp?status=reject&date=2025-09-08&totalHour=3.0')"><font color="red">total rejected: 3.0 hour(s)</font></a> </td>
        </tr>
        <tr>
          <td align="left">&nbsp;</td>
          <td align="left"> &nbsp;&nbsp;<a href="#" onClick="javascript:window.open('beforeRecord.jsp?status=save&date=2025-09-08&totalHour=12.5')">total saved: 12.5 hour(s)</a> </td>
        </tr>
    </table></td>
    <td height="3"><form name="weekly_info" action="weekinfo_deal.jsp" method="post">
        
    <td><input type="submit" name="save2" value=" save " onClick="return verifyWorkingSave(confWorkingHours);"/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <!--modified by hychang 2007-01-11-->
        
        <input type="submit" name="submit2" value="submit" onClick="return verifyWorkingSubmit(confWorkingHours);"/></td>
    
  </tr>
</table>
<input name="caller" type="hidden" value="this_week" />
<input name="cdate" type="hidden" value="2025-09-08" />
<table border='1' cellpadding='1' cellspacing='1' bordercolorlight="#cccccc" bordercolordark="#cccccc">
<tr>
    <td colspan="10" bgcolor="#B3B3B3"><span class="style2 sectionHeader_0"><strong>time records</strong></span></td>
</tr>
<tr bgcolor="#B5C3C6">
<td class="tableHeader"><div align="center">project</div></td>
<td class="tableHeader"><div align="center">activity</div></td>
<td class="tableHeader"><div align="center">progress</div></td>
<script LANGUAGE="JavaScript" type="text/javascript">

        today = new Date("2025/09/08");


    weekday = today.getDay();
    if(weekday==0){
       weekday = 7;
    }
    w = new Array('Mon','Tue','Wed','Thu','Fri','Sat','Sun');
    weekdate = new Array(7);
    d = today.getDate();

    for (i = weekday-1; i >= 0; i--) {

        today = new Date("2025/09/08");

        today.setDate(today.getDate()-i);
        d = today.getDate();

        m = today.getMonth()+1;
        weekdate[weekday-i-1] = m+"-"+d;
    }

    for (i = 1; i < 8-weekday; i++) {

        today = new Date("2025/09/08");

        today.setDate(today.getDate()+i);
        d = today.getDate();

        m = today.getMonth()+1;
        weekdate[weekday+i-1] = m+"-"+d;
    }

    for (i = 0; i < 7; i++) {
        if (i == (weekday-1))
            document.write('<td bgcolor=\'pink\'><b>' + weekdate[i] + '</b><br>' + w[i] + '</td>');
        else
            document.write('<td><b>' + weekdate[i] + '</b><br>' + w[i] + '</td>');
    }

</script>


<tr id='weekrecord0'><td><select name='project0' onchange="fillActivity('project0','activity0'),clearRecord('0', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity0' onChange="checkActivityDuplicate(0),changeActivity('0','activity0',document.weekly_info.project0.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress0" size='2' readOnly />%</td>
<td><div id='status0_0'></div>
<div><select name='record0_0' onChange='updateTotalTime(0,0);' disabled></select><a href="#" onClick="callDailyNote(0,0,false)"'><img name='note0_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note0_0" type="hidden"/>
<input name="progress0_0" type="hidden"/></td>
<td><div id='status0_1'></div>
<div><select name='record0_1' onChange='updateTotalTime(0,1);' disabled></select><a href="#" onClick="callDailyNote(1,0,false)"'><img name='note0_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note0_1" type="hidden"/>
<input name="progress0_1" type="hidden"/></td>
<td><div id='status0_2'></div>
<div><select name='record0_2' onChange='updateTotalTime(0,2);' disabled></select><a href="#" onClick="callDailyNote(2,0,false)"'><img name='note0_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note0_2" type="hidden"/>
<input name="progress0_2" type="hidden"/></td>
<td><div id='status0_3'></div>
<div><select name='record0_3' onChange='updateTotalTime(0,3);' disabled></select><a href="#" onClick="callDailyNote(3,0,false)"'><img name='note0_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note0_3" type="hidden"/>
<input name="progress0_3" type="hidden"/></td>
<td><div id='status0_4'></div>
<div><select name='record0_4' onChange='updateTotalTime(0,4);' disabled></select><a href="#" onClick="callDailyNote(4,0,false)"'><img name='note0_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note0_4" type="hidden"/>
<input name="progress0_4" type="hidden"/></td>
<td><div id='status0_5'></div>
<div><select name='record0_5' onChange='updateTotalTime(0,5);' disabled></select><a href="#" onClick="callDailyNote(5,0,false)"'><img name='note0_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note0_5" type="hidden"/>
<input name="progress0_5" type="hidden"/></td>
<td><div id='status0_6'></div>
<div><select name='record0_6' onChange='updateTotalTime(0,6);' disabled></select><a href="#" onClick="callDailyNote(6,0,false)"'><img name='note0_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note0_6" type="hidden"/>
<input name="progress0_6" type="hidden"/></td>
<tr id='weekrecord1'><td><select name='project1' onchange="fillActivity('project1','activity1'),clearRecord('1', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity1' onChange="checkActivityDuplicate(1),changeActivity('1','activity1',document.weekly_info.project1.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress1" size='2' readOnly />%</td>
<td><div id='status1_0'></div>
<div><select name='record1_0' onChange='updateTotalTime(1,0);' disabled></select><a href="#" onClick="callDailyNote(0,1,false)"'><img name='note1_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note1_0" type="hidden"/>
<input name="progress1_0" type="hidden"/></td>
<td><div id='status1_1'></div>
<div><select name='record1_1' onChange='updateTotalTime(1,1);' disabled></select><a href="#" onClick="callDailyNote(1,1,false)"'><img name='note1_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note1_1" type="hidden"/>
<input name="progress1_1" type="hidden"/></td>
<td><div id='status1_2'></div>
<div><select name='record1_2' onChange='updateTotalTime(1,2);' disabled></select><a href="#" onClick="callDailyNote(2,1,false)"'><img name='note1_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note1_2" type="hidden"/>
<input name="progress1_2" type="hidden"/></td>
<td><div id='status1_3'></div>
<div><select name='record1_3' onChange='updateTotalTime(1,3);' disabled></select><a href="#" onClick="callDailyNote(3,1,false)"'><img name='note1_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note1_3" type="hidden"/>
<input name="progress1_3" type="hidden"/></td>
<td><div id='status1_4'></div>
<div><select name='record1_4' onChange='updateTotalTime(1,4);' disabled></select><a href="#" onClick="callDailyNote(4,1,false)"'><img name='note1_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note1_4" type="hidden"/>
<input name="progress1_4" type="hidden"/></td>
<td><div id='status1_5'></div>
<div><select name='record1_5' onChange='updateTotalTime(1,5);' disabled></select><a href="#" onClick="callDailyNote(5,1,false)"'><img name='note1_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note1_5" type="hidden"/>
<input name="progress1_5" type="hidden"/></td>
<td><div id='status1_6'></div>
<div><select name='record1_6' onChange='updateTotalTime(1,6);' disabled></select><a href="#" onClick="callDailyNote(6,1,false)"'><img name='note1_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note1_6" type="hidden"/>
<input name="progress1_6" type="hidden"/></td>
<tr id='weekrecord2'><td><select name='project2' onchange="fillActivity('project2','activity2'),clearRecord('2', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity2' onChange="checkActivityDuplicate(2),changeActivity('2','activity2',document.weekly_info.project2.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress2" size='2' readOnly />%</td>
<td><div id='status2_0'></div>
<div><select name='record2_0' onChange='updateTotalTime(2,0);' disabled></select><a href="#" onClick="callDailyNote(0,2,false)"'><img name='note2_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note2_0" type="hidden"/>
<input name="progress2_0" type="hidden"/></td>
<td><div id='status2_1'></div>
<div><select name='record2_1' onChange='updateTotalTime(2,1);' disabled></select><a href="#" onClick="callDailyNote(1,2,false)"'><img name='note2_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note2_1" type="hidden"/>
<input name="progress2_1" type="hidden"/></td>
<td><div id='status2_2'></div>
<div><select name='record2_2' onChange='updateTotalTime(2,2);' disabled></select><a href="#" onClick="callDailyNote(2,2,false)"'><img name='note2_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note2_2" type="hidden"/>
<input name="progress2_2" type="hidden"/></td>
<td><div id='status2_3'></div>
<div><select name='record2_3' onChange='updateTotalTime(2,3);' disabled></select><a href="#" onClick="callDailyNote(3,2,false)"'><img name='note2_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note2_3" type="hidden"/>
<input name="progress2_3" type="hidden"/></td>
<td><div id='status2_4'></div>
<div><select name='record2_4' onChange='updateTotalTime(2,4);' disabled></select><a href="#" onClick="callDailyNote(4,2,false)"'><img name='note2_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note2_4" type="hidden"/>
<input name="progress2_4" type="hidden"/></td>
<td><div id='status2_5'></div>
<div><select name='record2_5' onChange='updateTotalTime(2,5);' disabled></select><a href="#" onClick="callDailyNote(5,2,false)"'><img name='note2_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note2_5" type="hidden"/>
<input name="progress2_5" type="hidden"/></td>
<td><div id='status2_6'></div>
<div><select name='record2_6' onChange='updateTotalTime(2,6);' disabled></select><a href="#" onClick="callDailyNote(6,2,false)"'><img name='note2_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note2_6" type="hidden"/>
<input name="progress2_6" type="hidden"/></td>
<tr id='weekrecord3'><td><select name='project3' onchange="fillActivity('project3','activity3'),clearRecord('3', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity3' onChange="checkActivityDuplicate(3),changeActivity('3','activity3',document.weekly_info.project3.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress3" size='2' readOnly />%</td>
<td><div id='status3_0'></div>
<div><select name='record3_0' onChange='updateTotalTime(3,0);' disabled></select><a href="#" onClick="callDailyNote(0,3,false)"'><img name='note3_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note3_0" type="hidden"/>
<input name="progress3_0" type="hidden"/></td>
<td><div id='status3_1'></div>
<div><select name='record3_1' onChange='updateTotalTime(3,1);' disabled></select><a href="#" onClick="callDailyNote(1,3,false)"'><img name='note3_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note3_1" type="hidden"/>
<input name="progress3_1" type="hidden"/></td>
<td><div id='status3_2'></div>
<div><select name='record3_2' onChange='updateTotalTime(3,2);' disabled></select><a href="#" onClick="callDailyNote(2,3,false)"'><img name='note3_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note3_2" type="hidden"/>
<input name="progress3_2" type="hidden"/></td>
<td><div id='status3_3'></div>
<div><select name='record3_3' onChange='updateTotalTime(3,3);' disabled></select><a href="#" onClick="callDailyNote(3,3,false)"'><img name='note3_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note3_3" type="hidden"/>
<input name="progress3_3" type="hidden"/></td>
<td><div id='status3_4'></div>
<div><select name='record3_4' onChange='updateTotalTime(3,4);' disabled></select><a href="#" onClick="callDailyNote(4,3,false)"'><img name='note3_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note3_4" type="hidden"/>
<input name="progress3_4" type="hidden"/></td>
<td><div id='status3_5'></div>
<div><select name='record3_5' onChange='updateTotalTime(3,5);' disabled></select><a href="#" onClick="callDailyNote(5,3,false)"'><img name='note3_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note3_5" type="hidden"/>
<input name="progress3_5" type="hidden"/></td>
<td><div id='status3_6'></div>
<div><select name='record3_6' onChange='updateTotalTime(3,6);' disabled></select><a href="#" onClick="callDailyNote(6,3,false)"'><img name='note3_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note3_6" type="hidden"/>
<input name="progress3_6" type="hidden"/></td>
<tr id='weekrecord4'><td><select name='project4' onchange="fillActivity('project4','activity4'),clearRecord('4', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity4' onChange="checkActivityDuplicate(4),changeActivity('4','activity4',document.weekly_info.project4.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress4" size='2' readOnly />%</td>
<td><div id='status4_0'></div>
<div><select name='record4_0' onChange='updateTotalTime(4,0);' disabled></select><a href="#" onClick="callDailyNote(0,4,false)"'><img name='note4_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note4_0" type="hidden"/>
<input name="progress4_0" type="hidden"/></td>
<td><div id='status4_1'></div>
<div><select name='record4_1' onChange='updateTotalTime(4,1);' disabled></select><a href="#" onClick="callDailyNote(1,4,false)"'><img name='note4_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note4_1" type="hidden"/>
<input name="progress4_1" type="hidden"/></td>
<td><div id='status4_2'></div>
<div><select name='record4_2' onChange='updateTotalTime(4,2);' disabled></select><a href="#" onClick="callDailyNote(2,4,false)"'><img name='note4_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note4_2" type="hidden"/>
<input name="progress4_2" type="hidden"/></td>
<td><div id='status4_3'></div>
<div><select name='record4_3' onChange='updateTotalTime(4,3);' disabled></select><a href="#" onClick="callDailyNote(3,4,false)"'><img name='note4_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note4_3" type="hidden"/>
<input name="progress4_3" type="hidden"/></td>
<td><div id='status4_4'></div>
<div><select name='record4_4' onChange='updateTotalTime(4,4);' disabled></select><a href="#" onClick="callDailyNote(4,4,false)"'><img name='note4_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note4_4" type="hidden"/>
<input name="progress4_4" type="hidden"/></td>
<td><div id='status4_5'></div>
<div><select name='record4_5' onChange='updateTotalTime(4,5);' disabled></select><a href="#" onClick="callDailyNote(5,4,false)"'><img name='note4_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note4_5" type="hidden"/>
<input name="progress4_5" type="hidden"/></td>
<td><div id='status4_6'></div>
<div><select name='record4_6' onChange='updateTotalTime(4,6);' disabled></select><a href="#" onClick="callDailyNote(6,4,false)"'><img name='note4_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note4_6" type="hidden"/>
<input name="progress4_6" type="hidden"/></td>
<tr id='weekrecord5'><td><select name='project5' onchange="fillActivity('project5','activity5'),clearRecord('5', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity5' onChange="checkActivityDuplicate(5),changeActivity('5','activity5',document.weekly_info.project5.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress5" size='2' readOnly />%</td>
<td><div id='status5_0'></div>
<div><select name='record5_0' onChange='updateTotalTime(5,0);' disabled></select><a href="#" onClick="callDailyNote(0,5,false)"'><img name='note5_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note5_0" type="hidden"/>
<input name="progress5_0" type="hidden"/></td>
<td><div id='status5_1'></div>
<div><select name='record5_1' onChange='updateTotalTime(5,1);' disabled></select><a href="#" onClick="callDailyNote(1,5,false)"'><img name='note5_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note5_1" type="hidden"/>
<input name="progress5_1" type="hidden"/></td>
<td><div id='status5_2'></div>
<div><select name='record5_2' onChange='updateTotalTime(5,2);' disabled></select><a href="#" onClick="callDailyNote(2,5,false)"'><img name='note5_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note5_2" type="hidden"/>
<input name="progress5_2" type="hidden"/></td>
<td><div id='status5_3'></div>
<div><select name='record5_3' onChange='updateTotalTime(5,3);' disabled></select><a href="#" onClick="callDailyNote(3,5,false)"'><img name='note5_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note5_3" type="hidden"/>
<input name="progress5_3" type="hidden"/></td>
<td><div id='status5_4'></div>
<div><select name='record5_4' onChange='updateTotalTime(5,4);' disabled></select><a href="#" onClick="callDailyNote(4,5,false)"'><img name='note5_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note5_4" type="hidden"/>
<input name="progress5_4" type="hidden"/></td>
<td><div id='status5_5'></div>
<div><select name='record5_5' onChange='updateTotalTime(5,5);' disabled></select><a href="#" onClick="callDailyNote(5,5,false)"'><img name='note5_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note5_5" type="hidden"/>
<input name="progress5_5" type="hidden"/></td>
<td><div id='status5_6'></div>
<div><select name='record5_6' onChange='updateTotalTime(5,6);' disabled></select><a href="#" onClick="callDailyNote(6,5,false)"'><img name='note5_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note5_6" type="hidden"/>
<input name="progress5_6" type="hidden"/></td>
<tr id='weekrecord6'><td><select name='project6' onchange="fillActivity('project6','activity6'),clearRecord('6', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity6' onChange="checkActivityDuplicate(6),changeActivity('6','activity6',document.weekly_info.project6.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress6" size='2' readOnly />%</td>
<td><div id='status6_0'></div>
<div><select name='record6_0' onChange='updateTotalTime(6,0);' disabled></select><a href="#" onClick="callDailyNote(0,6,false)"'><img name='note6_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note6_0" type="hidden"/>
<input name="progress6_0" type="hidden"/></td>
<td><div id='status6_1'></div>
<div><select name='record6_1' onChange='updateTotalTime(6,1);' disabled></select><a href="#" onClick="callDailyNote(1,6,false)"'><img name='note6_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note6_1" type="hidden"/>
<input name="progress6_1" type="hidden"/></td>
<td><div id='status6_2'></div>
<div><select name='record6_2' onChange='updateTotalTime(6,2);' disabled></select><a href="#" onClick="callDailyNote(2,6,false)"'><img name='note6_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note6_2" type="hidden"/>
<input name="progress6_2" type="hidden"/></td>
<td><div id='status6_3'></div>
<div><select name='record6_3' onChange='updateTotalTime(6,3);' disabled></select><a href="#" onClick="callDailyNote(3,6,false)"'><img name='note6_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note6_3" type="hidden"/>
<input name="progress6_3" type="hidden"/></td>
<td><div id='status6_4'></div>
<div><select name='record6_4' onChange='updateTotalTime(6,4);' disabled></select><a href="#" onClick="callDailyNote(4,6,false)"'><img name='note6_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note6_4" type="hidden"/>
<input name="progress6_4" type="hidden"/></td>
<td><div id='status6_5'></div>
<div><select name='record6_5' onChange='updateTotalTime(6,5);' disabled></select><a href="#" onClick="callDailyNote(5,6,false)"'><img name='note6_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note6_5" type="hidden"/>
<input name="progress6_5" type="hidden"/></td>
<td><div id='status6_6'></div>
<div><select name='record6_6' onChange='updateTotalTime(6,6);' disabled></select><a href="#" onClick="callDailyNote(6,6,false)"'><img name='note6_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note6_6" type="hidden"/>
<input name="progress6_6" type="hidden"/></td>
<tr id='weekrecord7'><td><select name='project7' onchange="fillActivity('project7','activity7'),clearRecord('7', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity7' onChange="checkActivityDuplicate(7),changeActivity('7','activity7',document.weekly_info.project7.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress7" size='2' readOnly />%</td>
<td><div id='status7_0'></div>
<div><select name='record7_0' onChange='updateTotalTime(7,0);' disabled></select><a href="#" onClick="callDailyNote(0,7,false)"'><img name='note7_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note7_0" type="hidden"/>
<input name="progress7_0" type="hidden"/></td>
<td><div id='status7_1'></div>
<div><select name='record7_1' onChange='updateTotalTime(7,1);' disabled></select><a href="#" onClick="callDailyNote(1,7,false)"'><img name='note7_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note7_1" type="hidden"/>
<input name="progress7_1" type="hidden"/></td>
<td><div id='status7_2'></div>
<div><select name='record7_2' onChange='updateTotalTime(7,2);' disabled></select><a href="#" onClick="callDailyNote(2,7,false)"'><img name='note7_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note7_2" type="hidden"/>
<input name="progress7_2" type="hidden"/></td>
<td><div id='status7_3'></div>
<div><select name='record7_3' onChange='updateTotalTime(7,3);' disabled></select><a href="#" onClick="callDailyNote(3,7,false)"'><img name='note7_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note7_3" type="hidden"/>
<input name="progress7_3" type="hidden"/></td>
<td><div id='status7_4'></div>
<div><select name='record7_4' onChange='updateTotalTime(7,4);' disabled></select><a href="#" onClick="callDailyNote(4,7,false)"'><img name='note7_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note7_4" type="hidden"/>
<input name="progress7_4" type="hidden"/></td>
<td><div id='status7_5'></div>
<div><select name='record7_5' onChange='updateTotalTime(7,5);' disabled></select><a href="#" onClick="callDailyNote(5,7,false)"'><img name='note7_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note7_5" type="hidden"/>
<input name="progress7_5" type="hidden"/></td>
<td><div id='status7_6'></div>
<div><select name='record7_6' onChange='updateTotalTime(7,6);' disabled></select><a href="#" onClick="callDailyNote(6,7,false)"'><img name='note7_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note7_6" type="hidden"/>
<input name="progress7_6" type="hidden"/></td>
<tr id='weekrecord8'><td><select name='project8' onchange="fillActivity('project8','activity8'),clearRecord('8', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity8' onChange="checkActivityDuplicate(8),changeActivity('8','activity8',document.weekly_info.project8.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress8" size='2' readOnly />%</td>
<td><div id='status8_0'></div>
<div><select name='record8_0' onChange='updateTotalTime(8,0);' disabled></select><a href="#" onClick="callDailyNote(0,8,false)"'><img name='note8_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note8_0" type="hidden"/>
<input name="progress8_0" type="hidden"/></td>
<td><div id='status8_1'></div>
<div><select name='record8_1' onChange='updateTotalTime(8,1);' disabled></select><a href="#" onClick="callDailyNote(1,8,false)"'><img name='note8_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note8_1" type="hidden"/>
<input name="progress8_1" type="hidden"/></td>
<td><div id='status8_2'></div>
<div><select name='record8_2' onChange='updateTotalTime(8,2);' disabled></select><a href="#" onClick="callDailyNote(2,8,false)"'><img name='note8_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note8_2" type="hidden"/>
<input name="progress8_2" type="hidden"/></td>
<td><div id='status8_3'></div>
<div><select name='record8_3' onChange='updateTotalTime(8,3);' disabled></select><a href="#" onClick="callDailyNote(3,8,false)"'><img name='note8_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note8_3" type="hidden"/>
<input name="progress8_3" type="hidden"/></td>
<td><div id='status8_4'></div>
<div><select name='record8_4' onChange='updateTotalTime(8,4);' disabled></select><a href="#" onClick="callDailyNote(4,8,false)"'><img name='note8_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note8_4" type="hidden"/>
<input name="progress8_4" type="hidden"/></td>
<td><div id='status8_5'></div>
<div><select name='record8_5' onChange='updateTotalTime(8,5);' disabled></select><a href="#" onClick="callDailyNote(5,8,false)"'><img name='note8_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note8_5" type="hidden"/>
<input name="progress8_5" type="hidden"/></td>
<td><div id='status8_6'></div>
<div><select name='record8_6' onChange='updateTotalTime(8,6);' disabled></select><a href="#" onClick="callDailyNote(6,8,false)"'><img name='note8_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note8_6" type="hidden"/>
<input name="progress8_6" type="hidden"/></td>
<tr id='weekrecord9'><td><select name='project9' onchange="fillActivity('project9','activity9'),clearRecord('9', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity9' onChange="checkActivityDuplicate(9),changeActivity('9','activity9',document.weekly_info.project9.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress9" size='2' readOnly />%</td>
<td><div id='status9_0'></div>
<div><select name='record9_0' onChange='updateTotalTime(9,0);' disabled></select><a href="#" onClick="callDailyNote(0,9,false)"'><img name='note9_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note9_0" type="hidden"/>
<input name="progress9_0" type="hidden"/></td>
<td><div id='status9_1'></div>
<div><select name='record9_1' onChange='updateTotalTime(9,1);' disabled></select><a href="#" onClick="callDailyNote(1,9,false)"'><img name='note9_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note9_1" type="hidden"/>
<input name="progress9_1" type="hidden"/></td>
<td><div id='status9_2'></div>
<div><select name='record9_2' onChange='updateTotalTime(9,2);' disabled></select><a href="#" onClick="callDailyNote(2,9,false)"'><img name='note9_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note9_2" type="hidden"/>
<input name="progress9_2" type="hidden"/></td>
<td><div id='status9_3'></div>
<div><select name='record9_3' onChange='updateTotalTime(9,3);' disabled></select><a href="#" onClick="callDailyNote(3,9,false)"'><img name='note9_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note9_3" type="hidden"/>
<input name="progress9_3" type="hidden"/></td>
<td><div id='status9_4'></div>
<div><select name='record9_4' onChange='updateTotalTime(9,4);' disabled></select><a href="#" onClick="callDailyNote(4,9,false)"'><img name='note9_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note9_4" type="hidden"/>
<input name="progress9_4" type="hidden"/></td>
<td><div id='status9_5'></div>
<div><select name='record9_5' onChange='updateTotalTime(9,5);' disabled></select><a href="#" onClick="callDailyNote(5,9,false)"'><img name='note9_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note9_5" type="hidden"/>
<input name="progress9_5" type="hidden"/></td>
<td><div id='status9_6'></div>
<div><select name='record9_6' onChange='updateTotalTime(9,6);' disabled></select><a href="#" onClick="callDailyNote(6,9,false)"'><img name='note9_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note9_6" type="hidden"/>
<input name="progress9_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord10'><td><select name="project10" onchange="fillActivity('project10','activity10'),clearRecord('10', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity10' onChange="checkActivityDuplicate(10),changeActivity('10','activity10',document.weekly_info.project10.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress10" size='2' readOnly />%</td>
<td><div id='status10_0'></div>
<div><select name='record10_0' onChange='updateTotalTime(10,0);' disabled></select><a href="#" onClick="callDailyNote(0,10,false)"'><img name='note10_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note10_0" type="hidden"/>
<input name="progress10_0" type="hidden"/></td>
<td><div id='status10_1'></div>
<div><select name='record10_1' onChange='updateTotalTime(10,1);' disabled></select><a href="#" onClick="callDailyNote(1,10,false)"'><img name='note10_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note10_1" type="hidden"/>
<input name="progress10_1" type="hidden"/></td>
<td><div id='status10_2'></div>
<div><select name='record10_2' onChange='updateTotalTime(10,2);' disabled></select><a href="#" onClick="callDailyNote(2,10,false)"'><img name='note10_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note10_2" type="hidden"/>
<input name="progress10_2" type="hidden"/></td>
<td><div id='status10_3'></div>
<div><select name='record10_3' onChange='updateTotalTime(10,3);' disabled></select><a href="#" onClick="callDailyNote(3,10,false)"'><img name='note10_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note10_3" type="hidden"/>
<input name="progress10_3" type="hidden"/></td>
<td><div id='status10_4'></div>
<div><select name='record10_4' onChange='updateTotalTime(10,4);' disabled></select><a href="#" onClick="callDailyNote(4,10,false)"'><img name='note10_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note10_4" type="hidden"/>
<input name="progress10_4" type="hidden"/></td>
<td><div id='status10_5'></div>
<div><select name='record10_5' onChange='updateTotalTime(10,5);' disabled></select><a href="#" onClick="callDailyNote(5,10,false)"'><img name='note10_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note10_5" type="hidden"/>
<input name="progress10_5" type="hidden"/></td>
<td><div id='status10_6'></div>
<div><select name='record10_6' onChange='updateTotalTime(10,6);' disabled></select><a href="#" onClick="callDailyNote(6,10,false)"'><img name='note10_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note10_6" type="hidden"/>
<input name="progress10_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord11'><td><select name="project11" onchange="fillActivity('project11','activity11'),clearRecord('11', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity11' onChange="checkActivityDuplicate(11),changeActivity('11','activity11',document.weekly_info.project11.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress11" size='2' readOnly />%</td>
<td><div id='status11_0'></div>
<div><select name='record11_0' onChange='updateTotalTime(11,0);' disabled></select><a href="#" onClick="callDailyNote(0,11,false)"'><img name='note11_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note11_0" type="hidden"/>
<input name="progress11_0" type="hidden"/></td>
<td><div id='status11_1'></div>
<div><select name='record11_1' onChange='updateTotalTime(11,1);' disabled></select><a href="#" onClick="callDailyNote(1,11,false)"'><img name='note11_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note11_1" type="hidden"/>
<input name="progress11_1" type="hidden"/></td>
<td><div id='status11_2'></div>
<div><select name='record11_2' onChange='updateTotalTime(11,2);' disabled></select><a href="#" onClick="callDailyNote(2,11,false)"'><img name='note11_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note11_2" type="hidden"/>
<input name="progress11_2" type="hidden"/></td>
<td><div id='status11_3'></div>
<div><select name='record11_3' onChange='updateTotalTime(11,3);' disabled></select><a href="#" onClick="callDailyNote(3,11,false)"'><img name='note11_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note11_3" type="hidden"/>
<input name="progress11_3" type="hidden"/></td>
<td><div id='status11_4'></div>
<div><select name='record11_4' onChange='updateTotalTime(11,4);' disabled></select><a href="#" onClick="callDailyNote(4,11,false)"'><img name='note11_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note11_4" type="hidden"/>
<input name="progress11_4" type="hidden"/></td>
<td><div id='status11_5'></div>
<div><select name='record11_5' onChange='updateTotalTime(11,5);' disabled></select><a href="#" onClick="callDailyNote(5,11,false)"'><img name='note11_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note11_5" type="hidden"/>
<input name="progress11_5" type="hidden"/></td>
<td><div id='status11_6'></div>
<div><select name='record11_6' onChange='updateTotalTime(11,6);' disabled></select><a href="#" onClick="callDailyNote(6,11,false)"'><img name='note11_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note11_6" type="hidden"/>
<input name="progress11_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord12'><td><select name="project12" onchange="fillActivity('project12','activity12'),clearRecord('12', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity12' onChange="checkActivityDuplicate(12),changeActivity('12','activity12',document.weekly_info.project12.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress12" size='2' readOnly />%</td>
<td><div id='status12_0'></div>
<div><select name='record12_0' onChange='updateTotalTime(12,0);' disabled></select><a href="#" onClick="callDailyNote(0,12,false)"'><img name='note12_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note12_0" type="hidden"/>
<input name="progress12_0" type="hidden"/></td>
<td><div id='status12_1'></div>
<div><select name='record12_1' onChange='updateTotalTime(12,1);' disabled></select><a href="#" onClick="callDailyNote(1,12,false)"'><img name='note12_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note12_1" type="hidden"/>
<input name="progress12_1" type="hidden"/></td>
<td><div id='status12_2'></div>
<div><select name='record12_2' onChange='updateTotalTime(12,2);' disabled></select><a href="#" onClick="callDailyNote(2,12,false)"'><img name='note12_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note12_2" type="hidden"/>
<input name="progress12_2" type="hidden"/></td>
<td><div id='status12_3'></div>
<div><select name='record12_3' onChange='updateTotalTime(12,3);' disabled></select><a href="#" onClick="callDailyNote(3,12,false)"'><img name='note12_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note12_3" type="hidden"/>
<input name="progress12_3" type="hidden"/></td>
<td><div id='status12_4'></div>
<div><select name='record12_4' onChange='updateTotalTime(12,4);' disabled></select><a href="#" onClick="callDailyNote(4,12,false)"'><img name='note12_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note12_4" type="hidden"/>
<input name="progress12_4" type="hidden"/></td>
<td><div id='status12_5'></div>
<div><select name='record12_5' onChange='updateTotalTime(12,5);' disabled></select><a href="#" onClick="callDailyNote(5,12,false)"'><img name='note12_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note12_5" type="hidden"/>
<input name="progress12_5" type="hidden"/></td>
<td><div id='status12_6'></div>
<div><select name='record12_6' onChange='updateTotalTime(12,6);' disabled></select><a href="#" onClick="callDailyNote(6,12,false)"'><img name='note12_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note12_6" type="hidden"/>
<input name="progress12_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord13'><td><select name="project13" onchange="fillActivity('project13','activity13'),clearRecord('13', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity13' onChange="checkActivityDuplicate(13),changeActivity('13','activity13',document.weekly_info.project13.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress13" size='2' readOnly />%</td>
<td><div id='status13_0'></div>
<div><select name='record13_0' onChange='updateTotalTime(13,0);' disabled></select><a href="#" onClick="callDailyNote(0,13,false)"'><img name='note13_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note13_0" type="hidden"/>
<input name="progress13_0" type="hidden"/></td>
<td><div id='status13_1'></div>
<div><select name='record13_1' onChange='updateTotalTime(13,1);' disabled></select><a href="#" onClick="callDailyNote(1,13,false)"'><img name='note13_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note13_1" type="hidden"/>
<input name="progress13_1" type="hidden"/></td>
<td><div id='status13_2'></div>
<div><select name='record13_2' onChange='updateTotalTime(13,2);' disabled></select><a href="#" onClick="callDailyNote(2,13,false)"'><img name='note13_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note13_2" type="hidden"/>
<input name="progress13_2" type="hidden"/></td>
<td><div id='status13_3'></div>
<div><select name='record13_3' onChange='updateTotalTime(13,3);' disabled></select><a href="#" onClick="callDailyNote(3,13,false)"'><img name='note13_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note13_3" type="hidden"/>
<input name="progress13_3" type="hidden"/></td>
<td><div id='status13_4'></div>
<div><select name='record13_4' onChange='updateTotalTime(13,4);' disabled></select><a href="#" onClick="callDailyNote(4,13,false)"'><img name='note13_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note13_4" type="hidden"/>
<input name="progress13_4" type="hidden"/></td>
<td><div id='status13_5'></div>
<div><select name='record13_5' onChange='updateTotalTime(13,5);' disabled></select><a href="#" onClick="callDailyNote(5,13,false)"'><img name='note13_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note13_5" type="hidden"/>
<input name="progress13_5" type="hidden"/></td>
<td><div id='status13_6'></div>
<div><select name='record13_6' onChange='updateTotalTime(13,6);' disabled></select><a href="#" onClick="callDailyNote(6,13,false)"'><img name='note13_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note13_6" type="hidden"/>
<input name="progress13_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord14'><td><select name="project14" onchange="fillActivity('project14','activity14'),clearRecord('14', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity14' onChange="checkActivityDuplicate(14),changeActivity('14','activity14',document.weekly_info.project14.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress14" size='2' readOnly />%</td>
<td><div id='status14_0'></div>
<div><select name='record14_0' onChange='updateTotalTime(14,0);' disabled></select><a href="#" onClick="callDailyNote(0,14,false)"'><img name='note14_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note14_0" type="hidden"/>
<input name="progress14_0" type="hidden"/></td>
<td><div id='status14_1'></div>
<div><select name='record14_1' onChange='updateTotalTime(14,1);' disabled></select><a href="#" onClick="callDailyNote(1,14,false)"'><img name='note14_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note14_1" type="hidden"/>
<input name="progress14_1" type="hidden"/></td>
<td><div id='status14_2'></div>
<div><select name='record14_2' onChange='updateTotalTime(14,2);' disabled></select><a href="#" onClick="callDailyNote(2,14,false)"'><img name='note14_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note14_2" type="hidden"/>
<input name="progress14_2" type="hidden"/></td>
<td><div id='status14_3'></div>
<div><select name='record14_3' onChange='updateTotalTime(14,3);' disabled></select><a href="#" onClick="callDailyNote(3,14,false)"'><img name='note14_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note14_3" type="hidden"/>
<input name="progress14_3" type="hidden"/></td>
<td><div id='status14_4'></div>
<div><select name='record14_4' onChange='updateTotalTime(14,4);' disabled></select><a href="#" onClick="callDailyNote(4,14,false)"'><img name='note14_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note14_4" type="hidden"/>
<input name="progress14_4" type="hidden"/></td>
<td><div id='status14_5'></div>
<div><select name='record14_5' onChange='updateTotalTime(14,5);' disabled></select><a href="#" onClick="callDailyNote(5,14,false)"'><img name='note14_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note14_5" type="hidden"/>
<input name="progress14_5" type="hidden"/></td>
<td><div id='status14_6'></div>
<div><select name='record14_6' onChange='updateTotalTime(14,6);' disabled></select><a href="#" onClick="callDailyNote(6,14,false)"'><img name='note14_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note14_6" type="hidden"/>
<input name="progress14_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord15'><td><select name="project15" onchange="fillActivity('project15','activity15'),clearRecord('15', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity15' onChange="checkActivityDuplicate(15),changeActivity('15','activity15',document.weekly_info.project15.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress15" size='2' readOnly />%</td>
<td><div id='status15_0'></div>
<div><select name='record15_0' onChange='updateTotalTime(15,0);' disabled></select><a href="#" onClick="callDailyNote(0,15,false)"'><img name='note15_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note15_0" type="hidden"/>
<input name="progress15_0" type="hidden"/></td>
<td><div id='status15_1'></div>
<div><select name='record15_1' onChange='updateTotalTime(15,1);' disabled></select><a href="#" onClick="callDailyNote(1,15,false)"'><img name='note15_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note15_1" type="hidden"/>
<input name="progress15_1" type="hidden"/></td>
<td><div id='status15_2'></div>
<div><select name='record15_2' onChange='updateTotalTime(15,2);' disabled></select><a href="#" onClick="callDailyNote(2,15,false)"'><img name='note15_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note15_2" type="hidden"/>
<input name="progress15_2" type="hidden"/></td>
<td><div id='status15_3'></div>
<div><select name='record15_3' onChange='updateTotalTime(15,3);' disabled></select><a href="#" onClick="callDailyNote(3,15,false)"'><img name='note15_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note15_3" type="hidden"/>
<input name="progress15_3" type="hidden"/></td>
<td><div id='status15_4'></div>
<div><select name='record15_4' onChange='updateTotalTime(15,4);' disabled></select><a href="#" onClick="callDailyNote(4,15,false)"'><img name='note15_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note15_4" type="hidden"/>
<input name="progress15_4" type="hidden"/></td>
<td><div id='status15_5'></div>
<div><select name='record15_5' onChange='updateTotalTime(15,5);' disabled></select><a href="#" onClick="callDailyNote(5,15,false)"'><img name='note15_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note15_5" type="hidden"/>
<input name="progress15_5" type="hidden"/></td>
<td><div id='status15_6'></div>
<div><select name='record15_6' onChange='updateTotalTime(15,6);' disabled></select><a href="#" onClick="callDailyNote(6,15,false)"'><img name='note15_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note15_6" type="hidden"/>
<input name="progress15_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord16'><td><select name="project16" onchange="fillActivity('project16','activity16'),clearRecord('16', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity16' onChange="checkActivityDuplicate(16),changeActivity('16','activity16',document.weekly_info.project16.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress16" size='2' readOnly />%</td>
<td><div id='status16_0'></div>
<div><select name='record16_0' onChange='updateTotalTime(16,0);' disabled></select><a href="#" onClick="callDailyNote(0,16,false)"'><img name='note16_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note16_0" type="hidden"/>
<input name="progress16_0" type="hidden"/></td>
<td><div id='status16_1'></div>
<div><select name='record16_1' onChange='updateTotalTime(16,1);' disabled></select><a href="#" onClick="callDailyNote(1,16,false)"'><img name='note16_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note16_1" type="hidden"/>
<input name="progress16_1" type="hidden"/></td>
<td><div id='status16_2'></div>
<div><select name='record16_2' onChange='updateTotalTime(16,2);' disabled></select><a href="#" onClick="callDailyNote(2,16,false)"'><img name='note16_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note16_2" type="hidden"/>
<input name="progress16_2" type="hidden"/></td>
<td><div id='status16_3'></div>
<div><select name='record16_3' onChange='updateTotalTime(16,3);' disabled></select><a href="#" onClick="callDailyNote(3,16,false)"'><img name='note16_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note16_3" type="hidden"/>
<input name="progress16_3" type="hidden"/></td>
<td><div id='status16_4'></div>
<div><select name='record16_4' onChange='updateTotalTime(16,4);' disabled></select><a href="#" onClick="callDailyNote(4,16,false)"'><img name='note16_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note16_4" type="hidden"/>
<input name="progress16_4" type="hidden"/></td>
<td><div id='status16_5'></div>
<div><select name='record16_5' onChange='updateTotalTime(16,5);' disabled></select><a href="#" onClick="callDailyNote(5,16,false)"'><img name='note16_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note16_5" type="hidden"/>
<input name="progress16_5" type="hidden"/></td>
<td><div id='status16_6'></div>
<div><select name='record16_6' onChange='updateTotalTime(16,6);' disabled></select><a href="#" onClick="callDailyNote(6,16,false)"'><img name='note16_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note16_6" type="hidden"/>
<input name="progress16_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord17'><td><select name="project17" onchange="fillActivity('project17','activity17'),clearRecord('17', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity17' onChange="checkActivityDuplicate(17),changeActivity('17','activity17',document.weekly_info.project17.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress17" size='2' readOnly />%</td>
<td><div id='status17_0'></div>
<div><select name='record17_0' onChange='updateTotalTime(17,0);' disabled></select><a href="#" onClick="callDailyNote(0,17,false)"'><img name='note17_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note17_0" type="hidden"/>
<input name="progress17_0" type="hidden"/></td>
<td><div id='status17_1'></div>
<div><select name='record17_1' onChange='updateTotalTime(17,1);' disabled></select><a href="#" onClick="callDailyNote(1,17,false)"'><img name='note17_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note17_1" type="hidden"/>
<input name="progress17_1" type="hidden"/></td>
<td><div id='status17_2'></div>
<div><select name='record17_2' onChange='updateTotalTime(17,2);' disabled></select><a href="#" onClick="callDailyNote(2,17,false)"'><img name='note17_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note17_2" type="hidden"/>
<input name="progress17_2" type="hidden"/></td>
<td><div id='status17_3'></div>
<div><select name='record17_3' onChange='updateTotalTime(17,3);' disabled></select><a href="#" onClick="callDailyNote(3,17,false)"'><img name='note17_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note17_3" type="hidden"/>
<input name="progress17_3" type="hidden"/></td>
<td><div id='status17_4'></div>
<div><select name='record17_4' onChange='updateTotalTime(17,4);' disabled></select><a href="#" onClick="callDailyNote(4,17,false)"'><img name='note17_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note17_4" type="hidden"/>
<input name="progress17_4" type="hidden"/></td>
<td><div id='status17_5'></div>
<div><select name='record17_5' onChange='updateTotalTime(17,5);' disabled></select><a href="#" onClick="callDailyNote(5,17,false)"'><img name='note17_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note17_5" type="hidden"/>
<input name="progress17_5" type="hidden"/></td>
<td><div id='status17_6'></div>
<div><select name='record17_6' onChange='updateTotalTime(17,6);' disabled></select><a href="#" onClick="callDailyNote(6,17,false)"'><img name='note17_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note17_6" type="hidden"/>
<input name="progress17_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord18'><td><select name="project18" onchange="fillActivity('project18','activity18'),clearRecord('18', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity18' onChange="checkActivityDuplicate(18),changeActivity('18','activity18',document.weekly_info.project18.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress18" size='2' readOnly />%</td>
<td><div id='status18_0'></div>
<div><select name='record18_0' onChange='updateTotalTime(18,0);' disabled></select><a href="#" onClick="callDailyNote(0,18,false)"'><img name='note18_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note18_0" type="hidden"/>
<input name="progress18_0" type="hidden"/></td>
<td><div id='status18_1'></div>
<div><select name='record18_1' onChange='updateTotalTime(18,1);' disabled></select><a href="#" onClick="callDailyNote(1,18,false)"'><img name='note18_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note18_1" type="hidden"/>
<input name="progress18_1" type="hidden"/></td>
<td><div id='status18_2'></div>
<div><select name='record18_2' onChange='updateTotalTime(18,2);' disabled></select><a href="#" onClick="callDailyNote(2,18,false)"'><img name='note18_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note18_2" type="hidden"/>
<input name="progress18_2" type="hidden"/></td>
<td><div id='status18_3'></div>
<div><select name='record18_3' onChange='updateTotalTime(18,3);' disabled></select><a href="#" onClick="callDailyNote(3,18,false)"'><img name='note18_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note18_3" type="hidden"/>
<input name="progress18_3" type="hidden"/></td>
<td><div id='status18_4'></div>
<div><select name='record18_4' onChange='updateTotalTime(18,4);' disabled></select><a href="#" onClick="callDailyNote(4,18,false)"'><img name='note18_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note18_4" type="hidden"/>
<input name="progress18_4" type="hidden"/></td>
<td><div id='status18_5'></div>
<div><select name='record18_5' onChange='updateTotalTime(18,5);' disabled></select><a href="#" onClick="callDailyNote(5,18,false)"'><img name='note18_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note18_5" type="hidden"/>
<input name="progress18_5" type="hidden"/></td>
<td><div id='status18_6'></div>
<div><select name='record18_6' onChange='updateTotalTime(18,6);' disabled></select><a href="#" onClick="callDailyNote(6,18,false)"'><img name='note18_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note18_6" type="hidden"/>
<input name="progress18_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord19'><td><select name="project19" onchange="fillActivity('project19','activity19'),clearRecord('19', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity19' onChange="checkActivityDuplicate(19),changeActivity('19','activity19',document.weekly_info.project19.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress19" size='2' readOnly />%</td>
<td><div id='status19_0'></div>
<div><select name='record19_0' onChange='updateTotalTime(19,0);' disabled></select><a href="#" onClick="callDailyNote(0,19,false)"'><img name='note19_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note19_0" type="hidden"/>
<input name="progress19_0" type="hidden"/></td>
<td><div id='status19_1'></div>
<div><select name='record19_1' onChange='updateTotalTime(19,1);' disabled></select><a href="#" onClick="callDailyNote(1,19,false)"'><img name='note19_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note19_1" type="hidden"/>
<input name="progress19_1" type="hidden"/></td>
<td><div id='status19_2'></div>
<div><select name='record19_2' onChange='updateTotalTime(19,2);' disabled></select><a href="#" onClick="callDailyNote(2,19,false)"'><img name='note19_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note19_2" type="hidden"/>
<input name="progress19_2" type="hidden"/></td>
<td><div id='status19_3'></div>
<div><select name='record19_3' onChange='updateTotalTime(19,3);' disabled></select><a href="#" onClick="callDailyNote(3,19,false)"'><img name='note19_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note19_3" type="hidden"/>
<input name="progress19_3" type="hidden"/></td>
<td><div id='status19_4'></div>
<div><select name='record19_4' onChange='updateTotalTime(19,4);' disabled></select><a href="#" onClick="callDailyNote(4,19,false)"'><img name='note19_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note19_4" type="hidden"/>
<input name="progress19_4" type="hidden"/></td>
<td><div id='status19_5'></div>
<div><select name='record19_5' onChange='updateTotalTime(19,5);' disabled></select><a href="#" onClick="callDailyNote(5,19,false)"'><img name='note19_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note19_5" type="hidden"/>
<input name="progress19_5" type="hidden"/></td>
<td><div id='status19_6'></div>
<div><select name='record19_6' onChange='updateTotalTime(19,6);' disabled></select><a href="#" onClick="callDailyNote(6,19,false)"'><img name='note19_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note19_6" type="hidden"/>
<input name="progress19_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord20'><td><select name="project20" onchange="fillActivity('project20','activity20'),clearRecord('20', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity20' onChange="checkActivityDuplicate(20),changeActivity('20','activity20',document.weekly_info.project20.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress20" size='2' readOnly />%</td>
<td><div id='status20_0'></div>
<div><select name='record20_0' onChange='updateTotalTime(20,0);' disabled></select><a href="#" onClick="callDailyNote(0,20,false)"'><img name='note20_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note20_0" type="hidden"/>
<input name="progress20_0" type="hidden"/></td>
<td><div id='status20_1'></div>
<div><select name='record20_1' onChange='updateTotalTime(20,1);' disabled></select><a href="#" onClick="callDailyNote(1,20,false)"'><img name='note20_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note20_1" type="hidden"/>
<input name="progress20_1" type="hidden"/></td>
<td><div id='status20_2'></div>
<div><select name='record20_2' onChange='updateTotalTime(20,2);' disabled></select><a href="#" onClick="callDailyNote(2,20,false)"'><img name='note20_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note20_2" type="hidden"/>
<input name="progress20_2" type="hidden"/></td>
<td><div id='status20_3'></div>
<div><select name='record20_3' onChange='updateTotalTime(20,3);' disabled></select><a href="#" onClick="callDailyNote(3,20,false)"'><img name='note20_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note20_3" type="hidden"/>
<input name="progress20_3" type="hidden"/></td>
<td><div id='status20_4'></div>
<div><select name='record20_4' onChange='updateTotalTime(20,4);' disabled></select><a href="#" onClick="callDailyNote(4,20,false)"'><img name='note20_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note20_4" type="hidden"/>
<input name="progress20_4" type="hidden"/></td>
<td><div id='status20_5'></div>
<div><select name='record20_5' onChange='updateTotalTime(20,5);' disabled></select><a href="#" onClick="callDailyNote(5,20,false)"'><img name='note20_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note20_5" type="hidden"/>
<input name="progress20_5" type="hidden"/></td>
<td><div id='status20_6'></div>
<div><select name='record20_6' onChange='updateTotalTime(20,6);' disabled></select><a href="#" onClick="callDailyNote(6,20,false)"'><img name='note20_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note20_6" type="hidden"/>
<input name="progress20_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord21'><td><select name="project21" onchange="fillActivity('project21','activity21'),clearRecord('21', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity21' onChange="checkActivityDuplicate(21),changeActivity('21','activity21',document.weekly_info.project21.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress21" size='2' readOnly />%</td>
<td><div id='status21_0'></div>
<div><select name='record21_0' onChange='updateTotalTime(21,0);' disabled></select><a href="#" onClick="callDailyNote(0,21,false)"'><img name='note21_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note21_0" type="hidden"/>
<input name="progress21_0" type="hidden"/></td>
<td><div id='status21_1'></div>
<div><select name='record21_1' onChange='updateTotalTime(21,1);' disabled></select><a href="#" onClick="callDailyNote(1,21,false)"'><img name='note21_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note21_1" type="hidden"/>
<input name="progress21_1" type="hidden"/></td>
<td><div id='status21_2'></div>
<div><select name='record21_2' onChange='updateTotalTime(21,2);' disabled></select><a href="#" onClick="callDailyNote(2,21,false)"'><img name='note21_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note21_2" type="hidden"/>
<input name="progress21_2" type="hidden"/></td>
<td><div id='status21_3'></div>
<div><select name='record21_3' onChange='updateTotalTime(21,3);' disabled></select><a href="#" onClick="callDailyNote(3,21,false)"'><img name='note21_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note21_3" type="hidden"/>
<input name="progress21_3" type="hidden"/></td>
<td><div id='status21_4'></div>
<div><select name='record21_4' onChange='updateTotalTime(21,4);' disabled></select><a href="#" onClick="callDailyNote(4,21,false)"'><img name='note21_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note21_4" type="hidden"/>
<input name="progress21_4" type="hidden"/></td>
<td><div id='status21_5'></div>
<div><select name='record21_5' onChange='updateTotalTime(21,5);' disabled></select><a href="#" onClick="callDailyNote(5,21,false)"'><img name='note21_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note21_5" type="hidden"/>
<input name="progress21_5" type="hidden"/></td>
<td><div id='status21_6'></div>
<div><select name='record21_6' onChange='updateTotalTime(21,6);' disabled></select><a href="#" onClick="callDailyNote(6,21,false)"'><img name='note21_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note21_6" type="hidden"/>
<input name="progress21_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord22'><td><select name="project22" onchange="fillActivity('project22','activity22'),clearRecord('22', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity22' onChange="checkActivityDuplicate(22),changeActivity('22','activity22',document.weekly_info.project22.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress22" size='2' readOnly />%</td>
<td><div id='status22_0'></div>
<div><select name='record22_0' onChange='updateTotalTime(22,0);' disabled></select><a href="#" onClick="callDailyNote(0,22,false)"'><img name='note22_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note22_0" type="hidden"/>
<input name="progress22_0" type="hidden"/></td>
<td><div id='status22_1'></div>
<div><select name='record22_1' onChange='updateTotalTime(22,1);' disabled></select><a href="#" onClick="callDailyNote(1,22,false)"'><img name='note22_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note22_1" type="hidden"/>
<input name="progress22_1" type="hidden"/></td>
<td><div id='status22_2'></div>
<div><select name='record22_2' onChange='updateTotalTime(22,2);' disabled></select><a href="#" onClick="callDailyNote(2,22,false)"'><img name='note22_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note22_2" type="hidden"/>
<input name="progress22_2" type="hidden"/></td>
<td><div id='status22_3'></div>
<div><select name='record22_3' onChange='updateTotalTime(22,3);' disabled></select><a href="#" onClick="callDailyNote(3,22,false)"'><img name='note22_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note22_3" type="hidden"/>
<input name="progress22_3" type="hidden"/></td>
<td><div id='status22_4'></div>
<div><select name='record22_4' onChange='updateTotalTime(22,4);' disabled></select><a href="#" onClick="callDailyNote(4,22,false)"'><img name='note22_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note22_4" type="hidden"/>
<input name="progress22_4" type="hidden"/></td>
<td><div id='status22_5'></div>
<div><select name='record22_5' onChange='updateTotalTime(22,5);' disabled></select><a href="#" onClick="callDailyNote(5,22,false)"'><img name='note22_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note22_5" type="hidden"/>
<input name="progress22_5" type="hidden"/></td>
<td><div id='status22_6'></div>
<div><select name='record22_6' onChange='updateTotalTime(22,6);' disabled></select><a href="#" onClick="callDailyNote(6,22,false)"'><img name='note22_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note22_6" type="hidden"/>
<input name="progress22_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord23'><td><select name="project23" onchange="fillActivity('project23','activity23'),clearRecord('23', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity23' onChange="checkActivityDuplicate(23),changeActivity('23','activity23',document.weekly_info.project23.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress23" size='2' readOnly />%</td>
<td><div id='status23_0'></div>
<div><select name='record23_0' onChange='updateTotalTime(23,0);' disabled></select><a href="#" onClick="callDailyNote(0,23,false)"'><img name='note23_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note23_0" type="hidden"/>
<input name="progress23_0" type="hidden"/></td>
<td><div id='status23_1'></div>
<div><select name='record23_1' onChange='updateTotalTime(23,1);' disabled></select><a href="#" onClick="callDailyNote(1,23,false)"'><img name='note23_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note23_1" type="hidden"/>
<input name="progress23_1" type="hidden"/></td>
<td><div id='status23_2'></div>
<div><select name='record23_2' onChange='updateTotalTime(23,2);' disabled></select><a href="#" onClick="callDailyNote(2,23,false)"'><img name='note23_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note23_2" type="hidden"/>
<input name="progress23_2" type="hidden"/></td>
<td><div id='status23_3'></div>
<div><select name='record23_3' onChange='updateTotalTime(23,3);' disabled></select><a href="#" onClick="callDailyNote(3,23,false)"'><img name='note23_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note23_3" type="hidden"/>
<input name="progress23_3" type="hidden"/></td>
<td><div id='status23_4'></div>
<div><select name='record23_4' onChange='updateTotalTime(23,4);' disabled></select><a href="#" onClick="callDailyNote(4,23,false)"'><img name='note23_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note23_4" type="hidden"/>
<input name="progress23_4" type="hidden"/></td>
<td><div id='status23_5'></div>
<div><select name='record23_5' onChange='updateTotalTime(23,5);' disabled></select><a href="#" onClick="callDailyNote(5,23,false)"'><img name='note23_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note23_5" type="hidden"/>
<input name="progress23_5" type="hidden"/></td>
<td><div id='status23_6'></div>
<div><select name='record23_6' onChange='updateTotalTime(23,6);' disabled></select><a href="#" onClick="callDailyNote(6,23,false)"'><img name='note23_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note23_6" type="hidden"/>
<input name="progress23_6" type="hidden"/></td>
<tr style='display:none' id='weekrecord24'><td><select name="project24" onchange="fillActivity('project24','activity24'),clearRecord('24', 'Sun');">
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='activity24' onChange="checkActivityDuplicate(24),changeActivity('24','activity24',document.weekly_info.project24.selectedIndex-1, 'Sun');">
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="actprogress24" size='2' readOnly />%</td>
<td><div id='status24_0'></div>
<div><select name='record24_0' onChange='updateTotalTime(24,0);' disabled></select><a href="#" onClick="callDailyNote(0,24,false)"'><img name='note24_0' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note24_0" type="hidden"/>
<input name="progress24_0" type="hidden"/></td>
<td><div id='status24_1'></div>
<div><select name='record24_1' onChange='updateTotalTime(24,1);' disabled></select><a href="#" onClick="callDailyNote(1,24,false)"'><img name='note24_1' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note24_1" type="hidden"/>
<input name="progress24_1" type="hidden"/></td>
<td><div id='status24_2'></div>
<div><select name='record24_2' onChange='updateTotalTime(24,2);' disabled></select><a href="#" onClick="callDailyNote(2,24,false)"'><img name='note24_2' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note24_2" type="hidden"/>
<input name="progress24_2" type="hidden"/></td>
<td><div id='status24_3'></div>
<div><select name='record24_3' onChange='updateTotalTime(24,3);' disabled></select><a href="#" onClick="callDailyNote(3,24,false)"'><img name='note24_3' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note24_3" type="hidden"/>
<input name="progress24_3" type="hidden"/></td>
<td><div id='status24_4'></div>
<div><select name='record24_4' onChange='updateTotalTime(24,4);' disabled></select><a href="#" onClick="callDailyNote(4,24,false)"'><img name='note24_4' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note24_4" type="hidden"/>
<input name="progress24_4" type="hidden"/></td>
<td><div id='status24_5'></div>
<div><select name='record24_5' onChange='updateTotalTime(24,5);' disabled></select><a href="#" onClick="callDailyNote(5,24,false)"'><img name='note24_5' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note24_5" type="hidden"/>
<input name="progress24_5" type="hidden"/></td>
<td><div id='status24_6'></div>
<div><select name='record24_6' onChange='updateTotalTime(24,6);' disabled></select><a href="#" onClick="callDailyNote(6,24,false)"'><img name='note24_6' src="img/note.png" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="note24_6" type="hidden"/>
<input name="progress24_6" type="hidden"/></td>

</tr>


        <tr>

    <td colspan='3' align='right'><b>subtotal : &nbsp;</b></td>
    <td><input type="text" name='norTotal0' size="2" readonly></td>
    <td><input type="text" name="norTotal1" size="2" readonly></td>
    <td><input type="text" name="norTotal2" size="2" readonly></td>
    <td><input type="text" name="norTotal3" size="2" readonly></td>
    <td><input type="text" name="norTotal4" size="2" readonly></td>
    <td><input type="text" name="norTotal5" size="2" readonly></td>
    <td><input type="text" name="norTotal6" size="2" readonly></td>
</tr>


</table>
<script type="text/javascript">

    function callDailyNote(dateNum,rowNum,ifOver) {
        if (!ifOver) {
            var selectActivity = eval("document.weekly_info.activity"+rowNum);
            var selectRecord = eval("document.weekly_info.record"+rowNum+"_"+dateNum);
            if(!selectRecord.disabled){
                var dailyNoteURL = "dailyNote.jsp?activityValue="+selectActivity.value+"&dateNum="+dateNum+"&rowNum="+rowNum+"&date="+weekdate[dateNum];
                window.open(dailyNoteURL,"DailyNote","width=400,height=350,scrollbars=1");
            }
        }
        else{
            var selectOverActivity = eval("document.weekly_info.overactivity"+rowNum);
            var selectOverRecord = eval("document.weekly_info.overrecord"+rowNum+"_"+dateNum);
            if(!selectOverRecord.disabled){
                var dailyNoteURL = "overDailyNote.jsp?activityValue="+selectOverActivity.value+"&dateNum="+dateNum+"&rowNum="+rowNum+"&date="+weekdate[dateNum];
                window.open(dailyNoteURL,"DailyNote","width=400,height=350,scrollbars=1");
            }
        }
    }


    var nextHiddenIndex = 10;
    function addRecordInput() {
        for (i = nextHiddenIndex; i < (nextHiddenIndex+5); i++) {
            eval("weekrecord" + i).style.display = document.all ? "block" : "table-row";
        }
        nextHiddenIndex = nextHiddenIndex + 5;
        if(nextHiddenIndex >= 25) eval("attachMoreLink").style.display = "none";
    }

</script>

<p id="attachMoreLink"><a href="javascript:addRecordInput(), addOverRecordInput()">more time records</a></p>

<script language="JavaScript" type="text/javascript">

    var cal1 = new calendar2(document.forms['form1'].elements['date']);
    cal1.year_scroll = true;
    cal1.time_comp = false;

</script>

<table border='1' cellpadding='1' cellspacing='1' bordercolorlight="#cccccc" bordercolordark="#cccccc">
<input name="caller" type="hidden" value="this_week" />
<tr>
    <td colspan="10" bgcolor="#B3B3B3"><span class="style2 sectionHeader_0"><strong>overtime records</strong></span></td>
</tr>
<tr bgcolor="#B5C3C6">
    <td class="tableHeader"><div align="center">project</div></td>
    <td class="tableHeader"><div align="center">activity</div></td>
    <td class="tableHeader"><div align="center">progress</div></td>
    <script LANGUAGE="JavaScript" type="text/javascript">

        for (i = 0; i < 7; i++) {
            if (i == (weekday-1))
                document.write('<td bgcolor=\'pink\'><b>' + weekdate[i] + '</b><br>' + w[i] + '</td>');
            else
                document.write('<td><b>' + weekdate[i] + '</b><br>' + w[i] + '</td>');
        }

    </script>
<tr id='overrecord0'><td><select name='overproject0' onchange="fillActivity('overproject0','overactivity0'),clearOverRecord('0');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity0' onChange="checkOvertimeActivityDuplicate(0),changeOvertimeActivity('0','overactivity0',document.weekly_info.overproject0.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress0" size='2' readOnly />%</td>
<td><div id='overstatus0_0'></div>
<div><select name='overrecord0_0' onChange='updateOverTotalTime(0,0);' disabled></select><a href="#" onClick="callDailyNote(0,0,true)"><img src="img/note.png" name="overnote0_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote0_0" type="hidden"/>
<input name="overprogress0_0" type="hidden"/></td>
<td><div id='overstatus0_1'></div>
<div><select name='overrecord0_1' onChange='updateOverTotalTime(0,1);' disabled></select><a href="#" onClick="callDailyNote(1,0,true)"><img src="img/note.png" name="overnote0_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote0_1" type="hidden"/>
<input name="overprogress0_1" type="hidden"/></td>
<td><div id='overstatus0_2'></div>
<div><select name='overrecord0_2' onChange='updateOverTotalTime(0,2);' disabled></select><a href="#" onClick="callDailyNote(2,0,true)"><img src="img/note.png" name="overnote0_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote0_2" type="hidden"/>
<input name="overprogress0_2" type="hidden"/></td>
<td><div id='overstatus0_3'></div>
<div><select name='overrecord0_3' onChange='updateOverTotalTime(0,3);' disabled></select><a href="#" onClick="callDailyNote(3,0,true)"><img src="img/note.png" name="overnote0_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote0_3" type="hidden"/>
<input name="overprogress0_3" type="hidden"/></td>
<td><div id='overstatus0_4'></div>
<div><select name='overrecord0_4' onChange='updateOverTotalTime(0,4);' disabled></select><a href="#" onClick="callDailyNote(4,0,true)"><img src="img/note.png" name="overnote0_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote0_4" type="hidden"/>
<input name="overprogress0_4" type="hidden"/></td>
<td><div id='overstatus0_5'></div>
<div><select name='overrecord0_5' onChange='updateOverTotalTime(0,5);' disabled></select><a href="#" onClick="callDailyNote(5,0,true)"><img src="img/note.png" name="overnote0_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote0_5" type="hidden"/>
<input name="overprogress0_5" type="hidden"/></td>
<td><div id='overstatus0_6'></div>
<div><select name='overrecord0_6' onChange='updateOverTotalTime(0,6);' disabled></select><a href="#" onClick="callDailyNote(6,0,true)"><img src="img/note.png" name="overnote0_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote0_6" type="hidden"/>
<input name="overprogress0_6" type="hidden"/></td>
<tr id='overrecord1'><td><select name='overproject1' onchange="fillActivity('overproject1','overactivity1'),clearOverRecord('1');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity1' onChange="checkOvertimeActivityDuplicate(1),changeOvertimeActivity('1','overactivity1',document.weekly_info.overproject1.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress1" size='2' readOnly />%</td>
<td><div id='overstatus1_0'></div>
<div><select name='overrecord1_0' onChange='updateOverTotalTime(1,0);' disabled></select><a href="#" onClick="callDailyNote(0,1,true)"><img src="img/note.png" name="overnote1_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote1_0" type="hidden"/>
<input name="overprogress1_0" type="hidden"/></td>
<td><div id='overstatus1_1'></div>
<div><select name='overrecord1_1' onChange='updateOverTotalTime(1,1);' disabled></select><a href="#" onClick="callDailyNote(1,1,true)"><img src="img/note.png" name="overnote1_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote1_1" type="hidden"/>
<input name="overprogress1_1" type="hidden"/></td>
<td><div id='overstatus1_2'></div>
<div><select name='overrecord1_2' onChange='updateOverTotalTime(1,2);' disabled></select><a href="#" onClick="callDailyNote(2,1,true)"><img src="img/note.png" name="overnote1_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote1_2" type="hidden"/>
<input name="overprogress1_2" type="hidden"/></td>
<td><div id='overstatus1_3'></div>
<div><select name='overrecord1_3' onChange='updateOverTotalTime(1,3);' disabled></select><a href="#" onClick="callDailyNote(3,1,true)"><img src="img/note.png" name="overnote1_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote1_3" type="hidden"/>
<input name="overprogress1_3" type="hidden"/></td>
<td><div id='overstatus1_4'></div>
<div><select name='overrecord1_4' onChange='updateOverTotalTime(1,4);' disabled></select><a href="#" onClick="callDailyNote(4,1,true)"><img src="img/note.png" name="overnote1_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote1_4" type="hidden"/>
<input name="overprogress1_4" type="hidden"/></td>
<td><div id='overstatus1_5'></div>
<div><select name='overrecord1_5' onChange='updateOverTotalTime(1,5);' disabled></select><a href="#" onClick="callDailyNote(5,1,true)"><img src="img/note.png" name="overnote1_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote1_5" type="hidden"/>
<input name="overprogress1_5" type="hidden"/></td>
<td><div id='overstatus1_6'></div>
<div><select name='overrecord1_6' onChange='updateOverTotalTime(1,6);' disabled></select><a href="#" onClick="callDailyNote(6,1,true)"><img src="img/note.png" name="overnote1_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote1_6" type="hidden"/>
<input name="overprogress1_6" type="hidden"/></td>
<tr id='overrecord2'><td><select name='overproject2' onchange="fillActivity('overproject2','overactivity2'),clearOverRecord('2');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity2' onChange="checkOvertimeActivityDuplicate(2),changeOvertimeActivity('2','overactivity2',document.weekly_info.overproject2.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress2" size='2' readOnly />%</td>
<td><div id='overstatus2_0'></div>
<div><select name='overrecord2_0' onChange='updateOverTotalTime(2,0);' disabled></select><a href="#" onClick="callDailyNote(0,2,true)"><img src="img/note.png" name="overnote2_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote2_0" type="hidden"/>
<input name="overprogress2_0" type="hidden"/></td>
<td><div id='overstatus2_1'></div>
<div><select name='overrecord2_1' onChange='updateOverTotalTime(2,1);' disabled></select><a href="#" onClick="callDailyNote(1,2,true)"><img src="img/note.png" name="overnote2_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote2_1" type="hidden"/>
<input name="overprogress2_1" type="hidden"/></td>
<td><div id='overstatus2_2'></div>
<div><select name='overrecord2_2' onChange='updateOverTotalTime(2,2);' disabled></select><a href="#" onClick="callDailyNote(2,2,true)"><img src="img/note.png" name="overnote2_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote2_2" type="hidden"/>
<input name="overprogress2_2" type="hidden"/></td>
<td><div id='overstatus2_3'></div>
<div><select name='overrecord2_3' onChange='updateOverTotalTime(2,3);' disabled></select><a href="#" onClick="callDailyNote(3,2,true)"><img src="img/note.png" name="overnote2_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote2_3" type="hidden"/>
<input name="overprogress2_3" type="hidden"/></td>
<td><div id='overstatus2_4'></div>
<div><select name='overrecord2_4' onChange='updateOverTotalTime(2,4);' disabled></select><a href="#" onClick="callDailyNote(4,2,true)"><img src="img/note.png" name="overnote2_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote2_4" type="hidden"/>
<input name="overprogress2_4" type="hidden"/></td>
<td><div id='overstatus2_5'></div>
<div><select name='overrecord2_5' onChange='updateOverTotalTime(2,5);' disabled></select><a href="#" onClick="callDailyNote(5,2,true)"><img src="img/note.png" name="overnote2_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote2_5" type="hidden"/>
<input name="overprogress2_5" type="hidden"/></td>
<td><div id='overstatus2_6'></div>
<div><select name='overrecord2_6' onChange='updateOverTotalTime(2,6);' disabled></select><a href="#" onClick="callDailyNote(6,2,true)"><img src="img/note.png" name="overnote2_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote2_6" type="hidden"/>
<input name="overprogress2_6" type="hidden"/></td>
<tr id='overrecord3'><td><select name='overproject3' onchange="fillActivity('overproject3','overactivity3'),clearOverRecord('3');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity3' onChange="checkOvertimeActivityDuplicate(3),changeOvertimeActivity('3','overactivity3',document.weekly_info.overproject3.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress3" size='2' readOnly />%</td>
<td><div id='overstatus3_0'></div>
<div><select name='overrecord3_0' onChange='updateOverTotalTime(3,0);' disabled></select><a href="#" onClick="callDailyNote(0,3,true)"><img src="img/note.png" name="overnote3_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote3_0" type="hidden"/>
<input name="overprogress3_0" type="hidden"/></td>
<td><div id='overstatus3_1'></div>
<div><select name='overrecord3_1' onChange='updateOverTotalTime(3,1);' disabled></select><a href="#" onClick="callDailyNote(1,3,true)"><img src="img/note.png" name="overnote3_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote3_1" type="hidden"/>
<input name="overprogress3_1" type="hidden"/></td>
<td><div id='overstatus3_2'></div>
<div><select name='overrecord3_2' onChange='updateOverTotalTime(3,2);' disabled></select><a href="#" onClick="callDailyNote(2,3,true)"><img src="img/note.png" name="overnote3_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote3_2" type="hidden"/>
<input name="overprogress3_2" type="hidden"/></td>
<td><div id='overstatus3_3'></div>
<div><select name='overrecord3_3' onChange='updateOverTotalTime(3,3);' disabled></select><a href="#" onClick="callDailyNote(3,3,true)"><img src="img/note.png" name="overnote3_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote3_3" type="hidden"/>
<input name="overprogress3_3" type="hidden"/></td>
<td><div id='overstatus3_4'></div>
<div><select name='overrecord3_4' onChange='updateOverTotalTime(3,4);' disabled></select><a href="#" onClick="callDailyNote(4,3,true)"><img src="img/note.png" name="overnote3_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote3_4" type="hidden"/>
<input name="overprogress3_4" type="hidden"/></td>
<td><div id='overstatus3_5'></div>
<div><select name='overrecord3_5' onChange='updateOverTotalTime(3,5);' disabled></select><a href="#" onClick="callDailyNote(5,3,true)"><img src="img/note.png" name="overnote3_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote3_5" type="hidden"/>
<input name="overprogress3_5" type="hidden"/></td>
<td><div id='overstatus3_6'></div>
<div><select name='overrecord3_6' onChange='updateOverTotalTime(3,6);' disabled></select><a href="#" onClick="callDailyNote(6,3,true)"><img src="img/note.png" name="overnote3_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote3_6" type="hidden"/>
<input name="overprogress3_6" type="hidden"/></td>
<tr id='overrecord4'><td><select name='overproject4' onchange="fillActivity('overproject4','overactivity4'),clearOverRecord('4');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity4' onChange="checkOvertimeActivityDuplicate(4),changeOvertimeActivity('4','overactivity4',document.weekly_info.overproject4.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress4" size='2' readOnly />%</td>
<td><div id='overstatus4_0'></div>
<div><select name='overrecord4_0' onChange='updateOverTotalTime(4,0);' disabled></select><a href="#" onClick="callDailyNote(0,4,true)"><img src="img/note.png" name="overnote4_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote4_0" type="hidden"/>
<input name="overprogress4_0" type="hidden"/></td>
<td><div id='overstatus4_1'></div>
<div><select name='overrecord4_1' onChange='updateOverTotalTime(4,1);' disabled></select><a href="#" onClick="callDailyNote(1,4,true)"><img src="img/note.png" name="overnote4_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote4_1" type="hidden"/>
<input name="overprogress4_1" type="hidden"/></td>
<td><div id='overstatus4_2'></div>
<div><select name='overrecord4_2' onChange='updateOverTotalTime(4,2);' disabled></select><a href="#" onClick="callDailyNote(2,4,true)"><img src="img/note.png" name="overnote4_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote4_2" type="hidden"/>
<input name="overprogress4_2" type="hidden"/></td>
<td><div id='overstatus4_3'></div>
<div><select name='overrecord4_3' onChange='updateOverTotalTime(4,3);' disabled></select><a href="#" onClick="callDailyNote(3,4,true)"><img src="img/note.png" name="overnote4_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote4_3" type="hidden"/>
<input name="overprogress4_3" type="hidden"/></td>
<td><div id='overstatus4_4'></div>
<div><select name='overrecord4_4' onChange='updateOverTotalTime(4,4);' disabled></select><a href="#" onClick="callDailyNote(4,4,true)"><img src="img/note.png" name="overnote4_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote4_4" type="hidden"/>
<input name="overprogress4_4" type="hidden"/></td>
<td><div id='overstatus4_5'></div>
<div><select name='overrecord4_5' onChange='updateOverTotalTime(4,5);' disabled></select><a href="#" onClick="callDailyNote(5,4,true)"><img src="img/note.png" name="overnote4_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote4_5" type="hidden"/>
<input name="overprogress4_5" type="hidden"/></td>
<td><div id='overstatus4_6'></div>
<div><select name='overrecord4_6' onChange='updateOverTotalTime(4,6);' disabled></select><a href="#" onClick="callDailyNote(6,4,true)"><img src="img/note.png" name="overnote4_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote4_6" type="hidden"/>
<input name="overprogress4_6" type="hidden"/></td>
<tr id='overrecord5'><td><select name='overproject5' onchange="fillActivity('overproject5','overactivity5'),clearOverRecord('5');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity5' onChange="checkOvertimeActivityDuplicate(5),changeOvertimeActivity('5','overactivity5',document.weekly_info.overproject5.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress5" size='2' readOnly />%</td>
<td><div id='overstatus5_0'></div>
<div><select name='overrecord5_0' onChange='updateOverTotalTime(5,0);' disabled></select><a href="#" onClick="callDailyNote(0,5,true)"><img src="img/note.png" name="overnote5_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote5_0" type="hidden"/>
<input name="overprogress5_0" type="hidden"/></td>
<td><div id='overstatus5_1'></div>
<div><select name='overrecord5_1' onChange='updateOverTotalTime(5,1);' disabled></select><a href="#" onClick="callDailyNote(1,5,true)"><img src="img/note.png" name="overnote5_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote5_1" type="hidden"/>
<input name="overprogress5_1" type="hidden"/></td>
<td><div id='overstatus5_2'></div>
<div><select name='overrecord5_2' onChange='updateOverTotalTime(5,2);' disabled></select><a href="#" onClick="callDailyNote(2,5,true)"><img src="img/note.png" name="overnote5_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote5_2" type="hidden"/>
<input name="overprogress5_2" type="hidden"/></td>
<td><div id='overstatus5_3'></div>
<div><select name='overrecord5_3' onChange='updateOverTotalTime(5,3);' disabled></select><a href="#" onClick="callDailyNote(3,5,true)"><img src="img/note.png" name="overnote5_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote5_3" type="hidden"/>
<input name="overprogress5_3" type="hidden"/></td>
<td><div id='overstatus5_4'></div>
<div><select name='overrecord5_4' onChange='updateOverTotalTime(5,4);' disabled></select><a href="#" onClick="callDailyNote(4,5,true)"><img src="img/note.png" name="overnote5_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote5_4" type="hidden"/>
<input name="overprogress5_4" type="hidden"/></td>
<td><div id='overstatus5_5'></div>
<div><select name='overrecord5_5' onChange='updateOverTotalTime(5,5);' disabled></select><a href="#" onClick="callDailyNote(5,5,true)"><img src="img/note.png" name="overnote5_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote5_5" type="hidden"/>
<input name="overprogress5_5" type="hidden"/></td>
<td><div id='overstatus5_6'></div>
<div><select name='overrecord5_6' onChange='updateOverTotalTime(5,6);' disabled></select><a href="#" onClick="callDailyNote(6,5,true)"><img src="img/note.png" name="overnote5_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote5_6" type="hidden"/>
<input name="overprogress5_6" type="hidden"/></td>
<tr id='overrecord6'><td><select name='overproject6' onchange="fillActivity('overproject6','overactivity6'),clearOverRecord('6');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity6' onChange="checkOvertimeActivityDuplicate(6),changeOvertimeActivity('6','overactivity6',document.weekly_info.overproject6.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress6" size='2' readOnly />%</td>
<td><div id='overstatus6_0'></div>
<div><select name='overrecord6_0' onChange='updateOverTotalTime(6,0);' disabled></select><a href="#" onClick="callDailyNote(0,6,true)"><img src="img/note.png" name="overnote6_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote6_0" type="hidden"/>
<input name="overprogress6_0" type="hidden"/></td>
<td><div id='overstatus6_1'></div>
<div><select name='overrecord6_1' onChange='updateOverTotalTime(6,1);' disabled></select><a href="#" onClick="callDailyNote(1,6,true)"><img src="img/note.png" name="overnote6_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote6_1" type="hidden"/>
<input name="overprogress6_1" type="hidden"/></td>
<td><div id='overstatus6_2'></div>
<div><select name='overrecord6_2' onChange='updateOverTotalTime(6,2);' disabled></select><a href="#" onClick="callDailyNote(2,6,true)"><img src="img/note.png" name="overnote6_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote6_2" type="hidden"/>
<input name="overprogress6_2" type="hidden"/></td>
<td><div id='overstatus6_3'></div>
<div><select name='overrecord6_3' onChange='updateOverTotalTime(6,3);' disabled></select><a href="#" onClick="callDailyNote(3,6,true)"><img src="img/note.png" name="overnote6_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote6_3" type="hidden"/>
<input name="overprogress6_3" type="hidden"/></td>
<td><div id='overstatus6_4'></div>
<div><select name='overrecord6_4' onChange='updateOverTotalTime(6,4);' disabled></select><a href="#" onClick="callDailyNote(4,6,true)"><img src="img/note.png" name="overnote6_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote6_4" type="hidden"/>
<input name="overprogress6_4" type="hidden"/></td>
<td><div id='overstatus6_5'></div>
<div><select name='overrecord6_5' onChange='updateOverTotalTime(6,5);' disabled></select><a href="#" onClick="callDailyNote(5,6,true)"><img src="img/note.png" name="overnote6_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote6_5" type="hidden"/>
<input name="overprogress6_5" type="hidden"/></td>
<td><div id='overstatus6_6'></div>
<div><select name='overrecord6_6' onChange='updateOverTotalTime(6,6);' disabled></select><a href="#" onClick="callDailyNote(6,6,true)"><img src="img/note.png" name="overnote6_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote6_6" type="hidden"/>
<input name="overprogress6_6" type="hidden"/></td>
<tr id='overrecord7'><td><select name='overproject7' onchange="fillActivity('overproject7','overactivity7'),clearOverRecord('7');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity7' onChange="checkOvertimeActivityDuplicate(7),changeOvertimeActivity('7','overactivity7',document.weekly_info.overproject7.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress7" size='2' readOnly />%</td>
<td><div id='overstatus7_0'></div>
<div><select name='overrecord7_0' onChange='updateOverTotalTime(7,0);' disabled></select><a href="#" onClick="callDailyNote(0,7,true)"><img src="img/note.png" name="overnote7_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote7_0" type="hidden"/>
<input name="overprogress7_0" type="hidden"/></td>
<td><div id='overstatus7_1'></div>
<div><select name='overrecord7_1' onChange='updateOverTotalTime(7,1);' disabled></select><a href="#" onClick="callDailyNote(1,7,true)"><img src="img/note.png" name="overnote7_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote7_1" type="hidden"/>
<input name="overprogress7_1" type="hidden"/></td>
<td><div id='overstatus7_2'></div>
<div><select name='overrecord7_2' onChange='updateOverTotalTime(7,2);' disabled></select><a href="#" onClick="callDailyNote(2,7,true)"><img src="img/note.png" name="overnote7_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote7_2" type="hidden"/>
<input name="overprogress7_2" type="hidden"/></td>
<td><div id='overstatus7_3'></div>
<div><select name='overrecord7_3' onChange='updateOverTotalTime(7,3);' disabled></select><a href="#" onClick="callDailyNote(3,7,true)"><img src="img/note.png" name="overnote7_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote7_3" type="hidden"/>
<input name="overprogress7_3" type="hidden"/></td>
<td><div id='overstatus7_4'></div>
<div><select name='overrecord7_4' onChange='updateOverTotalTime(7,4);' disabled></select><a href="#" onClick="callDailyNote(4,7,true)"><img src="img/note.png" name="overnote7_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote7_4" type="hidden"/>
<input name="overprogress7_4" type="hidden"/></td>
<td><div id='overstatus7_5'></div>
<div><select name='overrecord7_5' onChange='updateOverTotalTime(7,5);' disabled></select><a href="#" onClick="callDailyNote(5,7,true)"><img src="img/note.png" name="overnote7_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote7_5" type="hidden"/>
<input name="overprogress7_5" type="hidden"/></td>
<td><div id='overstatus7_6'></div>
<div><select name='overrecord7_6' onChange='updateOverTotalTime(7,6);' disabled></select><a href="#" onClick="callDailyNote(6,7,true)"><img src="img/note.png" name="overnote7_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote7_6" type="hidden"/>
<input name="overprogress7_6" type="hidden"/></td>
<tr id='overrecord8'><td><select name='overproject8' onchange="fillActivity('overproject8','overactivity8'),clearOverRecord('8');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity8' onChange="checkOvertimeActivityDuplicate(8),changeOvertimeActivity('8','overactivity8',document.weekly_info.overproject8.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress8" size='2' readOnly />%</td>
<td><div id='overstatus8_0'></div>
<div><select name='overrecord8_0' onChange='updateOverTotalTime(8,0);' disabled></select><a href="#" onClick="callDailyNote(0,8,true)"><img src="img/note.png" name="overnote8_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote8_0" type="hidden"/>
<input name="overprogress8_0" type="hidden"/></td>
<td><div id='overstatus8_1'></div>
<div><select name='overrecord8_1' onChange='updateOverTotalTime(8,1);' disabled></select><a href="#" onClick="callDailyNote(1,8,true)"><img src="img/note.png" name="overnote8_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote8_1" type="hidden"/>
<input name="overprogress8_1" type="hidden"/></td>
<td><div id='overstatus8_2'></div>
<div><select name='overrecord8_2' onChange='updateOverTotalTime(8,2);' disabled></select><a href="#" onClick="callDailyNote(2,8,true)"><img src="img/note.png" name="overnote8_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote8_2" type="hidden"/>
<input name="overprogress8_2" type="hidden"/></td>
<td><div id='overstatus8_3'></div>
<div><select name='overrecord8_3' onChange='updateOverTotalTime(8,3);' disabled></select><a href="#" onClick="callDailyNote(3,8,true)"><img src="img/note.png" name="overnote8_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote8_3" type="hidden"/>
<input name="overprogress8_3" type="hidden"/></td>
<td><div id='overstatus8_4'></div>
<div><select name='overrecord8_4' onChange='updateOverTotalTime(8,4);' disabled></select><a href="#" onClick="callDailyNote(4,8,true)"><img src="img/note.png" name="overnote8_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote8_4" type="hidden"/>
<input name="overprogress8_4" type="hidden"/></td>
<td><div id='overstatus8_5'></div>
<div><select name='overrecord8_5' onChange='updateOverTotalTime(8,5);' disabled></select><a href="#" onClick="callDailyNote(5,8,true)"><img src="img/note.png" name="overnote8_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote8_5" type="hidden"/>
<input name="overprogress8_5" type="hidden"/></td>
<td><div id='overstatus8_6'></div>
<div><select name='overrecord8_6' onChange='updateOverTotalTime(8,6);' disabled></select><a href="#" onClick="callDailyNote(6,8,true)"><img src="img/note.png" name="overnote8_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote8_6" type="hidden"/>
<input name="overprogress8_6" type="hidden"/></td>
<tr id='overrecord9'><td><select name='overproject9' onchange="fillActivity('overproject9','overactivity9'),clearOverRecord('9');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity9' onChange="checkOvertimeActivityDuplicate(9),changeOvertimeActivity('9','overactivity9',document.weekly_info.overproject9.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress9" size='2' readOnly />%</td>
<td><div id='overstatus9_0'></div>
<div><select name='overrecord9_0' onChange='updateOverTotalTime(9,0);' disabled></select><a href="#" onClick="callDailyNote(0,9,true)"><img src="img/note.png" name="overnote9_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote9_0" type="hidden"/>
<input name="overprogress9_0" type="hidden"/></td>
<td><div id='overstatus9_1'></div>
<div><select name='overrecord9_1' onChange='updateOverTotalTime(9,1);' disabled></select><a href="#" onClick="callDailyNote(1,9,true)"><img src="img/note.png" name="overnote9_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote9_1" type="hidden"/>
<input name="overprogress9_1" type="hidden"/></td>
<td><div id='overstatus9_2'></div>
<div><select name='overrecord9_2' onChange='updateOverTotalTime(9,2);' disabled></select><a href="#" onClick="callDailyNote(2,9,true)"><img src="img/note.png" name="overnote9_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote9_2" type="hidden"/>
<input name="overprogress9_2" type="hidden"/></td>
<td><div id='overstatus9_3'></div>
<div><select name='overrecord9_3' onChange='updateOverTotalTime(9,3);' disabled></select><a href="#" onClick="callDailyNote(3,9,true)"><img src="img/note.png" name="overnote9_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote9_3" type="hidden"/>
<input name="overprogress9_3" type="hidden"/></td>
<td><div id='overstatus9_4'></div>
<div><select name='overrecord9_4' onChange='updateOverTotalTime(9,4);' disabled></select><a href="#" onClick="callDailyNote(4,9,true)"><img src="img/note.png" name="overnote9_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote9_4" type="hidden"/>
<input name="overprogress9_4" type="hidden"/></td>
<td><div id='overstatus9_5'></div>
<div><select name='overrecord9_5' onChange='updateOverTotalTime(9,5);' disabled></select><a href="#" onClick="callDailyNote(5,9,true)"><img src="img/note.png" name="overnote9_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote9_5" type="hidden"/>
<input name="overprogress9_5" type="hidden"/></td>
<td><div id='overstatus9_6'></div>
<div><select name='overrecord9_6' onChange='updateOverTotalTime(9,6);' disabled></select><a href="#" onClick="callDailyNote(6,9,true)"><img src="img/note.png" name="overnote9_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote9_6" type="hidden"/>
<input name="overprogress9_6" type="hidden"/></td>
<tr style='display:none' id='overrecord10'><td><select name="overproject10" onchange="fillActivity('overproject10','overactivity10'),clearOverRecord('10');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity10' onChange="checkOvertimeActivityDuplicate(10),changeOvertimeActivity('10','overactivity10',document.weekly_info.overproject10.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress10" size='2' readOnly />%</td>
<td><div id='overstatus10_0'></div>
<div><select name='overrecord10_0' onChange='updateOverTotalTime(10,0);' disabled></select><a href="#" onClick="callDailyNote(0,10,true)"><img src="img/note.png" name="overnote10_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote10_0" type="hidden"/>
<input name="overprogress10_0" type="hidden"/></td>
<td><div id='overstatus10_1'></div>
<div><select name='overrecord10_1' onChange='updateOverTotalTime(10,1);' disabled></select><a href="#" onClick="callDailyNote(1,10,true)"><img src="img/note.png" name="overnote10_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote10_1" type="hidden"/>
<input name="overprogress10_1" type="hidden"/></td>
<td><div id='overstatus10_2'></div>
<div><select name='overrecord10_2' onChange='updateOverTotalTime(10,2);' disabled></select><a href="#" onClick="callDailyNote(2,10,true)"><img src="img/note.png" name="overnote10_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote10_2" type="hidden"/>
<input name="overprogress10_2" type="hidden"/></td>
<td><div id='overstatus10_3'></div>
<div><select name='overrecord10_3' onChange='updateOverTotalTime(10,3);' disabled></select><a href="#" onClick="callDailyNote(3,10,true)"><img src="img/note.png" name="overnote10_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote10_3" type="hidden"/>
<input name="overprogress10_3" type="hidden"/></td>
<td><div id='overstatus10_4'></div>
<div><select name='overrecord10_4' onChange='updateOverTotalTime(10,4);' disabled></select><a href="#" onClick="callDailyNote(4,10,true)"><img src="img/note.png" name="overnote10_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote10_4" type="hidden"/>
<input name="overprogress10_4" type="hidden"/></td>
<td><div id='overstatus10_5'></div>
<div><select name='overrecord10_5' onChange='updateOverTotalTime(10,5);' disabled></select><a href="#" onClick="callDailyNote(5,10,true)"><img src="img/note.png" name="overnote10_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote10_5" type="hidden"/>
<input name="overprogress10_5" type="hidden"/></td>
<td><div id='overstatus10_6'></div>
<div><select name='overrecord10_6' onChange='updateOverTotalTime(10,6);' disabled></select><a href="#" onClick="callDailyNote(6,10,true)"><img src="img/note.png" name="overnote10_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote10_6" type="hidden"/>
<input name="overprogress10_6" type="hidden"/></td>
<tr style='display:none' id='overrecord11'><td><select name="overproject11" onchange="fillActivity('overproject11','overactivity11'),clearOverRecord('11');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity11' onChange="checkOvertimeActivityDuplicate(11),changeOvertimeActivity('11','overactivity11',document.weekly_info.overproject11.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress11" size='2' readOnly />%</td>
<td><div id='overstatus11_0'></div>
<div><select name='overrecord11_0' onChange='updateOverTotalTime(11,0);' disabled></select><a href="#" onClick="callDailyNote(0,11,true)"><img src="img/note.png" name="overnote11_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote11_0" type="hidden"/>
<input name="overprogress11_0" type="hidden"/></td>
<td><div id='overstatus11_1'></div>
<div><select name='overrecord11_1' onChange='updateOverTotalTime(11,1);' disabled></select><a href="#" onClick="callDailyNote(1,11,true)"><img src="img/note.png" name="overnote11_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote11_1" type="hidden"/>
<input name="overprogress11_1" type="hidden"/></td>
<td><div id='overstatus11_2'></div>
<div><select name='overrecord11_2' onChange='updateOverTotalTime(11,2);' disabled></select><a href="#" onClick="callDailyNote(2,11,true)"><img src="img/note.png" name="overnote11_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote11_2" type="hidden"/>
<input name="overprogress11_2" type="hidden"/></td>
<td><div id='overstatus11_3'></div>
<div><select name='overrecord11_3' onChange='updateOverTotalTime(11,3);' disabled></select><a href="#" onClick="callDailyNote(3,11,true)"><img src="img/note.png" name="overnote11_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote11_3" type="hidden"/>
<input name="overprogress11_3" type="hidden"/></td>
<td><div id='overstatus11_4'></div>
<div><select name='overrecord11_4' onChange='updateOverTotalTime(11,4);' disabled></select><a href="#" onClick="callDailyNote(4,11,true)"><img src="img/note.png" name="overnote11_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote11_4" type="hidden"/>
<input name="overprogress11_4" type="hidden"/></td>
<td><div id='overstatus11_5'></div>
<div><select name='overrecord11_5' onChange='updateOverTotalTime(11,5);' disabled></select><a href="#" onClick="callDailyNote(5,11,true)"><img src="img/note.png" name="overnote11_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote11_5" type="hidden"/>
<input name="overprogress11_5" type="hidden"/></td>
<td><div id='overstatus11_6'></div>
<div><select name='overrecord11_6' onChange='updateOverTotalTime(11,6);' disabled></select><a href="#" onClick="callDailyNote(6,11,true)"><img src="img/note.png" name="overnote11_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote11_6" type="hidden"/>
<input name="overprogress11_6" type="hidden"/></td>
<tr style='display:none' id='overrecord12'><td><select name="overproject12" onchange="fillActivity('overproject12','overactivity12'),clearOverRecord('12');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity12' onChange="checkOvertimeActivityDuplicate(12),changeOvertimeActivity('12','overactivity12',document.weekly_info.overproject12.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress12" size='2' readOnly />%</td>
<td><div id='overstatus12_0'></div>
<div><select name='overrecord12_0' onChange='updateOverTotalTime(12,0);' disabled></select><a href="#" onClick="callDailyNote(0,12,true)"><img src="img/note.png" name="overnote12_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote12_0" type="hidden"/>
<input name="overprogress12_0" type="hidden"/></td>
<td><div id='overstatus12_1'></div>
<div><select name='overrecord12_1' onChange='updateOverTotalTime(12,1);' disabled></select><a href="#" onClick="callDailyNote(1,12,true)"><img src="img/note.png" name="overnote12_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote12_1" type="hidden"/>
<input name="overprogress12_1" type="hidden"/></td>
<td><div id='overstatus12_2'></div>
<div><select name='overrecord12_2' onChange='updateOverTotalTime(12,2);' disabled></select><a href="#" onClick="callDailyNote(2,12,true)"><img src="img/note.png" name="overnote12_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote12_2" type="hidden"/>
<input name="overprogress12_2" type="hidden"/></td>
<td><div id='overstatus12_3'></div>
<div><select name='overrecord12_3' onChange='updateOverTotalTime(12,3);' disabled></select><a href="#" onClick="callDailyNote(3,12,true)"><img src="img/note.png" name="overnote12_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote12_3" type="hidden"/>
<input name="overprogress12_3" type="hidden"/></td>
<td><div id='overstatus12_4'></div>
<div><select name='overrecord12_4' onChange='updateOverTotalTime(12,4);' disabled></select><a href="#" onClick="callDailyNote(4,12,true)"><img src="img/note.png" name="overnote12_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote12_4" type="hidden"/>
<input name="overprogress12_4" type="hidden"/></td>
<td><div id='overstatus12_5'></div>
<div><select name='overrecord12_5' onChange='updateOverTotalTime(12,5);' disabled></select><a href="#" onClick="callDailyNote(5,12,true)"><img src="img/note.png" name="overnote12_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote12_5" type="hidden"/>
<input name="overprogress12_5" type="hidden"/></td>
<td><div id='overstatus12_6'></div>
<div><select name='overrecord12_6' onChange='updateOverTotalTime(12,6);' disabled></select><a href="#" onClick="callDailyNote(6,12,true)"><img src="img/note.png" name="overnote12_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote12_6" type="hidden"/>
<input name="overprogress12_6" type="hidden"/></td>
<tr style='display:none' id='overrecord13'><td><select name="overproject13" onchange="fillActivity('overproject13','overactivity13'),clearOverRecord('13');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity13' onChange="checkOvertimeActivityDuplicate(13),changeOvertimeActivity('13','overactivity13',document.weekly_info.overproject13.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress13" size='2' readOnly />%</td>
<td><div id='overstatus13_0'></div>
<div><select name='overrecord13_0' onChange='updateOverTotalTime(13,0);' disabled></select><a href="#" onClick="callDailyNote(0,13,true)"><img src="img/note.png" name="overnote13_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote13_0" type="hidden"/>
<input name="overprogress13_0" type="hidden"/></td>
<td><div id='overstatus13_1'></div>
<div><select name='overrecord13_1' onChange='updateOverTotalTime(13,1);' disabled></select><a href="#" onClick="callDailyNote(1,13,true)"><img src="img/note.png" name="overnote13_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote13_1" type="hidden"/>
<input name="overprogress13_1" type="hidden"/></td>
<td><div id='overstatus13_2'></div>
<div><select name='overrecord13_2' onChange='updateOverTotalTime(13,2);' disabled></select><a href="#" onClick="callDailyNote(2,13,true)"><img src="img/note.png" name="overnote13_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote13_2" type="hidden"/>
<input name="overprogress13_2" type="hidden"/></td>
<td><div id='overstatus13_3'></div>
<div><select name='overrecord13_3' onChange='updateOverTotalTime(13,3);' disabled></select><a href="#" onClick="callDailyNote(3,13,true)"><img src="img/note.png" name="overnote13_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote13_3" type="hidden"/>
<input name="overprogress13_3" type="hidden"/></td>
<td><div id='overstatus13_4'></div>
<div><select name='overrecord13_4' onChange='updateOverTotalTime(13,4);' disabled></select><a href="#" onClick="callDailyNote(4,13,true)"><img src="img/note.png" name="overnote13_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote13_4" type="hidden"/>
<input name="overprogress13_4" type="hidden"/></td>
<td><div id='overstatus13_5'></div>
<div><select name='overrecord13_5' onChange='updateOverTotalTime(13,5);' disabled></select><a href="#" onClick="callDailyNote(5,13,true)"><img src="img/note.png" name="overnote13_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote13_5" type="hidden"/>
<input name="overprogress13_5" type="hidden"/></td>
<td><div id='overstatus13_6'></div>
<div><select name='overrecord13_6' onChange='updateOverTotalTime(13,6);' disabled></select><a href="#" onClick="callDailyNote(6,13,true)"><img src="img/note.png" name="overnote13_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote13_6" type="hidden"/>
<input name="overprogress13_6" type="hidden"/></td>
<tr style='display:none' id='overrecord14'><td><select name="overproject14" onchange="fillActivity('overproject14','overactivity14'),clearOverRecord('14');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity14' onChange="checkOvertimeActivityDuplicate(14),changeOvertimeActivity('14','overactivity14',document.weekly_info.overproject14.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress14" size='2' readOnly />%</td>
<td><div id='overstatus14_0'></div>
<div><select name='overrecord14_0' onChange='updateOverTotalTime(14,0);' disabled></select><a href="#" onClick="callDailyNote(0,14,true)"><img src="img/note.png" name="overnote14_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote14_0" type="hidden"/>
<input name="overprogress14_0" type="hidden"/></td>
<td><div id='overstatus14_1'></div>
<div><select name='overrecord14_1' onChange='updateOverTotalTime(14,1);' disabled></select><a href="#" onClick="callDailyNote(1,14,true)"><img src="img/note.png" name="overnote14_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote14_1" type="hidden"/>
<input name="overprogress14_1" type="hidden"/></td>
<td><div id='overstatus14_2'></div>
<div><select name='overrecord14_2' onChange='updateOverTotalTime(14,2);' disabled></select><a href="#" onClick="callDailyNote(2,14,true)"><img src="img/note.png" name="overnote14_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote14_2" type="hidden"/>
<input name="overprogress14_2" type="hidden"/></td>
<td><div id='overstatus14_3'></div>
<div><select name='overrecord14_3' onChange='updateOverTotalTime(14,3);' disabled></select><a href="#" onClick="callDailyNote(3,14,true)"><img src="img/note.png" name="overnote14_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote14_3" type="hidden"/>
<input name="overprogress14_3" type="hidden"/></td>
<td><div id='overstatus14_4'></div>
<div><select name='overrecord14_4' onChange='updateOverTotalTime(14,4);' disabled></select><a href="#" onClick="callDailyNote(4,14,true)"><img src="img/note.png" name="overnote14_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote14_4" type="hidden"/>
<input name="overprogress14_4" type="hidden"/></td>
<td><div id='overstatus14_5'></div>
<div><select name='overrecord14_5' onChange='updateOverTotalTime(14,5);' disabled></select><a href="#" onClick="callDailyNote(5,14,true)"><img src="img/note.png" name="overnote14_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote14_5" type="hidden"/>
<input name="overprogress14_5" type="hidden"/></td>
<td><div id='overstatus14_6'></div>
<div><select name='overrecord14_6' onChange='updateOverTotalTime(14,6);' disabled></select><a href="#" onClick="callDailyNote(6,14,true)"><img src="img/note.png" name="overnote14_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote14_6" type="hidden"/>
<input name="overprogress14_6" type="hidden"/></td>
<tr style='display:none' id='overrecord15'><td><select name="overproject15" onchange="fillActivity('overproject15','overactivity15'),clearOverRecord('15');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity15' onChange="checkOvertimeActivityDuplicate(15),changeOvertimeActivity('15','overactivity15',document.weekly_info.overproject15.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress15" size='2' readOnly />%</td>
<td><div id='overstatus15_0'></div>
<div><select name='overrecord15_0' onChange='updateOverTotalTime(15,0);' disabled></select><a href="#" onClick="callDailyNote(0,15,true)"><img src="img/note.png" name="overnote15_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote15_0" type="hidden"/>
<input name="overprogress15_0" type="hidden"/></td>
<td><div id='overstatus15_1'></div>
<div><select name='overrecord15_1' onChange='updateOverTotalTime(15,1);' disabled></select><a href="#" onClick="callDailyNote(1,15,true)"><img src="img/note.png" name="overnote15_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote15_1" type="hidden"/>
<input name="overprogress15_1" type="hidden"/></td>
<td><div id='overstatus15_2'></div>
<div><select name='overrecord15_2' onChange='updateOverTotalTime(15,2);' disabled></select><a href="#" onClick="callDailyNote(2,15,true)"><img src="img/note.png" name="overnote15_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote15_2" type="hidden"/>
<input name="overprogress15_2" type="hidden"/></td>
<td><div id='overstatus15_3'></div>
<div><select name='overrecord15_3' onChange='updateOverTotalTime(15,3);' disabled></select><a href="#" onClick="callDailyNote(3,15,true)"><img src="img/note.png" name="overnote15_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote15_3" type="hidden"/>
<input name="overprogress15_3" type="hidden"/></td>
<td><div id='overstatus15_4'></div>
<div><select name='overrecord15_4' onChange='updateOverTotalTime(15,4);' disabled></select><a href="#" onClick="callDailyNote(4,15,true)"><img src="img/note.png" name="overnote15_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote15_4" type="hidden"/>
<input name="overprogress15_4" type="hidden"/></td>
<td><div id='overstatus15_5'></div>
<div><select name='overrecord15_5' onChange='updateOverTotalTime(15,5);' disabled></select><a href="#" onClick="callDailyNote(5,15,true)"><img src="img/note.png" name="overnote15_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote15_5" type="hidden"/>
<input name="overprogress15_5" type="hidden"/></td>
<td><div id='overstatus15_6'></div>
<div><select name='overrecord15_6' onChange='updateOverTotalTime(15,6);' disabled></select><a href="#" onClick="callDailyNote(6,15,true)"><img src="img/note.png" name="overnote15_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote15_6" type="hidden"/>
<input name="overprogress15_6" type="hidden"/></td>
<tr style='display:none' id='overrecord16'><td><select name="overproject16" onchange="fillActivity('overproject16','overactivity16'),clearOverRecord('16');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity16' onChange="checkOvertimeActivityDuplicate(16),changeOvertimeActivity('16','overactivity16',document.weekly_info.overproject16.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress16" size='2' readOnly />%</td>
<td><div id='overstatus16_0'></div>
<div><select name='overrecord16_0' onChange='updateOverTotalTime(16,0);' disabled></select><a href="#" onClick="callDailyNote(0,16,true)"><img src="img/note.png" name="overnote16_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote16_0" type="hidden"/>
<input name="overprogress16_0" type="hidden"/></td>
<td><div id='overstatus16_1'></div>
<div><select name='overrecord16_1' onChange='updateOverTotalTime(16,1);' disabled></select><a href="#" onClick="callDailyNote(1,16,true)"><img src="img/note.png" name="overnote16_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote16_1" type="hidden"/>
<input name="overprogress16_1" type="hidden"/></td>
<td><div id='overstatus16_2'></div>
<div><select name='overrecord16_2' onChange='updateOverTotalTime(16,2);' disabled></select><a href="#" onClick="callDailyNote(2,16,true)"><img src="img/note.png" name="overnote16_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote16_2" type="hidden"/>
<input name="overprogress16_2" type="hidden"/></td>
<td><div id='overstatus16_3'></div>
<div><select name='overrecord16_3' onChange='updateOverTotalTime(16,3);' disabled></select><a href="#" onClick="callDailyNote(3,16,true)"><img src="img/note.png" name="overnote16_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote16_3" type="hidden"/>
<input name="overprogress16_3" type="hidden"/></td>
<td><div id='overstatus16_4'></div>
<div><select name='overrecord16_4' onChange='updateOverTotalTime(16,4);' disabled></select><a href="#" onClick="callDailyNote(4,16,true)"><img src="img/note.png" name="overnote16_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote16_4" type="hidden"/>
<input name="overprogress16_4" type="hidden"/></td>
<td><div id='overstatus16_5'></div>
<div><select name='overrecord16_5' onChange='updateOverTotalTime(16,5);' disabled></select><a href="#" onClick="callDailyNote(5,16,true)"><img src="img/note.png" name="overnote16_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote16_5" type="hidden"/>
<input name="overprogress16_5" type="hidden"/></td>
<td><div id='overstatus16_6'></div>
<div><select name='overrecord16_6' onChange='updateOverTotalTime(16,6);' disabled></select><a href="#" onClick="callDailyNote(6,16,true)"><img src="img/note.png" name="overnote16_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote16_6" type="hidden"/>
<input name="overprogress16_6" type="hidden"/></td>
<tr style='display:none' id='overrecord17'><td><select name="overproject17" onchange="fillActivity('overproject17','overactivity17'),clearOverRecord('17');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity17' onChange="checkOvertimeActivityDuplicate(17),changeOvertimeActivity('17','overactivity17',document.weekly_info.overproject17.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress17" size='2' readOnly />%</td>
<td><div id='overstatus17_0'></div>
<div><select name='overrecord17_0' onChange='updateOverTotalTime(17,0);' disabled></select><a href="#" onClick="callDailyNote(0,17,true)"><img src="img/note.png" name="overnote17_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote17_0" type="hidden"/>
<input name="overprogress17_0" type="hidden"/></td>
<td><div id='overstatus17_1'></div>
<div><select name='overrecord17_1' onChange='updateOverTotalTime(17,1);' disabled></select><a href="#" onClick="callDailyNote(1,17,true)"><img src="img/note.png" name="overnote17_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote17_1" type="hidden"/>
<input name="overprogress17_1" type="hidden"/></td>
<td><div id='overstatus17_2'></div>
<div><select name='overrecord17_2' onChange='updateOverTotalTime(17,2);' disabled></select><a href="#" onClick="callDailyNote(2,17,true)"><img src="img/note.png" name="overnote17_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote17_2" type="hidden"/>
<input name="overprogress17_2" type="hidden"/></td>
<td><div id='overstatus17_3'></div>
<div><select name='overrecord17_3' onChange='updateOverTotalTime(17,3);' disabled></select><a href="#" onClick="callDailyNote(3,17,true)"><img src="img/note.png" name="overnote17_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote17_3" type="hidden"/>
<input name="overprogress17_3" type="hidden"/></td>
<td><div id='overstatus17_4'></div>
<div><select name='overrecord17_4' onChange='updateOverTotalTime(17,4);' disabled></select><a href="#" onClick="callDailyNote(4,17,true)"><img src="img/note.png" name="overnote17_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote17_4" type="hidden"/>
<input name="overprogress17_4" type="hidden"/></td>
<td><div id='overstatus17_5'></div>
<div><select name='overrecord17_5' onChange='updateOverTotalTime(17,5);' disabled></select><a href="#" onClick="callDailyNote(5,17,true)"><img src="img/note.png" name="overnote17_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote17_5" type="hidden"/>
<input name="overprogress17_5" type="hidden"/></td>
<td><div id='overstatus17_6'></div>
<div><select name='overrecord17_6' onChange='updateOverTotalTime(17,6);' disabled></select><a href="#" onClick="callDailyNote(6,17,true)"><img src="img/note.png" name="overnote17_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote17_6" type="hidden"/>
<input name="overprogress17_6" type="hidden"/></td>
<tr style='display:none' id='overrecord18'><td><select name="overproject18" onchange="fillActivity('overproject18','overactivity18'),clearOverRecord('18');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity18' onChange="checkOvertimeActivityDuplicate(18),changeOvertimeActivity('18','overactivity18',document.weekly_info.overproject18.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress18" size='2' readOnly />%</td>
<td><div id='overstatus18_0'></div>
<div><select name='overrecord18_0' onChange='updateOverTotalTime(18,0);' disabled></select><a href="#" onClick="callDailyNote(0,18,true)"><img src="img/note.png" name="overnote18_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote18_0" type="hidden"/>
<input name="overprogress18_0" type="hidden"/></td>
<td><div id='overstatus18_1'></div>
<div><select name='overrecord18_1' onChange='updateOverTotalTime(18,1);' disabled></select><a href="#" onClick="callDailyNote(1,18,true)"><img src="img/note.png" name="overnote18_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote18_1" type="hidden"/>
<input name="overprogress18_1" type="hidden"/></td>
<td><div id='overstatus18_2'></div>
<div><select name='overrecord18_2' onChange='updateOverTotalTime(18,2);' disabled></select><a href="#" onClick="callDailyNote(2,18,true)"><img src="img/note.png" name="overnote18_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote18_2" type="hidden"/>
<input name="overprogress18_2" type="hidden"/></td>
<td><div id='overstatus18_3'></div>
<div><select name='overrecord18_3' onChange='updateOverTotalTime(18,3);' disabled></select><a href="#" onClick="callDailyNote(3,18,true)"><img src="img/note.png" name="overnote18_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote18_3" type="hidden"/>
<input name="overprogress18_3" type="hidden"/></td>
<td><div id='overstatus18_4'></div>
<div><select name='overrecord18_4' onChange='updateOverTotalTime(18,4);' disabled></select><a href="#" onClick="callDailyNote(4,18,true)"><img src="img/note.png" name="overnote18_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote18_4" type="hidden"/>
<input name="overprogress18_4" type="hidden"/></td>
<td><div id='overstatus18_5'></div>
<div><select name='overrecord18_5' onChange='updateOverTotalTime(18,5);' disabled></select><a href="#" onClick="callDailyNote(5,18,true)"><img src="img/note.png" name="overnote18_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote18_5" type="hidden"/>
<input name="overprogress18_5" type="hidden"/></td>
<td><div id='overstatus18_6'></div>
<div><select name='overrecord18_6' onChange='updateOverTotalTime(18,6);' disabled></select><a href="#" onClick="callDailyNote(6,18,true)"><img src="img/note.png" name="overnote18_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote18_6" type="hidden"/>
<input name="overprogress18_6" type="hidden"/></td>
<tr style='display:none' id='overrecord19'><td><select name="overproject19" onchange="fillActivity('overproject19','overactivity19'),clearOverRecord('19');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity19' onChange="checkOvertimeActivityDuplicate(19),changeOvertimeActivity('19','overactivity19',document.weekly_info.overproject19.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress19" size='2' readOnly />%</td>
<td><div id='overstatus19_0'></div>
<div><select name='overrecord19_0' onChange='updateOverTotalTime(19,0);' disabled></select><a href="#" onClick="callDailyNote(0,19,true)"><img src="img/note.png" name="overnote19_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote19_0" type="hidden"/>
<input name="overprogress19_0" type="hidden"/></td>
<td><div id='overstatus19_1'></div>
<div><select name='overrecord19_1' onChange='updateOverTotalTime(19,1);' disabled></select><a href="#" onClick="callDailyNote(1,19,true)"><img src="img/note.png" name="overnote19_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote19_1" type="hidden"/>
<input name="overprogress19_1" type="hidden"/></td>
<td><div id='overstatus19_2'></div>
<div><select name='overrecord19_2' onChange='updateOverTotalTime(19,2);' disabled></select><a href="#" onClick="callDailyNote(2,19,true)"><img src="img/note.png" name="overnote19_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote19_2" type="hidden"/>
<input name="overprogress19_2" type="hidden"/></td>
<td><div id='overstatus19_3'></div>
<div><select name='overrecord19_3' onChange='updateOverTotalTime(19,3);' disabled></select><a href="#" onClick="callDailyNote(3,19,true)"><img src="img/note.png" name="overnote19_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote19_3" type="hidden"/>
<input name="overprogress19_3" type="hidden"/></td>
<td><div id='overstatus19_4'></div>
<div><select name='overrecord19_4' onChange='updateOverTotalTime(19,4);' disabled></select><a href="#" onClick="callDailyNote(4,19,true)"><img src="img/note.png" name="overnote19_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote19_4" type="hidden"/>
<input name="overprogress19_4" type="hidden"/></td>
<td><div id='overstatus19_5'></div>
<div><select name='overrecord19_5' onChange='updateOverTotalTime(19,5);' disabled></select><a href="#" onClick="callDailyNote(5,19,true)"><img src="img/note.png" name="overnote19_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote19_5" type="hidden"/>
<input name="overprogress19_5" type="hidden"/></td>
<td><div id='overstatus19_6'></div>
<div><select name='overrecord19_6' onChange='updateOverTotalTime(19,6);' disabled></select><a href="#" onClick="callDailyNote(6,19,true)"><img src="img/note.png" name="overnote19_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote19_6" type="hidden"/>
<input name="overprogress19_6" type="hidden"/></td>
<tr style='display:none' id='overrecord20'><td><select name="overproject20" onchange="fillActivity('overproject20','overactivity20'),clearOverRecord('20');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity20' onChange="checkOvertimeActivityDuplicate(20),changeOvertimeActivity('20','overactivity20',document.weekly_info.overproject20.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress20" size='2' readOnly />%</td>
<td><div id='overstatus20_0'></div>
<div><select name='overrecord20_0' onChange='updateOverTotalTime(20,0);' disabled></select><a href="#" onClick="callDailyNote(0,20,true)"><img src="img/note.png" name="overnote20_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote20_0" type="hidden"/>
<input name="overprogress20_0" type="hidden"/></td>
<td><div id='overstatus20_1'></div>
<div><select name='overrecord20_1' onChange='updateOverTotalTime(20,1);' disabled></select><a href="#" onClick="callDailyNote(1,20,true)"><img src="img/note.png" name="overnote20_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote20_1" type="hidden"/>
<input name="overprogress20_1" type="hidden"/></td>
<td><div id='overstatus20_2'></div>
<div><select name='overrecord20_2' onChange='updateOverTotalTime(20,2);' disabled></select><a href="#" onClick="callDailyNote(2,20,true)"><img src="img/note.png" name="overnote20_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote20_2" type="hidden"/>
<input name="overprogress20_2" type="hidden"/></td>
<td><div id='overstatus20_3'></div>
<div><select name='overrecord20_3' onChange='updateOverTotalTime(20,3);' disabled></select><a href="#" onClick="callDailyNote(3,20,true)"><img src="img/note.png" name="overnote20_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote20_3" type="hidden"/>
<input name="overprogress20_3" type="hidden"/></td>
<td><div id='overstatus20_4'></div>
<div><select name='overrecord20_4' onChange='updateOverTotalTime(20,4);' disabled></select><a href="#" onClick="callDailyNote(4,20,true)"><img src="img/note.png" name="overnote20_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote20_4" type="hidden"/>
<input name="overprogress20_4" type="hidden"/></td>
<td><div id='overstatus20_5'></div>
<div><select name='overrecord20_5' onChange='updateOverTotalTime(20,5);' disabled></select><a href="#" onClick="callDailyNote(5,20,true)"><img src="img/note.png" name="overnote20_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote20_5" type="hidden"/>
<input name="overprogress20_5" type="hidden"/></td>
<td><div id='overstatus20_6'></div>
<div><select name='overrecord20_6' onChange='updateOverTotalTime(20,6);' disabled></select><a href="#" onClick="callDailyNote(6,20,true)"><img src="img/note.png" name="overnote20_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote20_6" type="hidden"/>
<input name="overprogress20_6" type="hidden"/></td>
<tr style='display:none' id='overrecord21'><td><select name="overproject21" onchange="fillActivity('overproject21','overactivity21'),clearOverRecord('21');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity21' onChange="checkOvertimeActivityDuplicate(21),changeOvertimeActivity('21','overactivity21',document.weekly_info.overproject21.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress21" size='2' readOnly />%</td>
<td><div id='overstatus21_0'></div>
<div><select name='overrecord21_0' onChange='updateOverTotalTime(21,0);' disabled></select><a href="#" onClick="callDailyNote(0,21,true)"><img src="img/note.png" name="overnote21_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote21_0" type="hidden"/>
<input name="overprogress21_0" type="hidden"/></td>
<td><div id='overstatus21_1'></div>
<div><select name='overrecord21_1' onChange='updateOverTotalTime(21,1);' disabled></select><a href="#" onClick="callDailyNote(1,21,true)"><img src="img/note.png" name="overnote21_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote21_1" type="hidden"/>
<input name="overprogress21_1" type="hidden"/></td>
<td><div id='overstatus21_2'></div>
<div><select name='overrecord21_2' onChange='updateOverTotalTime(21,2);' disabled></select><a href="#" onClick="callDailyNote(2,21,true)"><img src="img/note.png" name="overnote21_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote21_2" type="hidden"/>
<input name="overprogress21_2" type="hidden"/></td>
<td><div id='overstatus21_3'></div>
<div><select name='overrecord21_3' onChange='updateOverTotalTime(21,3);' disabled></select><a href="#" onClick="callDailyNote(3,21,true)"><img src="img/note.png" name="overnote21_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote21_3" type="hidden"/>
<input name="overprogress21_3" type="hidden"/></td>
<td><div id='overstatus21_4'></div>
<div><select name='overrecord21_4' onChange='updateOverTotalTime(21,4);' disabled></select><a href="#" onClick="callDailyNote(4,21,true)"><img src="img/note.png" name="overnote21_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote21_4" type="hidden"/>
<input name="overprogress21_4" type="hidden"/></td>
<td><div id='overstatus21_5'></div>
<div><select name='overrecord21_5' onChange='updateOverTotalTime(21,5);' disabled></select><a href="#" onClick="callDailyNote(5,21,true)"><img src="img/note.png" name="overnote21_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote21_5" type="hidden"/>
<input name="overprogress21_5" type="hidden"/></td>
<td><div id='overstatus21_6'></div>
<div><select name='overrecord21_6' onChange='updateOverTotalTime(21,6);' disabled></select><a href="#" onClick="callDailyNote(6,21,true)"><img src="img/note.png" name="overnote21_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote21_6" type="hidden"/>
<input name="overprogress21_6" type="hidden"/></td>
<tr style='display:none' id='overrecord22'><td><select name="overproject22" onchange="fillActivity('overproject22','overactivity22'),clearOverRecord('22');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity22' onChange="checkOvertimeActivityDuplicate(22),changeOvertimeActivity('22','overactivity22',document.weekly_info.overproject22.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress22" size='2' readOnly />%</td>
<td><div id='overstatus22_0'></div>
<div><select name='overrecord22_0' onChange='updateOverTotalTime(22,0);' disabled></select><a href="#" onClick="callDailyNote(0,22,true)"><img src="img/note.png" name="overnote22_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote22_0" type="hidden"/>
<input name="overprogress22_0" type="hidden"/></td>
<td><div id='overstatus22_1'></div>
<div><select name='overrecord22_1' onChange='updateOverTotalTime(22,1);' disabled></select><a href="#" onClick="callDailyNote(1,22,true)"><img src="img/note.png" name="overnote22_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote22_1" type="hidden"/>
<input name="overprogress22_1" type="hidden"/></td>
<td><div id='overstatus22_2'></div>
<div><select name='overrecord22_2' onChange='updateOverTotalTime(22,2);' disabled></select><a href="#" onClick="callDailyNote(2,22,true)"><img src="img/note.png" name="overnote22_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote22_2" type="hidden"/>
<input name="overprogress22_2" type="hidden"/></td>
<td><div id='overstatus22_3'></div>
<div><select name='overrecord22_3' onChange='updateOverTotalTime(22,3);' disabled></select><a href="#" onClick="callDailyNote(3,22,true)"><img src="img/note.png" name="overnote22_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote22_3" type="hidden"/>
<input name="overprogress22_3" type="hidden"/></td>
<td><div id='overstatus22_4'></div>
<div><select name='overrecord22_4' onChange='updateOverTotalTime(22,4);' disabled></select><a href="#" onClick="callDailyNote(4,22,true)"><img src="img/note.png" name="overnote22_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote22_4" type="hidden"/>
<input name="overprogress22_4" type="hidden"/></td>
<td><div id='overstatus22_5'></div>
<div><select name='overrecord22_5' onChange='updateOverTotalTime(22,5);' disabled></select><a href="#" onClick="callDailyNote(5,22,true)"><img src="img/note.png" name="overnote22_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote22_5" type="hidden"/>
<input name="overprogress22_5" type="hidden"/></td>
<td><div id='overstatus22_6'></div>
<div><select name='overrecord22_6' onChange='updateOverTotalTime(22,6);' disabled></select><a href="#" onClick="callDailyNote(6,22,true)"><img src="img/note.png" name="overnote22_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote22_6" type="hidden"/>
<input name="overprogress22_6" type="hidden"/></td>
<tr style='display:none' id='overrecord23'><td><select name="overproject23" onchange="fillActivity('overproject23','overactivity23'),clearOverRecord('23');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity23' onChange="checkOvertimeActivityDuplicate(23),changeOvertimeActivity('23','overactivity23',document.weekly_info.overproject23.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress23" size='2' readOnly />%</td>
<td><div id='overstatus23_0'></div>
<div><select name='overrecord23_0' onChange='updateOverTotalTime(23,0);' disabled></select><a href="#" onClick="callDailyNote(0,23,true)"><img src="img/note.png" name="overnote23_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote23_0" type="hidden"/>
<input name="overprogress23_0" type="hidden"/></td>
<td><div id='overstatus23_1'></div>
<div><select name='overrecord23_1' onChange='updateOverTotalTime(23,1);' disabled></select><a href="#" onClick="callDailyNote(1,23,true)"><img src="img/note.png" name="overnote23_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote23_1" type="hidden"/>
<input name="overprogress23_1" type="hidden"/></td>
<td><div id='overstatus23_2'></div>
<div><select name='overrecord23_2' onChange='updateOverTotalTime(23,2);' disabled></select><a href="#" onClick="callDailyNote(2,23,true)"><img src="img/note.png" name="overnote23_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote23_2" type="hidden"/>
<input name="overprogress23_2" type="hidden"/></td>
<td><div id='overstatus23_3'></div>
<div><select name='overrecord23_3' onChange='updateOverTotalTime(23,3);' disabled></select><a href="#" onClick="callDailyNote(3,23,true)"><img src="img/note.png" name="overnote23_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote23_3" type="hidden"/>
<input name="overprogress23_3" type="hidden"/></td>
<td><div id='overstatus23_4'></div>
<div><select name='overrecord23_4' onChange='updateOverTotalTime(23,4);' disabled></select><a href="#" onClick="callDailyNote(4,23,true)"><img src="img/note.png" name="overnote23_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote23_4" type="hidden"/>
<input name="overprogress23_4" type="hidden"/></td>
<td><div id='overstatus23_5'></div>
<div><select name='overrecord23_5' onChange='updateOverTotalTime(23,5);' disabled></select><a href="#" onClick="callDailyNote(5,23,true)"><img src="img/note.png" name="overnote23_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote23_5" type="hidden"/>
<input name="overprogress23_5" type="hidden"/></td>
<td><div id='overstatus23_6'></div>
<div><select name='overrecord23_6' onChange='updateOverTotalTime(23,6);' disabled></select><a href="#" onClick="callDailyNote(6,23,true)"><img src="img/note.png" name="overnote23_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote23_6" type="hidden"/>
<input name="overprogress23_6" type="hidden"/></td>
<tr style='display:none' id='overrecord24'><td><select name="overproject24" onchange="fillActivity('overproject24','overactivity24'),clearOverRecord('24');" disabled>
<option value=''>-- select project --</option>
<option value='17647'>2025_DIL</option>
<option value='17525'>Ai點數腦</option>
<option value='17570'>CYS-會員點數忠誠度行銷系統研發</option>
<option value='17615'>數位創新補助平台計畫-聚焦休閒娛樂微型商家之「AI點數互動平台」-研發</option>
</select></td>
<td><select name='overactivity24' onChange="checkOvertimeActivityDuplicate(24),changeOvertimeActivity('24','overactivity24',document.weekly_info.overproject24.selectedIndex-1);" disabled>
<option value=''>-- select activity --</option>
</select></td>
<td align='center'><input name="overactprogress24" size='2' readOnly />%</td>
<td><div id='overstatus24_0'></div>
<div><select name='overrecord24_0' onChange='updateOverTotalTime(24,0);' disabled></select><a href="#" onClick="callDailyNote(0,24,true)"><img src="img/note.png" name="overnote24_0" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote24_0" type="hidden"/>
<input name="overprogress24_0" type="hidden"/></td>
<td><div id='overstatus24_1'></div>
<div><select name='overrecord24_1' onChange='updateOverTotalTime(24,1);' disabled></select><a href="#" onClick="callDailyNote(1,24,true)"><img src="img/note.png" name="overnote24_1" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote24_1" type="hidden"/>
<input name="overprogress24_1" type="hidden"/></td>
<td><div id='overstatus24_2'></div>
<div><select name='overrecord24_2' onChange='updateOverTotalTime(24,2);' disabled></select><a href="#" onClick="callDailyNote(2,24,true)"><img src="img/note.png" name="overnote24_2" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote24_2" type="hidden"/>
<input name="overprogress24_2" type="hidden"/></td>
<td><div id='overstatus24_3'></div>
<div><select name='overrecord24_3' onChange='updateOverTotalTime(24,3);' disabled></select><a href="#" onClick="callDailyNote(3,24,true)"><img src="img/note.png" name="overnote24_3" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote24_3" type="hidden"/>
<input name="overprogress24_3" type="hidden"/></td>
<td><div id='overstatus24_4'></div>
<div><select name='overrecord24_4' onChange='updateOverTotalTime(24,4);' disabled></select><a href="#" onClick="callDailyNote(4,24,true)"><img src="img/note.png" name="overnote24_4" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote24_4" type="hidden"/>
<input name="overprogress24_4" type="hidden"/></td>
<td><div id='overstatus24_5'></div>
<div><select name='overrecord24_5' onChange='updateOverTotalTime(24,5);' disabled></select><a href="#" onClick="callDailyNote(5,24,true)"><img src="img/note.png" name="overnote24_5" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote24_5" type="hidden"/>
<input name="overprogress24_5" type="hidden"/></td>
<td><div id='overstatus24_6'></div>
<div><select name='overrecord24_6' onChange='updateOverTotalTime(24,6);' disabled></select><a href="#" onClick="callDailyNote(6,24,true)"><img src="img/note.png" name="overnote24_6" width="15" height="15" border="0" alt="" valign='top'></a></div>
<input name="overnote24_6" type="hidden"/>
<input name="overprogress24_6" type="hidden"/></td>

</tr>


        <tr>

    <td colspan='3' align='right'><b>subtotal : &nbsp;</b></td>
    <td><input type="text" name='oveTotal0' size="2" readonly></td>
    <td><input type="text" name="oveTotal1" size="2" readonly></td>
    <td><input type="text" name="oveTotal2" size="2" readonly></td>
    <td><input type="text" name="oveTotal3" size="2" readonly></td>
    <td><input type="text" name="oveTotal4" size="2" readonly></td>
    <td><input type="text" name="oveTotal5" size="2" readonly></td>
    <td><input type="text" name="oveTotal6" size="2" readonly></td>
</tr>


        <tr>

    <td colspan='3' align='right'><b>total time : &nbsp;</b></td>
    <td><input type="text" name='colTotal0' size="2" disabled><a href="#" onClick="javascript:window.open('dailyRecord.jsp?chooseDay=2025-09-08')">&nbsp;<font size="3">?</font></a></td>
    <td><input type="text" name="colTotal1" size="2" disabled><a href="#" onClick="javascript:window.open('dailyRecord.jsp?chooseDay=2025-09-09')">&nbsp;<font size="3">?</font></a></td>
    <td><input type="text" name="colTotal2" size="2" disabled><a href="#" onClick="javascript:window.open('dailyRecord.jsp?chooseDay=2025-09-10')">&nbsp;<font size="3">?</font></a></td>
    <td><input type="text" name="colTotal3" size="2" disabled><a href="#" onClick="javascript:window.open('dailyRecord.jsp?chooseDay=2025-09-11')">&nbsp;<font size="3">?</font></a></td>
    <td><input type="text" name="colTotal4" size="2" disabled><a href="#" onClick="javascript:window.open('dailyRecord.jsp?chooseDay=2025-09-12')">&nbsp;<font size="3">?</font></a></td>
    <td><input type="text" name="colTotal5" size="2" disabled><a href="#" onClick="javascript:window.open('dailyRecord.jsp?chooseDay=2025-09-13')">&nbsp;<font size="3">?</font></a></td>
    <td><input type="text" name="colTotal6" size="2" disabled><a href="#" onClick="javascript:window.open('dailyRecord.jsp?chooseDay=2025-09-14')">&nbsp;<font size="3">?</font></a></td>
</tr>
</table>


<!--
<p id="attachMoreLink2">
    <a href="javascript:addOverRecordInput()">more overtime records</a>
</p>
-->
<script type="text/javascript">

    var nextHiddenIndex2 = 10;
    function addOverRecordInput(){
        for(i=nextHiddenIndex2;i<(nextHiddenIndex2+5);i++){
            eval("overrecord" + i).style.display = document.all ? "block" : "table-row";
        }
        nextHiddenIndex2 = nextHiddenIndex2+5;
        if(nextHiddenIndex2 > 25) eval("attachMoreLink2").style.display = "none";
    }

</script>

    <p align="center"><input type="submit" name="save" value=" save " onclick="return verifyWorkingSave(confWorkingHours);"/> 
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
	<!--modified by hychang 2007-01-11-->
    
    <input type="submit" name="submit" value="submit" onClick="return verifyWorkingSubmit(confWorkingHours);"/>
	</p>

</form>

<table border="0" cellpadding="0" cellspacing="0">
  <tr>
  <td class="sectionHeader" width="427" bordercolor="FFCC66"><p>&nbsp;</p>
    <p>Timecard</p></td>
  </tr>
</table>


</td></tr>

	  <TR>
		  <TD COLSPAN="16" background="/TCRS/images/a01_26.gif">&nbsp;			  </TD>
		  <TD COLSPAN="3" background="/TCRS/images/a01_26.gif">
			  <IMG SRC="/TCRS/images/a01_27.gif" WIDTH=199 HEIGHT=68 ALT=""></TD>
	      </tr>
<TR>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=59 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=48 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=12 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=33 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=27 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=22 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=67 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=22 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=73 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=18 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=53 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=21 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=85 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=30 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=74 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=37 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=76 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=6 HEIGHT=1 ALT=""></TD>
		  <TD>
			  <IMG SRC="/TCRS/images/spacer.gif" WIDTH=117 HEIGHT=1 ALT=""></TD>
	  </TR>

</table>


</body>
</html>