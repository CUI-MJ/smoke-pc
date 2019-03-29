import ajax from '@/utils/ajax'


//登陆接口
export function loginAdmin(params) {
    let url = '/user/login-admin';
    return ajax.post(url, params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}
//查询用户列表
export function queryUser(params) {
    let url = '/user/query-user';
    return ajax.post(url, params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}
//新增用户
export function postuser(params){
    let url = '/user';
    return ajax.post(url, params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}
//更新用户
export function putuser(params){
    let url = '/user';
    return ajax.put(url, params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//检测用户
export function getByPhone(params){
    let url = `/user/getByPhone/${params}`;
    return ajax.get(url,{}).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}


//获取烟草厂商
export function firmList(params){
    let url = '/cigarette/firm-list';
    return ajax.get(url,{}).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//获取烟草列表
export function cigaretteList(params){
    let url = '/cigarette/cigarette-list';
    return ajax.post(url, params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//新增烟草
export function postCigarette(params){
    let url = '/cigarette';
    return ajax.post(url,params ).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//更新烟草
export function putCigarette(params){
    let url = '/cigarette';
    return ajax.put(url, params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//商铺列表
export function postShopList(params){
    let url = '/shops/list';
    return ajax.post(url,params ).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//增加库存
export function addInventory(params){
    let url = '/add-inventory';
    return ajax.post(url,params ).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//减少库存
export function reduceInventory(params){
    let url = '/reduce-inventory';
    return ajax.post(url, params ).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//新增商铺
export function postShops(params){
    let url = '/shops';
    return ajax.post(url,params ).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//更新商铺
export function putShops(params){
    let url = '/shops';
    return ajax.put(url,params ).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//查询商铺信息
export function shopsDetails(params){
    let url = `/shops/${params}`;
    return ajax.get(url).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//库存查询
export function stocklog(params){
    let url = `/shops/stock-log`;
    return ajax.get(url,{ params: params}).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

export function fileUpload(params){
    let url = `/file/upload`;
    return ajax.post(url,{ params: params}).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

export function importStock(params){
    let url = `/shops/import-stock`;
    return ajax.post(url,params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//获取公告列表
export function noticeList(params){
    let url = `/notice/list`;
    return ajax.post(url,params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

export function postNotice(params){
    let url = `/notice`;
    return ajax.post(url,params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

export function putNotice(params){
    let url = `/notice`;
    return ajax.put(url,params).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

//导出所有
export function allStatistics(){
    let url = `/shops/export-all-statistics`;
    return ajax.get(url,{}).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

export function exportInfoAcq(params){
    let url = `/shops/export-info-acq/${params}`;
    return ajax.get(url,{}).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}

export function exportStatistics(params){
    let url = `/shops/export-statistics/${params}`;
    return ajax.get(url,{}).then(function (res) {
        return Promise.resolve(res)
    }).catch(function (err) {
        return Promise.reject(err)
    })
}