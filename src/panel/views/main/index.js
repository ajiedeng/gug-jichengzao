/*
 * @Author: your name
 * @Date: 2020-12-07 17:07:44
 * @LastEditTime: 2021-03-31 15:04:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \panel\Main.js
 */
import React from 'react';
import {injectIntl} from 'react-intl';
import {isIphoneX,isFullScreen} from "componentsPath/device";
import { inject } from "componentsPath/injector";
import classNames from 'classnames';
import Page from 'componentsPath/dna/Page';
import NavBar from 'componentsPath/dna/NavBar';
import Enum from 'componentsPath/dna/Enum';
import FixBottom from 'componentsPath/dna/FixBottom';
import Button from 'componentsPath/dna/Button'
import Modal from 'componentsPath/Modal';
import Message from 'componentsPath/dna/Message'
import Swiper from 'componentsPath/dna/Swiper';
import { getKeys,importImgs,getDeviceInfo,getStatusBar } from 'utilsPath';
import config from 'configPath';
import style from 'stylesPath/index.less'
import Close from './Close'
import PopPanel from './PopPanel'

const imgs = importImgs();

// 蒸烤箱跳转
const goOven = (props) => { 
    const { history, oe_runningstate } = props;
    // if (err_code !== 0) return;   
    let path='/oven';
    if (oe_runningstate !== 0) { 
        path=`${path}/work`
    }
    history.push({pathname:path});
}

const services = {
    pwr: {
        key: 'pwr',
    },
    gear: {
        key: 'oe_gear',
        value: () => 0,
        isPop: true,
    },
    headLight: {
        key:'light'
    },
    oven: {
        key: 'oe_runningstate',
        value: () => 0,
        onClick: (props) => {
            goOven(props)
        },
    },
    press: {
        key:'oe_presspwr',
    },
    inLight: {
        key:'oven_lgt',
    },
    headHeat:{
        key: 'oe_headinsul',
        isPop: true,
    },
    wash:{
        key: 'wash',
        value: (props) => {
            const { oe_washpwr, oe_boxwashpwr } = props;
            let value = 1;
            if (oe_washpwr === 0 && oe_boxwashpwr === 0) { 
                value = 0;
            }
            return value;
        },
        isPop: true,
    },
};

// 左右灶状态
const Kitchen = (props) => {
    const { intl: { formatMessage }, title, } = props;
    const lfOven = {
        value:'oe_lfstate',
        timer:'oe_lstovetiming',
        label: 'lfOven',
    }
    const rtOven = {
        value:'oe_rfstate',
        timer:'oe_rstovetiming',
        label: 'rtOven',
    }
    const status = title === 'left' ? lfOven : rtOven;
    const { value, timer, label } = status;
    
    return (
        <>
            <div className={style.box}>
                <span className={classNames(style.label,{[style.themeColor]:props[value]===1})}>{formatMessage({id:label })}</span>
                <img alt='' src={imgs[props[value] === 1 ? 'kitchen_on' : 'kitchen_off']} />
            </div>
            <div className={style.subTips}>
                {
                    props[value] === 1 ? 
                    (
                            props[timer] === 0 ? formatMessage({ id: 'working' })   
                                :
                            <>
                                    <span className={classNames({ [style.themeColor]: props[value] === 1 },style.pr5)}>{props[timer] }</span>
                                    {formatMessage({ id: 'ovenMsg' }, {unit:0}) }
                            </>        
                     ) :
                    formatMessage({ id: 'ovenClose' })
                }
                
            </div>
        </>   
    )
}


class Main extends React.PureComponent {
    constructor(props) { 
        // 构造函数
        super(props)
        this.state = {
            loopId:null,
            title: null,   
            current: 'gear',
            isPopup: false,
            statusHeight:0,
        }
        console.log(props)
      }
      componentDidMount() {
        // DOM加载完成
        this.getInfo();
        this.loopId = setInterval(async () => {
            this.getInfo();
        }, 3000)  
        this.setStatusHeight();
      }

      componentDidUpdate(prevProps) { 
        // DOM更新
        //   popup初始化
        if (prevProps.pwr===0  && this.props.pwr === 1) {
            this.setState({
             isPopup:false,
            })
        }
    }
    
      componentWillUnmount() { 
        // DOM卸载
        if (this.loopId) {
            window.clearInterval(this.loopId)
        }
    }  
    // 查询设备
    async getInfo() { 
        const { intl: { formatMessage } } = this.props;
        const deviceInfo = await getDeviceInfo(false);
        const { name=formatMessage({ id: 'title' }) } = deviceInfo;
        this.setState({
            title: name
        });
    }

    async setStatusHeight() { 
        const height = await getStatusBar();
        this.setState({
            statusHeight:height,
        })
    }

