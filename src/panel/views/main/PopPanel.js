/*
 * @Author: your name
 * @Date: 2020-12-07 14:25:16
 * @LastEditTime: 2021-03-31 09:24:10
 * @LastEditors: Please set LastEditors
 * @Description: 方法组件
 * @FilePath: \curtain\src\panel\components\Function\function.js
 */
import React ,{useMemo, useCallback }from 'react';
import { control } from 'componentsPath/logic';
import classNames from 'classnames';
import Popup from 'componentsPath/dna/Popup';
import Scroller from 'componentsPath/Scroller'
import Modal from 'componentsPath/Modal';
import style from 'stylesPath/index.less';
import config from 'configPath';
import { importImgs } from 'utilsPath';

const imgs = importImgs();

// 风速选择
const Gear = (props) => { 
  const { gear } = config;
  const { formatMessage, getContent, setControl, oe_runningstate, oe_funmode } = props;
  const linkage = [0,1,2,3,4,5];
  const { button, status } = getContent();
  const { mutual, pwr } = status;
  const ovenModal = () => { 
    // 烟机联动模式：普通蒸--高温蒸--普通烤--加湿烤--烘焙烤--高温消毒
    if (oe_runningstate&&linkage.includes(oe_funmode)) { 
      Modal.alert(formatMessage({id:'ovenLinkageTip'}));
      return true;
    }
  }
  const select = (val) => { 
    // 烟机联动判断
    if (val === 0) { 
      if (ovenModal()) return;
    }
    
    // 关闭增压
    setControl({[pwr]:val,[mutual]:0});
  }

  return (
    <div className={style.content}>
      <div className={style.list}>
      {
        Object.keys(gear).map(item =>
          <div key={gear[item]} className={style.item} onClick={()=>{select(gear[item])} }>
            {formatMessage({id:item})}
            {
              props[pwr] === gear[item] &&
              <img alt='' src={imgs.selected} className={ style.selected}/> 
            }
          </div>
        )
      }
    </div>
    <div className={classNames(style.flex,style.panelBottom)}>
         {
           button.map(item => {
            return (
              <div key={item.text} className={style.flexChild} onClick={item.onClick}>{formatMessage({id:item.text}) }</div>
            )
          })      
         }     
    </div>         
    </div>      
  )
}

// 头部保温、清洗通用
const Common = (props) => { 
  const { formatMessage, getContent, tab, flag, setControl } = props;
  
  const { button, status } = getContent(tab);
  const { mutual,pwr, time } = status;
  const defaultValue = 30;
  let command =useMemo(()=>({
    [pwr]: 1,
    [time]:defaultValue,
  }),[]) ;
  // 时间范围
  let range=config[flag];
  if (flag === 'wash') { 
    range = config[flag][parseInt(tab)];
  }

  // 时间选择
  const TimePickerBase = () => { 
    const data = ({ min,max,step}) => {
      const data = [];
      for (let i = min; i<= max; i=i+step) { 
        data.push(i < 10 ? `0${i}` : `${i}`);
      }
      return data;
    };
    const onChange = (val) => {
      command[time] = parseInt(val);
    }
    
    return (
      <div className={style.ptb20}>
        <Scroller defaultValue={`${defaultValue}`} rows={3} wheels={[[{ label: formatMessage({ id: "min" }), values:data(range) }]]} onChange={onChange}/>
      </div>
    )
  }

  const TimePicker = useCallback(() => <TimePickerBase/>,[])

  // 倒计时
  const CountDown = () => { 
    return (
      <div className={style.countDown}>
        <div>
          <div className={classNames(style.count,style.themeColor)}>
            <div className={style.number}>{ props[time]}</div>
            <div className={style.unit}>min</div>
          </div>
          <img alt='' src={imgs.count_down }/>
        </div>
        
        <div className={style.remain}>{formatMessage({id:'remainTime'})}</div>
      </div>
    )
  }

  const click = (item) => {
    const { text, onClick } = item;
    if (onClick) {
      onClick();
      return;
    }
    
    if (text === 'close') {
      // 关闭
      setControl({[pwr]:0});
    } else { 
      // 互斥判断
      if (flag === 'wash') {
        let msg = props[mutual] === 0 ? '' : `tab${tab}Tips`;
        if (msg) { 
          Modal.alert(formatMessage({id:msg}));
          return;
        }
      }
      // 头部保温确认、开始清洗
      setControl(command);
    }
  }

  const btns = ['close',  'start']; //按钮配置
  return (
    <div>
      <div className={classNames(style.content,style.panelBox,'timeDefined')}>
        {
          props[pwr] === 1 ?
            <CountDown /> :
            <TimePicker/>
        }
      </div>
      <div className={classNames(style.flex,style.panelBottom)}>
         {
           button.map(item => {
            return (
              <div key={item.text} className={classNames(style.flexChild,{[style.themeColor]:btns.includes(item.text)})} onClick={() => { click(item) }}>
                {formatMessage({ id: item.text })}
                {
                  btns.includes(item.text) &&
                    `${formatMessage({ id: 'popBtn' }, {flag:flag==='wash'?1:0})}`
                }
              </div>
            )
          })      
         }     
      </div>         
    </div>
  )
}

