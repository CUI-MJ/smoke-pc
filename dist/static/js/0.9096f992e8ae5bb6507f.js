webpackJsonp([0],{"/bkh":function(t,e,n){"use strict";var i={data:function(){return{currentPage:1,total:0,list:[],pageSize:0,isrefresh:!1}},props:["number","totalLength"],mounted:function(){this.pageSize=parseInt(this.number),this.total=parseInt(this.totalLength),this.handleCurrentChange(1)},watch:{getDatas:function(t){this.list=t,this.handleCurrentChange(this.currentPage)},totalLength:function(t){this.total=t,this.handleCurrentChange(this.currentPage)}},methods:{handleCurrentChange:function(t){this.currentPage=t,this.isrefresh=!0,this.senditems(this.currentPage,this.pageSize)},handleSizeChange:function(t){this.pageSize=t,this.currentPage=1,this.isrefresh=!0,this.senditems(this.currentPage,this.pageSize)},senditems:function(t,e){this.$emit("listenToChildEvent",t,e)}}},a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"block"},[e("el-pagination",{attrs:{"current-page":this.currentPage,"page-sizes":[10,20,30,40],"page-size":this.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:this.totalLength},on:{"size-change":this.handleSizeChange,"current-change":this.handleCurrentChange}})],1)},staticRenderFns:[]};var r=n("C7Lr")(i,a,!1,function(t){n("eTPp")},null,null);e.a=r.exports},"2VaB":function(t,e,n){"use strict";var i=n("ZLEe"),a=n.n(i),r=n("aA9S"),s=n.n(r);e.a={data:function(){return{list:[],searchParams:{page:0,size:10},isLoading:!1}},computed:{pagination:function(){return{currentPage:this.$data[this.$_dataContainer].number?this.$data[this.$_dataContainer].number+1:1,pageSize:this.$data[this.$_dataContainer].size||10,pageSizes:[10,20,50],total:this.$data[this.$_dataContainer].totalElements||0}}},methods:{$_initListPage:function(t){var e=t.api,n=t.dataContainer,i=t.searchBar,a=t.byId,r=t.byVuex,s=t.action;this.$_api=e,this.$_dataContainer=n,this.$_searchBar=i,this.$_byId=a,this.$_byVuex=r,this.$_action=s,this.refresh()},$_getData:function(){var t=this;this.isLoading=!0,!this.$_byVuex&&this.$_api&&this.$_api.apply(null,arguments).then(function(e){t.$data[t.$_dataContainer]=e,t.isLoading=!1}).catch(function(e){t.isLoading=!1}),this.$_byVuex&&this.$_action&&this.$store.dispatch(this.$_action,arguments[0]).then(function(e){t.$data[t.$_dataContainer]=e,t.isLoading=!1}).catch(function(e){t.isLoading=!1})},search:function(){this.$data[this.$_dataContainer].size=10,this.$data[this.$_dataContainer].number=0;var t=s()({},this.$data[this.$_searchBar]?this.$data[this.$_searchBar]:{});this.searchParams=s()(t,{page:this.$data[this.$_dataContainer].number||0,size:this.$data[this.$_dataContainer].size||10}),this.refresh()},refresh:function(){this.$_byId?this.$_getData(this.$data.id,this.searchParams):this.$_getData(this.searchParams)},reset:function(){var t=this;a()(this.$data[this.$_searchBar]).forEach(function(e){t.$data[t.$_searchBar][e]=null}),this.searchParams={page:0,size:10},this.refresh()},changePageSize:function(t){this.searchParams.page=0,this.searchParams.size=t,this.refresh()},changePageNumber:function(t){this.searchParams.page=t-1,this.refresh()}}}},H8JJ:function(t,e,n){"use strict";e.a={data:function(){return{windowHeight:document.documentElement.clientHeight,windowWidth:document.documentElement.clientWidth,magicHeight:96,tableTnB:32,cellHeight:44,contentHeight:null}},mounted:function(){var t=this;this.$nextTick(function(){if(window.addEventListener?window.addEventListener("resize",t.handleResize.bind(t)):window.attachEvent&&window.attachEvent("resize",t.handleResize.bind(t)),t.windowHeight>=566){var e=0;t.$refs.searchBar&&(e=t.$refs.searchBar.offsetHeight),t.contentHeight=t.windowHeight-t.magicHeight-e,console.log(t.contentHeight)}else{var n=0;t.$refs.searchBar&&(n=t.$refs.searchBar.offsetHeight),t.contentHeight=566-t.magicHeight-n}})},computed:{tableHeight:function(){return this.contentHeight?this.table.content&&0==this.table.content.length?this.tableTnB+58:this.table.content&&this.table.content.length>0?this.contentHeight>this.tableTnB+this.cellHeight*this.table.content.length?this.tableTnB+this.cellHeight*this.table.content.length:this.contentHeight:500:500}},methods:{handleResize:function(t){if(this.windowHeight=document.documentElement.clientHeight,this.windowWidth=document.documentElement.clientWidth,this.windowHeight>=566){var e=0;this.$refs.searchBar&&(e=this.$refs.searchBar.offsetHeight),console.log(e),this.contentHeight=this.windowHeight-this.magicHeight-e}else{var n=0;this.$refs.searchBar&&(n=this.$refs.searchBar.offsetHeight),this.contentHeight=566-this.magicHeight-n}}}}},P9l9:function(t,e,n){"use strict";e.e=function(t){return r.a.post("/user/login-admin",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.m=function(t){return r.a.post("/user/query-user",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.i=function(t){return r.a.post("/user",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.l=function(t){return r.a.put("/user",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.c=function(t){var e="/user/getByPhone/"+t;return r.a.get(e,{}).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.b=function(t){return r.a.get("/cigarette/firm-list",{}).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.a=function(t){return r.a.post("/cigarette/cigarette-list",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.f=function(t){return r.a.post("/cigarette",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.j=function(t){return r.a.put("/cigarette",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.g=function(t){return r.a.post("/shops/list",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.h=function(t){return r.a.post("/shops",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.k=function(t){return r.a.put("/shops",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.n=function(t){return r.a.get("/shops/stock-log",{params:t}).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})},e.d=function(t){return r.a.post("/shops/import-stock",t).then(function(t){return a.a.resolve(t)}).catch(function(t){return a.a.reject(t)})};var i=n("rVsN"),a=n.n(i),r=n("Z1y9")},eTPp:function(t,e){}});