    // 设置button图片
     setImg = (label) => {
        let value,img,flag;
        const srv = services[label];
         if (srv.value) {
             value = srv.value(this.props);
         } else {
             value = this.props[srv.key];
        }
        flag = value === 0 ? "off" : 'on';
        img = imgs[`${label}_${flag}`];
        return img;
    }

    // 故障判断
    showError = (callback) => { 
        const { err_code } = this.props;
        if (err_code !== 0) {
            callback()
            return;
        } else { 
            callback();
        }
    }

    // Modal弹窗
    showModal = (label) => { 
        const {intl: { formatMessage },oe_washpwr,oe_boxwashpwr,oe_gear,oe_presspwr } = this.props;
        let msg;
        switch (label) { 
            case 'gear':
                msg = oe_washpwr === 1 ? `${label}Tips` : '';
                break;
            case 'oven':
                msg = oe_boxwashpwr === 1 ? `${label}Tips` : '';
                break;
            case 'press':
                msg = (oe_gear === 0)&&(oe_presspwr===0) ? `${label}Tips` : '';
                break;
            default:
                break;
        }
        if (msg) { 
            Modal.alert(formatMessage({id:msg}));
        }
        return msg;
    }

    // 控制命令
    setControl = (srv, label) => {
        this.showError(()=>{this.control(srv, label)})
    } 

    control = (srv = { key: 'pwr' }, label) => {
        if (this.showModal(label)) {
            return;
        }
        
        // 界面跳转
        if (srv.onClick) { 
            srv.onClick(this.props);
            return;
        }
        
        // 显示popup
        if (srv.isPop) { 
            this.setState({
                current: label,
                isPopup:true,
            })
            return;
        }
        
        const { control} = this.props;
        const { key } = srv;
        const value = this.props[key] === 0 ? 1 : 0;
        control({[key]:value});
    }

    // 更新popup状态
    updatePopup = () => {
        this.setState({
            isPopup:false,
        })
    }

    // 主图
    getStatus = () => { 
        const { gear } = config;
        const { oe_gear } = this.props;
        let img,status;
        Object.keys(gear).forEach(v => {
            if (gear[v] === oe_gear) { 
                img = `gear_${v}`
                status = v;
            }
        });
        return {
            img:imgs[img],
            status,
        };
    }
    
    render(){
        const { intl: { formatMessage }, pwr, oe_runningstate, err_code, message} = this.props;
        const { title,statusHeight } = this.state;
        const { current,isPopup } = this.state;
        const { img, status } = this.getStatus();
        const fixedStyle = {
            marginTop:statusHeight+'px'
        }
        return (
            <Page saveBottom className={ style.bgColor}>
                {/* navbar */}
                <NavBar exit title={title} color={'#000'} opacity/>
                
                <div className={style.main}>
                  {
                    pwr === 1 ?
                    
                    <>
                        {/* device */}
                        <div className={classNames(style.topBox,{[style.topBoxX]:isIphoneX||isFullScreen()})}>
                            {
                                oe_runningstate!==0&&        
                                        <div className={style.jump} style={ fixedStyle} onClick={() => goOven(this.props)}>{`${formatMessage({ id: 'ovenStatus' }, {state:oe_runningstate})}`}</div>
                            }
                            <div className={style.mainImg }><img src={img} alt=''/></div>
                            <div className={style.tips} >{formatMessage({ id: 'fan' }, { status: formatMessage({id:status})}) }</div>
                            <div className={style.flex}>
                                        <div className={style.flexChild}>
                                            <Kitchen title="left" {...this.props}/>
                                        </div>
                                        <div className={style.flexChild}>
                                            <Kitchen title="right" {...this.props}/>
                                        </div>
                            </div>
                        </div>
   
                        {/* bottom */}
                            <FixBottom adaptToX='padding' className={[style.bottom, style.fontColor]}>
                                    <Swiper>
                                        {
                                            [0, 1].map(i => 
                                                <Enum key={i}> 
                                                    {
                                                        Object.keys(services).filter((v, index) =>parseInt(index / 4) === i).map(label => {
                                                            const srv = services[label];
                                                            return (
                                                                <Button key={label} label={formatMessage({ id: label })}
                                                                    image={this.setImg(label)}
                                                                    onClick={() => {this.setControl(srv,label)} }
                                                                />
                                                            )
                                                         })
                                                    }    
                                                </Enum>
                                                ) 
                                        }
                                    </Swiper>
                            </FixBottom>   
                            {
                                isPopup &&
                                <PopPanel showError={this.showError} flag={current} updatePopup={this.updatePopup} {...this.props}/>
                            }
                     </>
                        
                        :
                        
                        <Close formatMessage={formatMessage} img={imgs.pwr_off} setControl={this.setControl}/>
                    }
                </div>
                <Message msg={formatMessage({ id: 'toastTips' }, {code:err_code-154})} code={err_code} message={ message}/>
            </Page>
        )
    }
}



export default inject(getKeys())(injectIntl(Main));