const PopPanel = (props) => {
  const { className,intl: { formatMessage },updatePopup,flag} = props;
  const classes = Array.isArray(className) ? className : [className];

  // 设备控制
  const setControl = (status) => {
    const { showError} = props;
    showError(() => {
      control(status, { onSuccess: () => updatePopup() })
    })
  }

   // 内容设置
  const getContent = (flag,tab) => { 
    let config = {
      status: {
        mutual:'oe_presspwr',
        pwr: 'oe_gear',
        time: '',
      },
      button: [
        {
          text: ['cancel'],
          onClick: updatePopup,
        }
      ],
    }
    let text;
    switch (flag) { 
      case 'headHeat':
        const { oe_headinsul, } = props;
        config.status = {
          pwr: 'oe_headinsul',
          time:'oe_holdingtime',
        }
        text = oe_headinsul === 1 ? 'close' : 'confim';
        config.button.push({text})
        break;
      case 'wash':
        const wash = { // 风机
          mutual:'oe_gear',
          pwr: 'oe_washpwr',
          time:'oe_fanwashtime',
        }
        const box = { // 蒸箱
          mutual:'oe_runningstate',
          pwr: 'oe_boxwashpwr',
          time:'oe_boxwashtime',
        }
        config.status = tab === '0' ? wash : box;
        const { pwr } = config.status;
        text = props[pwr] === 0 ? 'start' : 'close';
        config.button.push({text})
        break;
      default:
        break;
    }
    return config;
  }

  let title;
  const titleMap = {
    gear: 0,
    headHeat: 1,
    wash:[2,3]
  }

  if (Array.isArray(titleMap[flag])) {
    title = titleMap[flag].map(item => formatMessage({ id: 'popTitle' }, { text: item })); // Tab标题
  } else { 
    title = formatMessage({ id: 'popTitle' }, { text: titleMap[flag] });
  }
  
  return (
    <div className={classNames(style.PopPanel, ...classes)}>
      {
        flag === 'wash' ?
          
        <Popup tab defaultActiveKey='0'>
        {
          title.map((item, index) =>
            <Popup.TabPane key={`${index}`} tab={item} >
            <Common tab={`${index}`} {...props} formatMessage={formatMessage} getContent={(tab)=>getContent(flag,tab)} flag={flag} setControl={setControl} />
          </Popup.TabPane>
        )
        }
        </Popup>
          
          :
          
        <Popup title={title}>
       {
          flag === 'gear' &&
          <Gear {...props} formatMessage={formatMessage} getContent={()=>getContent(flag)} setControl={ setControl}/> 
        }

        {
          flag === 'headHeat' &&
          <Common  {...props} formatMessage={formatMessage} flag={flag} getContent={()=>getContent(flag)} setControl={ setControl}/>
        } 
        </Popup>
      }
    </div>
  )
}

export default PopPanel;