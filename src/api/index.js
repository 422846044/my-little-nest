import http from '../utils/http'
/**
 *  @parms resquest 请求地址 例如：http://197.82.15.15:8088/request/...
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
 let nest = process.env.VUE_APP_BASE_API
 let admin = process.env.VUE_APP_ADMIN_API

 //道聚城日志查询
export function djcTaskQuery(params){
     return http.get(`${nest}/djc/task/query`,params)
}

//道聚城token更新
export function djcUpdateToken(params){
     return http.get(`${nest}/djc/task/updateToken`,params)
}

//道聚城任务重试
export function djcTaskRetry(params){
     return http.get(`${nest}/djc/task/retryTask`,params)
}



//文章列表查询
export function articleListQuery(params){
     return http.get(`${nest}/article/getArticleByPage`,params)
}

//文章信息获取
export function articleInfoQuery(params){
     return http.get(`${nest}/article/getArticleInfoById`,params)
}

//数据字典表查询
export function dictMapQuery(params){
     return http.get(`${admin}/admin/dict/getDictMapByDictCode`,params)
}


//用户信息获取
export function simpleUserInfoQuery(params){
     return http.get(`${admin}/admin/user/getSimpleUserInfoByUserId`,params)
}

// put 请求
export function putSomeAPI(params){
     return http.put(`${resquest}/putSome.json`,params)
}
// delete 请求
export function deleteListAPI(params){
     return http.delete(`${resquest}/deleteList.json`,params)
}