/*
 * @Author: your name
 * @Date: 2020-12-21 15:45:10
 * @LastEditTime: 2021-02-23 14:58:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bath-heater\src\panel\views\timer\index.js
 */
import React from 'react';
import {
    Route,
} from 'react-router-dom'
import { injectIntl } from 'react-intl';
import Switch from 'componentsPath/TransitionSwitch';
import Set from './Set';
import Work from './Work';


const Timer = (props) => {
  return (
    <Switch location={props.location} history={props.history} level={2} >
        <Route path="/oven" exact render={ props =>
            <Set {...props}/>
        } />
      <Route path="/oven/work" exact render={ props =>
            <Work {...props}/>
        }/>
    </Switch>
  )
}

export default injectIntl(Timer);