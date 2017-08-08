// LICENSE_CODE ZON ISC
'use strict'; /*jslint react:true*/
import regeneratorRuntime from 'regenerator-runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import etask from 'hutil/util/etask';
import util from '../util.js';
import Common from './common.js';

let mount;
const E = {
    install: mnt=>{
        E.sp = etask('domains', [function(){ return this.wait(); }]);
        ReactDOM.render(<Stats />, mount = mnt);
    },
    uninstall: ()=>{
        if (E.sp)
            E.sp.return();
        if (mount)
            ReactDOM.unmountComponentAtNode(mount);
        mount = null;
    },
};

class DomainRow extends React.Component {
    render(){
        return <tr>
              <td>
                <a href={`${this.props.path}/${this.props.stat.hostname}`}>
                  {this.props.stat.hostname}</a>
              </td>
              <td className={this.props.class_bw}>
                {util.bytes_format(this.props.stat.bw)}</td>
              <td className={this.props.class_value}>
                {this.props.stat.value}</td>
            </tr>;
    }
}

class DomainTable extends React.Component {
    render(){
        return <Common.StatTable row={DomainRow} path="/domains"
              row_key="hostname" title="All domains" {...this.props}>
              <tr>
                <th>Domain Host</th>
                <th className="col-md-2">Bandwidth</th>
                <th className="col-md-5">Number of requests</th>
              </tr>
            </Common.StatTable>;
    }
}

class Stats extends React.Component {
    constructor(props){
        super(props);
        this.state = {stats: []};
    }
    componentDidMount(){
        const _this = this;
        E.sp.spawn(etask(function*(){
            const res = yield Common.StatsService.get_all({sort: 1,
                by: 'hostname'});
            _this.setState({stats: res});
        }));
    }
    render(){
        return <div>
              <div className="page-header">
                <h3>Domains</h3>
              </div>
              <div className="page-body">
                <DomainTable stats={this.state.stats} />
              </div>
            </div>;
    }
}

E.Row = DomainRow;
E.Table = DomainTable;
export default E;
