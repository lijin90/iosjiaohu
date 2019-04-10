var vm = new Vue({
    el: "#app",
    data: {
        blueteam: [],//蓝队
        redteam: [],//红队
        men_blue: [],//守门员
        men_red: [],//守门员
        hou_blue: [],//后卫
        hou_red: [],//后卫
        center_blue: [],//中场
        center_red: [],//中场
        qian_blue: [],//前锋
        qian_red: [],//前锋
        //替补列表
        zhu: [],//主队替补列表
        ke: [],//客队替补列表
        show: false,//出现和隐藏
        show2: false,
        // loading: true,//转圈加载
        heightclass: false,//数据不对时高度自适应
        zr:[],
        blues:[],
        bluet:[],
        reds:[],
        redt:[],
        liu: 1,
        empty:''

    },
    //自定义在实例
    filters: {
        substr: function (value) {//截取前五个文字积分
            return value.substring(0, 6)
        }
    },
    created: function () {
        $self = this;
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            $self.liu = 2;
        } else if (/android/.test(ua)) {
            $self.liu = 1;
        }
    },
    mounted: function () {
        // this.showData();
        //需要执行的方法可以在mounted中进行触发，其获取的数据可以赋到data中后，可以放在前面进行渲染
        axios.get(this.url() + "/api/season/getPlan?season_id="+ this.getPara()).then(function (res) {
            if(res.data.status.code == "0"){
                // console.log(res.data.datalist);
                var teamId;
                res.data.datalist.forEach(function(index,i){
                    if (i == 0)
                        teamId = index.team_id
                    if(index.team_id == teamId){
                        if (index.status_id == 1) {
                            vm.blues.push(index);
                        }else{
                            vm.bluet.push(index);
                        }
                    }else{
                        if (index.status_id == 1) {
                            vm.reds.push(index);
                        }else{
                            vm.redt.push(index);
                        }
                    }
                })
                if( res.data.datalist.length==0){
                    vm.empty='暂无加载数据'
                }
            }
        })
    },
    methods: {
        url: function () {
            return "https://www.liangqiujiang.com";
            // return "http://192.168.1.127";
            // return "http://192.168.1.161:8080";
        },
        openSportMan: function (id) {
            if (vm.liu == 1) {
                js.openSportMan(id);
            }
        },
        getPara: function () {
            return location.href.split("=")[1]
        },
        // showData: function () {
        //     $self = this;
        //     axios.get($self.url() + "/api/season/getPlan?season_id=" + $self.getPara()).then(function (res) {
        //         if (res.data.status.code == "0") {
        //             var teamId;
        //             if (res.data.datalist.length != 22) {//判断球员数量是否为22
        //                 $('.loading').css("display", 'none');
        //                 $('#app').css("display", 'block');
        //                 $self.heightclass = true;
        //             }
        //             if (res.data.datalist.length == 0) {//判断球员数量是否为0
        //                 $('.loading').css("display", 'none');
        //                 $('#app').css("display", 'block');
        //                 $self.heightclass = false;
        //             }
        //             res.data.datalist.forEach(function (index, i) {
        //                 $('.loading').css("display", 'none');
        //                 $('#app').css("display", 'block');
        //                 if (i == 0)
        //                     teamId = index.team_id
        //                 if (index.team_id == teamId) {
        //                     if (index.status_id == 1) {
        //                         vm.blueteam.push(index);
        //                     }
        //                     if (index.status_id != 1)
        //                         vm.zhu.push(index);
        //                 } else {
        //                     if (index.status_id == 1) {
        //                         vm.redteam.push(index);
        //                     }
        //                     if (index.status_id != 1)
        //                         vm.ke.push(index);
        //                 }
        //             });
        //             if (res.data.datalist.length == '0') {
        //                 vm.show = true;
        //             }
        //             if (vm.ke.length == '0' || vm.zhu.length == '0') {
        //                 vm.show2 = true;
        //             }
        //             for (var i = 0; i < vm.blueteam.length; i++) {
        //                 if (vm.blueteam[i].role_id == 4) {
        //                     vm.men_blue.push(vm.blueteam[i]);
        //                 } else if (vm.blueteam[i].role_id == 3) {
        //                     vm.hou_blue.push(vm.blueteam[i]);
        //                 } else if (vm.blueteam[i].role_id == 2) {
        //                     vm.center_blue.push(vm.blueteam[i]);
        //                 } else if (vm.blueteam[i].role_id == 1) {
        //                     vm.qian_blue.push(vm.blueteam[i]);
        //                 }
        //             }
        //             for (var i = 0; i < vm.redteam.length; i++) {
        //                 if (vm.redteam[i].role_id == 4) {
        //                     vm.men_red.push(vm.redteam[i]);
        //                 } else if (vm.redteam[i].role_id == 3) {
        //                     vm.hou_red.push(vm.redteam[i]);
        //                 } else if (vm.redteam[i].role_id == 2) {
        //                     vm.center_red.push(vm.redteam[i]);
        //                 } else if (vm.redteam[i].role_id == 1) {
        //                     vm.qian_red.push(vm.redteam[i]);
        //                 }
        //             }
        //         } else {
        //             vm.show = true;
        //             vm.show2 = true;
        //         }
        //     }).catch(function (error) {
        //         console.log(error);
        //     });
        // }
    },
});
