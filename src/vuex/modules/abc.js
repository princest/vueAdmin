/** * Created by Administrator on 2017/1/22. */import {axiosInstance} from '../../services';export const interacts = {  act_filtercos: 'act_filtercos',  act_choose_co: 'act_choose',  act_show_co: 'act_show_co',  act_show_so: 'act_show_so',  mut_set_errors: 'mut_set_errors',  mut_set_co_nbrs: 'mut_set_co_nbrs',  mut_set_co_nbr: 'mut_set_co_nbr',  mut_set_co_info: 'mut_set_co_info',  mut_set_so_nbrs: 'mut_set_so_nbrs',};const state = {  errors: [],  co_nbr_list: [],  current_co_nbr: '',  current_co_info: {},  so_nbr_list: [],  wo_nbr_list:[]};const getters = {};const actions = {  ///筛选订单  act_filtercos(state, payload){    axiosInstance.post('abc', {s: payload.s, m: payload.m})      .then(function (response) {        ActionResultExecutor(response, state, interacts.mut_set_co_nbrs, '.data')      })      .catch(function (cb) {        console.log('调用abc 失败', cb)        alert('调用abc失败' + cb.toString())      })  },  /// 显示CO 详情,如果BOSS无信息,则额外显示CRM信息  [interacts.act_show_co](state, payload){    axiosInstance.post('abc/showco', {co_nbr: payload})      .then(function (response) {        // data:Array[1] names:Array[31] sqlsetting:Object types:Array[31]        ActionResultExecutor(response, state, interacts.mut_set_co_info, '.data[0]');        debugger;        if(state.state.current_co_info.SO_NBR){          //可以提取So表信息          ActionResultExecutor(response, state, interacts.mut_set_so_nbrs, '.data');        }      })      .catch(function (cb) {        console.log('调用abc/showco失败', cb);        alert('调用abc/showco失败' + cb.toString())      })  },  act_choose_co(state, payload){    state.commit(interacts.mut_set_co_nbr, payload);    state.dispatch(interacts.act_show_co, payload);  }};const mutations = {  [interacts.mut_set_errors]: (state, payload) => state.errors = payload,  [interacts.mut_set_co_nbrs]: (state, payload) => state.co_nbr_list = payload,  [interacts.mut_set_co_nbr]: (state, payload) => state.current_co_nbr = payload,  [interacts.mut_set_co_info]: (state, payload) => state.current_co_info = payload,  [interacts.mut_set_so_nbrs]: (state, payload) => state.so_nbr_list = payload,};export default {  state,  getters,  actions,  mutations};function ActionResultExecutor(response, state, commit, payloadPath) {  let rd = response.data.Data;  if (rd.ErrorMsgs && rd.ErrorMsgs.length > 0)    state.commit(interacts.mut_set_errors, rd.ErrorMsgs);  else {    let payload = eval('rd' + payloadPath)    state.commit(commit, payload);  }}