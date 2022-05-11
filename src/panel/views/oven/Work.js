/*
 * @Author: your name
 * @Date: 2020-12-21 15:54:15
 * @LastEditTime: 2021-03-15 17:40:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bath-heater\src\panel\views\timer\Operate.js
 */
import React from 'react';

import BottomButton from 'componentsPath/dna/BottomButton';
import FixBottom from 'componentsPath/dna/FixBottom'
import Page from 'componentsPath/dna/Page';
import NavBar from 'componentsPath/dna/NavBar';
import Modal from 'componentsPath/Modal';
import { injectIntl } from 'react-intl';
import { inject } from "componentsPath/injector";
import { isIphoneX } from "componentsPath/device";
import classNames from 'classnames';
import style from 'stylesPath/index.less'



class Work extends React.PureComponent {
    state = {
        rotateVal: 0,
        flag: false
    }
    componentDidMount () {
        const { oe_runningstate } = this.props;    //0: 取消 1: 开启 2: 暂停
        console.log('componentDidMount', oe_runningstate);
        if (oe_runningstate === 1) {
            this.rotate();
        }

    }
    componentWillReceiveProps (nextProps) {
        console.log(nextProps.oe_runningstate,'componentWillReceiveProps',this.props.oe_runningstate);
        if(nextProps.oe_runningstate!==this.oe_runningstate &&nextProps.oe_runningstate===1){

            if(this.InterVal){
                console.log('this.InterVal',this.InterVal);
                clearInterval(this.InterVal);
            }
            this.rotate();
        }
        if(nextProps.oe_runningstate!==this.oe_runningstate &&nextProps.oe_runningstate!==1){
            clearInterval(this.InterVal);
        }
    }
    componentWillUnmount () {
        clearInterval(this.InterVal);
    }
    rotate () {
        this.InterVal = setInterval(() => {
            this.setState({ rotateVal: this.state.rotateVal + 10, flag: true })
        }, 100)
    }
    onclickBtn = (parame) => {
        if (parame === 'stop' && this.state.flag) {
            this.setState({ flag: !this.state.flag })
            this.props.control({ 'oe_runningstate': 2 }) 
        } else if (parame === 'cancel') {
            Modal.confirm(this.props.intl.formatMessage({ id: 'cancelTips' }), () => {
                this.props.control({ 'oe_runningstate': 0 },{onSuccess:()=> this.props.history.push('/')}) 
                return true
            }, () => { return true });
        } else if (parame === 'continue') {
            this.props.control({ 'oe_runningstate': 1 })
         
        }
    }
    toHourMinute (minutes) {

        const ls=minutes % 60;   

        return ("0"+Math.floor(minutes / 60) + ":" +( ls>9?`${(minutes % 60)}`:`0${minutes % 60}`));
    }
    render () {
        const { intl: { formatMessage }, history, oe_funmode, oe_runningstate, envtemp, oe_boxworktime, err_code } = this.props;

        //蒸箱工作时长: oe_boxworktime 
        const { rotateVal } = this.state;
        const currMode = [
            formatMessage({ id: 'oe_funmode0' }), formatMessage({ id: 'oe_funmode1' }), formatMessage({ id: 'oe_funmode2' }), formatMessage({ id: 'oe_funmode3' }),
            formatMessage({ id: 'oe_funmode4' }), formatMessage({ id: 'oe_funmode5' }), formatMessage({ id: 'oe_funmode6' }), formatMessage({ id: 'oe_funmode7' })];
        console.log('oe_runningstate:', oe_runningstate);

        return (
            <div className={style.workPage}>
                <Page>
                    <NavBar title={formatMessage({ id: "oven" })} color={'#000'} right={[]} opacity code={err_code} />
                    {/* device */}
                    <div className={classNames(style.topBox, { [style.topBoxX]: isIphoneX })}>
                        <div className={style.workState}>
                            <div className={classNames({ [style.stateBg]: true })} style={{ transform: 'rotate(' + rotateVal + 'deg)', transition: '0.1s linear' }}>
                            </div>
                            <div className={style.stateInfo}>
                                <div>{currMode[oe_funmode]} I {envtemp}℃</div>
                                <p>{oe_runningstate===0 ? <span>{formatMessage({ id: 'done' })}</span>:this.toHourMinute(oe_boxworktime)}</p>
                                {oe_runningstate===0 ?  '':formatMessage({ id: 'remainTime' })}
                            </div>
                        </div>
                        <div className={style.stateText}>{oe_runningstate === 1 ? formatMessage({ id: 'working' }) : oe_runningstate === 2 ? formatMessage({ id: 'pause' }) : ''}</div>

                    </div>
                    <FixBottom adaptToX='margin'>
                        {
                            oe_boxworktime ?
                                <div className={style.btnbottom}>
                                    {/*eslint-disable*/}
                                    <a onClick={() => { this.onclickBtn('cancel') }}>{formatMessage({ id: 'cancel' })}</a>
                                    {
                                        oe_runningstate === 1 ? <a onClick={() => { this.onclickBtn('stop') }}>{formatMessage({ id: 'stop' })}</a> :
                                            <a onClick={() => { this.onclickBtn('continue') }}>{formatMessage({ id: 'continue' })}</a>
                                    }
                                </div> : <div className={style.bottomBtn}><BottomButton text={formatMessage({ id: 'affirm' })} onClick={() => { history.push('/') }} /> </div>
                        }
                    </FixBottom>
                </Page>
            </div>
        )
    }
}

export default inject(['oe_funmode', 'oe_runningstate', 'envtemp', 'oe_boxworktime', 'err_code'])(injectIntl(Work));