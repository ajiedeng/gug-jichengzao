/*
 * @Author: your name
 * @Date: 2021-02-23 10:17:22
 * @LastEditTime: 2021-03-15 17:38:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\oven\Set.js
 */
/*
 * @Author: your name
 * @Date: 2020-12-21 15:51:20
 * @LastEditTime: 2021-02-23 09:58:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bath-heater\src\panel\views\timer\Set.js
 */
import React from 'react';
import BottomButton from 'componentsPath/dna/BottomButton'
import Page from 'componentsPath/dna/Page';
import NavBar from 'componentsPath/dna/NavBar';
import Slider from 'componentsPath/Slider';
import Scroller from 'componentsPath/Scroller';
import { injectIntl } from 'react-intl';
import { inject } from "componentsPath/injector";
import classNames from 'classnames';
import style from 'stylesPath/index.less'


const creatArr = (min, max, step) => {
    let setArr = [];
    for (let i = min; i <= max; i += step) {
        const ii = i >= 10 ? `${i}` : `0${i}`
        setArr.push(ii)
    }
    return setArr;
}

class Set extends React.PureComponent {
    state = {
        isShow: 0,
        tempVal: 0,
        disable:false,
        cmdCtrol:{
            'oe_funmode': 0,
            'envtemp':100,
            'oe_worktimeset':40
        }
    }
    setControl = (srv, index) => {
        console.log(srv, '------', index);
        this.setState({ isShow: index, tempVal: 0,cmdCtrol:{
            'oe_funmode': index,
            'envtemp': (index === 2 || index === 3 || index === 4) ? 200 : (index === 1 || index === 5) ? 120 : (index === 6) ? 38 : (index === 7) ? 55 : 100,
            'oe_worktimeset': (index === 0 || index === 7) ? 40 : (index === 1 || index === 6) ? 60 : (index === 2) ? 25 : (index === 3 || index === 4) ? 45 : 50
        } });
        // this.props.control({
        //     'oe_funmode': index,
        //     'envtemp': (index === 2 || index === 3 || index === 4) ? 230 : (index === 1 || index === 5) ? 120 : (index === 6) ? 38 : (index === 7) ? 55 : 100,
        //     'oe_worktimeset': (index === 0 || index === 7) ? 40 : (index === 1 || index === 6) ? 60 : (index === 2) ? 25 : (index === 3 || index === 4) ? 45 : 50
        // })
    }
    goWork = () => {
        const { history } = this.props;
        // 运行状态:oe_runningstate 0: 取消 1: 开启2: 暂停 
        const{cmdCtrol}=this.state;
        cmdCtrol.oe_runningstate=1;
        this.props.control(cmdCtrol,()=>{
            history.replace('/oven/work');
        }) 
        
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.oe_runningstate !== this.props.oe_runningstate && nextProps.oe_runningstate  !== 0) {
            this.props.history.replace('/oven/work');
        }
    }
    getSliderCofig = () => {
        const{cmdCtrol}=this.state;
        const commenConfig = {
            oe_funmode0: { //普通蒸
                min: 85,
                max: 100,
                step: 1,
                value:cmdCtrol.envtemp,
                ticks: [85, 100],
                slideStop: (val) =>this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                unit:'℃',
                oe_worktimeset: creatArr(5, 120, 1),
                defult_time: '40'

            },
            oe_funmode1: { //高温烤
                min: 100,
                max: 120,
                step: 1,
                value:cmdCtrol.envtemp,
                ticks: [100, 120],
                slideStop: (val) =>this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                unit:'℃',
                oe_worktimeset: creatArr(5, 120, 1),
                defult_time: '60'
            },
            oe_funmode2: { //普通烤
                min: 100,
                max: 230,
                step: 1,
                value:cmdCtrol.envtemp,
                ticks: [100, 230],
                slideStop: (val) =>this.setState({cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                unit:'℃',
                oe_worktimeset: creatArr(5, 120, 1),
                defult_time: '25'
            },
            oe_funmode3: { //加湿烤
                min: 100,
                max: 230,
                step: 1,
                value:cmdCtrol.envtemp,
                ticks: [100, 230],
                slideStop: (val) =>this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                unit:'℃',
                oe_worktimeset: creatArr(5, 120, 1),
                defult_time: '45'
            },
            oe_funmode4: { //烘焙烤
                min: 100,
                max: 230,
                step: 1,
                value:cmdCtrol.envtemp,
                ticks: [100, 230],
                slideStop: (val) =>this.setState({cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                unit:'℃',
                oe_worktimeset: creatArr(5, 120, 1),
                defult_time: '45'
            },
            oe_funmode5: { //高温消毒
                min: 100,
                max: 120,
                step: 1,
                value:cmdCtrol.envtemp,
                ticks: [100, 120],
                slideStop: (val) =>this.setState({cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                unit:'℃',
                oe_worktimeset: creatArr(5, 120, 1),
                defult_time: '50'
            },
            oe_funmode6: { //发酵
                min: 100,
                max: 120,
                step: 1,
                value: cmdCtrol.envtemp,
                ticks: [100, 120],
                slideStop: (val) => this.setState({cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                unit:'℃',
                oe_worktimeset: creatArr(20, 99, 1),
                defult_time: '60'
            },
            oe_funmode7: { //解冻
                min: 55,
                max: 65,
                step: 1,
                value:cmdCtrol.envtemp,
                ticks: [55, 65],
                slideStop: (val) => this.setState({cmdCtrol: {...this.state.cmdCtrol,"envtemp":val} }),
                change: (val) => this.setState({ cmdCtrol: {...this.state.cmdCtrol,"envtemp":val.newValue} }),
                ticksLabels: [],
                tooltip: 'hide',
                oe_worktimeset: creatArr(5, 60, 1),
                defult_time: '40'
            }
        }

        return commenConfig
    }
 
    plusBtn = () => {
        const { tempVal,cmdCtrol,isShow} = this.state;
        console.log(tempVal, '+++++tempVal');
        if ((!cmdCtrol.oe_funmode && cmdCtrol.envtemp >= 100) || (isShow === 1 && cmdCtrol.envtemp === 120)||((isShow === 2 || isShow === 3 || isShow === 4) && cmdCtrol.envtemp >= 230)|| (isShow === 7 && cmdCtrol.envtemp >= 65)) {
    
            this.setState({'disable':true});
            return
        }
        this.setState({
            cmdCtrol: { 'oe_funmode':cmdCtrol.oe_funmode, 'envtemp':this.state.cmdCtrol.envtemp+1,'oe_worktimeset':cmdCtrol.oe_worktimeset}
        })
        // this.setState({
        //     tempVal: tempVal ? parseInt(tempVal) + 1 : envtemp + 1
        // }, () => {
        //     control({ 'envtemp': this.state.tempVal })
        // })
    }
    minusBtn = () => {
        const { tempVal,cmdCtrol,isShow } = this.state;
        const {envtemp} = this.props;
        console.log(tempVal, '----tempVal', envtemp);
        if ((!cmdCtrol.oe_funmode && cmdCtrol.envtemp <= 85) || ((isShow === 1 || isShow === 2 || isShow === 3 || isShow === 4) && (cmdCtrol.envtemp <= 100)) || (isShow === 7 && cmdCtrol.envtemp <= 55)) {
            this.setState({'disable':true});
            return
        }
        // this.setState({
        //     tempVal: tempVal ? parseInt(tempVal) - 1 : envtemp - 1
        // }, () => { control({ 'envtemp': this.state.tempVal }) })
        this.setState({
            cmdCtrol: { 'oe_funmode':cmdCtrol.oe_funmode, 'envtemp':this.state.cmdCtrol.envtemp-1,'oe_worktimeset':cmdCtrol.oe_worktimeset}
        })
    }
    render () {
        // 蒸箱工作时间设置:oe_worktimeset
        const { intl: { formatMessage }, oe_funmode, err_code } = this.props;
        // console.log('Set-----',this.props);
        const { isShow, cmdCtrol } = this.state;
        return (
            <div className={style.setPage}>
                <Page saveBottom>
                    {/* navbar */}
                    <NavBar title={formatMessage({ id: 'oven' })} color={'#555'} right={[]} code={err_code} />
                    <div className={style.modeSet}>{formatMessage({ id: 'modeSet' })}</div>
                    <ul className={style.modelist}>
                        {
                            Object.keys(this.getSliderCofig()).map((label, index) => {
                                const item = this.getSliderCofig()[label];
                                return (
                                    <li key={label} className={classNames({ [style.selected]: isShow === -1 ? index === oe_funmode : index === isShow })} onClick={() => { this.setControl(item, index) }}>{formatMessage({ id: label })}</li>
                                )
                            })
                        }
                    </ul>
                    <div className={style.modeSet}>{formatMessage({ id: 'tempSet' })}</div>
                    <div className={classNames({ [style.tempSet]: true, 'tempSet': true })}>
                        {(isShow !== 6 && isShow !== 5) && <p><span>{cmdCtrol.envtemp}</span>℃</p>}
                        {(isShow !== 6 && isShow !== 5) && <div className={classNames({ [style.btn]: true, [style.plus]: true,[style.disable]:(!cmdCtrol.oe_funmode && cmdCtrol.envtemp <= 85) || ((isShow === 1 || isShow === 2 || isShow === 3 || isShow === 4) && (cmdCtrol.envtemp <= 100)) || (isShow === 7 && cmdCtrol.envtemp <= 55)})} onClick={this.minusBtn}></div>}
                        {isShow === 0 && <Slider  {...this.getSliderCofig().oe_funmode0} />}
                        {isShow === 1 && <Slider  {...this.getSliderCofig().oe_funmode1} />}
                        {isShow === 2 && <Slider  {...this.getSliderCofig().oe_funmode2} />}
                        {isShow === 3 && <Slider  {...this.getSliderCofig().oe_funmode3} />}
                        {isShow === 4 && <Slider  {...this.getSliderCofig().oe_funmode4} />}
                        {isShow === 5 && <div className={style.keepTemp}>120℃</div>}
                        {isShow === 6 && <div className={style.keepTemp}>38℃</div>}
                        {isShow === 7 && <Slider  {...this.getSliderCofig().oe_funmode7} />}
                        {(isShow !== 6 && isShow !== 5) && <div className={classNames({ [style.btn]: true, [style.minus]: true ,[style.disable]:(!cmdCtrol.oe_funmode && cmdCtrol.envtemp >= 100) || (isShow === 1 && cmdCtrol.envtemp === 120)||((isShow === 2 || isShow === 3 || isShow === 4) && cmdCtrol.envtemp >= 230)|| (isShow === 7 && cmdCtrol.envtemp >= 65)})} onClick={this.plusBtn}></div>}
                    </div>
                    <div className={style.modeSet}>{formatMessage({ id: 'timeSet' })}</div>
                    <div className={classNames({ [style.selectTime]: true, 'timeDefined': true })}>
                        {
                            isShow === 0 &&
                            <Scroller
                                layout={'liquid'}
                                wheels={[[{ values: this.getSliderCofig().oe_funmode0.oe_worktimeset, label: [formatMessage({ id: 'min' })] }]]}
                                rows={3} display={'inline'} onChange={value => this.setState({ cmdCtrol: {'oe_funmode':cmdCtrol.oe_funmode,"envtemp":cmdCtrol.envtemp,"oe_worktimeset": parseInt(value)} })} defaultValue={this.getSliderCofig().oe_funmode0.defult_time}
                            />
                        }
                        {
                            isShow === 1 &&
                            <Scroller
                                layout={'liquid'}
                                wheels={[[{ values: this.getSliderCofig().oe_funmode1.oe_worktimeset, label: [formatMessage({ id: 'min' })] }]]}
                                rows={3} display={'inline'} onChange={value =>this.setState({ cmdCtrol: {'oe_funmode':cmdCtrol.oe_funmode,"envtemp":cmdCtrol.envtemp,"oe_worktimeset": parseInt(value)} })} defaultValue={this.getSliderCofig().oe_funmode1.defult_time}
                            />
                        }
                        {
                            isShow === 2 &&
                            <Scroller
                                layout={'liquid'}
                                wheels={[[{ values: this.getSliderCofig().oe_funmode2.oe_worktimeset, label: [formatMessage({ id: 'min' })] }]]}
                                rows={3} display={'inline'} onChange={value =>this.setState({ cmdCtrol: {'oe_funmode':cmdCtrol.oe_funmode,"envtemp":cmdCtrol.envtemp,"oe_worktimeset": parseInt(value)} })} defaultValue={this.getSliderCofig().oe_funmode2.defult_time}
                            />
                        }
                        {
                            isShow === 3 &&
                            <Scroller
                                layout={'liquid'}
                                wheels={[[{ values: this.getSliderCofig().oe_funmode3.oe_worktimeset, label: [formatMessage({ id: 'min' })] }]]}
                                rows={3} display={'inline'} onChange={value =>this.setState({ cmdCtrol: {'oe_funmode':cmdCtrol.oe_funmode,"envtemp":cmdCtrol.envtemp,"oe_worktimeset": parseInt(value)} })} defaultValue={this.getSliderCofig().oe_funmode3.defult_time}
                            />
                        }
                        {
                            isShow === 4 &&
                            <Scroller
                                layout={'liquid'}
                                wheels={[[{ values: this.getSliderCofig().oe_funmode4.oe_worktimeset, label: [formatMessage({ id: 'min' })] }]]}
                                rows={3} display={'inline'} onChange={value =>this.setState({ cmdCtrol: {'oe_funmode':cmdCtrol.oe_funmode,"envtemp":cmdCtrol.envtemp,"oe_worktimeset": parseInt(value)} })} defaultValue={this.getSliderCofig().oe_funmode4.defult_time}
                            />
                        }
                        {
                            isShow === 5 &&
                            <p>{50+formatMessage({ id: 'min' })}</p>
                        }
                        {
                            isShow === 6 &&
                            <Scroller
                                layout={'liquid'}
                                wheels={[[{ values: this.getSliderCofig().oe_funmode6.oe_worktimeset, label: [formatMessage({ id: 'min' })] }]]}
                                rows={3} display={'inline'} onChange={value =>this.setState({ cmdCtrol: {'oe_funmode':cmdCtrol.oe_funmode,"envtemp":cmdCtrol.envtemp,"oe_worktimeset": parseInt(value)} })} defaultValue={this.getSliderCofig().oe_funmode6.defult_time}
                            />
                        }
                        {
                            isShow === 7 &&
                            <Scroller
                                layout={'liquid'}
                                wheels={[[{ values: this.getSliderCofig().oe_funmode7.oe_worktimeset, label: [formatMessage({ id: 'min' })] }]]}
                                rows={3} display={'inline'} onChange={value =>this.setState({ cmdCtrol: {'oe_funmode':cmdCtrol.oe_funmode,"envtemp":cmdCtrol.envtemp,"oe_worktimeset": parseInt(value)} })} defaultValue={this.getSliderCofig().oe_funmode7.defult_time}
                            />
                        }
                    </div>

                    <div className={style.bottomBtn}> {<BottomButton text={formatMessage({ id: 'start' })} onClick={this.goWork} />}</div>
                </Page>
            </div>
        )
    }
}
export default inject(['oe_funmode', 'envtemp', 'oe_worktimeset','oe_runningstate', 'err_code'])(injectIntl(Set));