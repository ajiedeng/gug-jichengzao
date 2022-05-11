/*
 * @Author: your name
 * @Date: 2020-11-23 17:22:09
 * @LastEditTime: 2021-03-31 15:32:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \curtain\src\panel\App.js
 */
import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom'
import Switch from '../components/TransitionSwitch'
import { injectIntl } from 'react-intl';
import { inject } from "componentsPath/injector";
import Modal from 'componentsPath/Modal';
import config from 'configPath';
import Main from 'viewsPath/main';
import Oven from 'viewsPath/oven';


export default inject(['pwr','err_code'])(injectIntl(class extends React.PureComponent {
    constructor(props) { 
        // 构造函数
        super(props)
        this.state = {
            message:false,
        }
        console.log(props)
    }
    componentDidMount() {
        // DOM加载完成
      }
    // 全局弹窗
    componentWillReceiveProps(nextProps) { 
        const { err_code } = nextProps;
        if (this.props.err_code !== err_code && err_code) {
           this.showModal(nextProps);
        }
        if (this.props.err_code !== err_code && err_code===0) {
            Modal.close(this.modalId);
         }
    }
    
    showModal(nextProps) { 
        const {err_code,intl: { formatMessage }, } = nextProps;
        if (err_code !== 0) {
            // 初始化
            Modal.close(this.modalId);
            this.setState({
                message:false,
            });
            const { code, msg } = config.error(err_code-154)
            const dom = (<div>
                { formatMessage({ id: 'systemError' }, { code, msg })}
                <div>{formatMessage({ id: 'contactService' })}</div>
            </div>)
            this.modalId=Modal.alert(dom, () => {
                window.localStorage.setItem('hidden', false)
                this.setState({
                    message:true,
                });
                return true;
            },);
        }
    }

    render() {
        const { message } = this.state;
        return (
            <Switch location={this.props.location} history={this.props.history} level={1} >
                <Route path="/" exact render={ props =>
                    <Main message={ message }  {...props}/>
                } />
                <Route path="/oven" render={props => { 
                    const { pwr }=this.props
                    const route = pwr === 0 ?
                    <Redirect to="/" /> 
                      :
                    <Oven  {...props} />
                    return route;
                }
                }/>
            </Switch>
        )
    }
}))