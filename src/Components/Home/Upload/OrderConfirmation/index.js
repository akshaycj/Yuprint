import React,{Fragment} from 'react';
import {Spin,Icon} from 'antd';
import './index.css';
export default () =>{
    return(
        <div className='order-confirm'>

            <Spin indicator={(<Icon type="loading" style={{ fontSize: 24,margin:10 }} spin></Icon>)} />
            <h2>Waiting for store to accept your order</h2>
        </div>
    )
} 