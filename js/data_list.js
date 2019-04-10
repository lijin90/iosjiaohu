var vm = new Vue({
    el: '#data_list',
    data: {
        data_list_select: ['赛程', '积分榜', '球员榜'],
        num: 0,//下标
        time: [],//年份选择
        timevalue: [],//直接把年份保存成数组
        timeid: [],//直接把年份保存成数组
        year_time: [],
        mobileSelectTurn: undefined,
        newtime: '',
        jifenList: [],//积分列表
        saicheng: [],//赛程列表
        turns: [],//轮次列表
        seasons: [],//轮次内比赛列表
        requestTurn: undefined,
        hasNow: false,
        nowTurn: '',
        nowTurnIndex: '',
        shotList: [],//射手榜
        sl: [],//射手榜
        helpList: [],//助攻榜
        header: [],//头部
        state: '',//说明
        leguea_id: undefined,
        liu: 1,
        scempty: '',
        jfempty: '',
        shempty: '',
        zgempty: '',
    },
    //自定义在实例
    filters: {
        substr: function (value) {//截取前六个文字积分
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
        this.year();
        //this.jifen();
        // this.sc();
        //点击赛程，积分球员榜球队榜内容切换
        $(function () {
            $('.data_list_select li').click(function () {
                var index = $('.data_list_select li').index(this);
                $('.data_list_select li').removeClass('active');
                $(this).addClass('active');
                if (index == 0) {
                    //调用赛程
                    $self.$options.methods.sc.bind(this)(vm.leguea_id, vm.newtime - 1);
                } else if (index == 1) {
                    $self.$options.methods.countSorce.bind(this)(vm.leguea_id, vm.newtime-1);
                } else if (index == 2) {
                    //调用球员榜
                    $self.$options.methods.sportsman.bind(this)(vm.leguea_id, vm.newtime-1);
                }
                $('.data_list_con .data_change').eq(index).addClass('show').siblings().removeClass('show');
            });
        });

    },
    methods: {
        openSeason: function (id) {//app交互
            if (vm.liu == 1) {
                js.openSeason(id);
            }
        },
        openTeam: function (id) {//app交互
            if (vm.liu == 1) {
                js.openTeam(id);
            }
        },
        getPara: function () {
            return location.href.split("=")[1];
        },
        tab: function (index) {
            this.num = index;
        },
        url: function () {
            // return "http://192.168.1.161:8080";
            // return "http://192.168.1.127";
            return "https://www.liangqiujiang.com";
        },
        year: function () {
            // $(".loading").css({"width":'1.2rem'});
            $self = this;//指向
            //axios.get($self.url() + "/api/data/getSeasons?leagueId=" + $self.getPara()).then(function (res) {//年份选择
            axios.get($self.url() + "/api/data/getSeasons?leagueId=" + $self.getPara()).then(function (res) {//年份选择
                vm.leguea_id = location.href.split("=")[1];
                if (res.data.status.code == '0') {
                    console.log(res);
                    if(res.data.datalist==''){
                        $('.data_list_con').hide();
                        $('#data_list_title').html('暂无数据！');
                    }
                    res.data.datalist.forEach(function (index, i) {
                        // $(".loading").css("display",'none');
                        // $("#data_list").css("display",'block');
                        vm.time.push(index);
                    });
                    for (var o in vm.time) {//插件只支持json的key为id,value,child，所以替换key名字
                        vm.time[o]["id"] = vm.time[o]["now_year"];
                        vm.time[o]["value"] = vm.time[o]["season"];
                        delete vm.time[o]["now_year"];
                        delete vm.time[o]["season"];
                    }
                    vm.time.forEach(function (index) {
                        vm.timevalue.push(index.value);
                        vm.timeid.push(index.id);
                        vm.year_time.push(index);
                    });
                    vm.newtime = vm.year_time[0].id;
                    //调用赛程
                    $self.$options.methods.sc.bind(this)(vm.leguea_id, vm.newtime - 1);

                    var mobileSelect1 = new MobileSelect({//下拉插件
                        trigger: '#time_select',
                        wheels: [
                            {data: vm.year_time}
                        ],
                        position: [0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
                        transitionEnd: function (indexArr, data) {
                        },
                        callback: function (indexArr, data) {//回调函数
                            for (var i = 0; i < data.length; i++) {
                                vm.newtime = data[i].id;
                            }
                            if ($self.num == 1) {
                                //显示积分
                                $self.$options.methods.countSorce.bind(this)(vm.leguea_id, vm.newtime-1);
                            } else if ($self.num == 0) {
                                //显示赛程
                                $self.$options.methods.sc.bind(this)(vm.leguea_id, vm.newtime-1);
                            } else if ($self.num == 2) {
                                //显示球员榜
                                $self.$options.methods.sportsman.bind(this)(vm.leguea_id, vm.newtime-1);
                            }

                        }
                    });
                }
            });
        },


        sc: function (lea_id, year) {
            //赛程NEW
            vm.turns = [];
            axios.get($self.url() + "/api/league/getAllLeagueTurn?lea_id=" + lea_id + "&year=" + year).then(function (res) {//赛程详情
                if (res.data.status.code == '0') {
                    // console.log(res.data.data.turnList);
                    // console.log(vm.saicheng);
                    if (res.data.data.turnList == '') {
                        $('.data_schedule').hide();
                        vm.saicheng = res.data.data.turnList;
                        vm.scempty = '暂无赛程数据。。。';
                        // $('.data_list_con').html('暂无赛程数据。。。');
                    }
                    else {
                        $('.data_schedule').show();
                        vm.saicheng = res.data.data.turnList;
                        vm.seasons = res.data.data.seasonList;
                        vm.saicheng.forEach(function (temp, index) {
                            if (temp.isNow == 'true' || temp.isNow == true) {
                                if (temp["type_id"] == 1) {
                                    vm.nowTurn = temp["season_gameweek_name"];
                                } else {
                                    vm.nowTurn = temp["type_name"]
                                }
                                vm.nowTurnIndex = index;
                                vm.hasNow = true;
                            }
                            if (temp["type_id"] == 1) {
                                var nowTemp = {};
                                nowTemp["value"] = temp["season_gameweek_name"];
                                nowTemp["id"] = "gameweek_" + temp["season_gameweek"];
                                vm.turns.push(nowTemp);
                            } else {
                                var nowTemp = {};
                                nowTemp["value"] = temp["type_name"];
                                nowTemp["id"] = "type_" + temp["type_id"];
                                vm.turns.push(nowTemp);
                            }

                        });
                        if (vm.hasNow)
                            vm.hasNow = false;
                        else {
                            vm.nowTurnIndex = vm.saicheng.length - 1;
                            if (vm.saicheng[vm.saicheng.length - 1]["type_id"] == 1) {
                                vm.nowTurn = vm.saicheng[vm.saicheng.length - 1]["season_gameweek_name"];
                            } else {
                                vm.nowTurn = vm.saicheng[vm.saicheng.length - 1]["type_name"];
                            }
                        }
                        if ($('#turn_select_P1').children.length > 0)
                            $('#turn_select_P1').empty();
                        $($('#turn_select_P1')).append('<span id="turn_select">' + vm.nowTurn + '</span>');
                        vm.requestTurn = vm.nowTurnIndex;
                        $self.mobileSelectTurn = new MobileSelect({//下拉插件
                            trigger: '#turn_select',
                            wheels: [
                                {data: vm.turns}
                            ],
                            position: [vm.nowTurnIndex], //初始化定位 打开时默认选中的哪个 如果不填默认为0
                            transitionEnd: function (indexArr, data) {
                            },
                            callback: function (indexArr, gameweek) {//回调函数
                                var typeId = 1;
                                if (gameweek[0].id.split("_")[0] == "type") {
                                    typeId = gameweek[0].id.split("_")[1];
                                }
                                vm.requestTurn = indexArr[0];
                                //axios.get($self.url() + "/api/league/getSeasonsByTurn?lea_id=" + $self.getPara()+ "&year="+$('#time_select').val()+"&season_gameweek="+gameweek).then(function (res) {//赛程详情
                                axios.get($self.url() + "/api/league/getSeasonsByTurn?lea_id=" + lea_id + "&year=" + year + "&season_gameweek=" + gameweek[0].id.split("_")[1] + "&type_id=" + typeId).then(function (res) {//赛程详情
                                    if (res.data.status.code == '0') {
                                        vm.seasons = res.data.datalist;
                                    }
                                });
                            }
                        });
                    }

                }
            });
        },
        sportsman: function (lea_id, year) {
            axios.get($self.url() + "/api/data/getSportsManRankList?league_id=" + lea_id + "&league_year=" + year).then(function (res) {
                if (res.data.status.code == '0') {
                    // console.log(res.data.data.shotList);
                    // vm.shotList = res.data.data.shotList;
                    if (res.data.data.shotList== '') {
                        vm.shotList='';
                        vm.shempty = '暂无射手榜数据。。。'
                    }else{
                        vm.shotList = res.data.data.shotList;
                    }
                    if (res.data.data.helpList=='') {
                        vm.helpList='';
                        vm.zgempty = '暂无助攻榜数据。。。'
                    }else{
                        vm.helpList = res.data.data.helpList;
                    }
                    // console.log(vm.sl);
                }
            });
        },
        countSorce: function (leagueId, year) {
            // axios.get($self.url() + "/api/data/getSeasonItem?leagueId=" + $self.getPara() + "&year=" + vm.timeid[0]).then(function (res) {//积分详情
            axios.get($self.url() + "/api/data/getSeasonItem?leagueId=" + leagueId + "&year=" + year).then(function (res) {//积分详情
                if (res.data.status.code == '0') {
                    console.log(res);
                    if (res.data.data.item=='') {
                        vm.header='';
                        vm.state='';
                        vm.jifenList='';
                        vm.jfempty = '暂无积分榜数据。。。'
                    }else{
                        vm.header = res.data.data.header;
                        vm.state = res.data.data.desc_;
                        vm.jifenList = res.data.data.item;
                    }
                }

            });
        },
        //上一轮
        upTurn: function () {
            if (vm.requestTurn != 0) {
                vm.requestTurn--;
                var typeId = 1;
                var temp = vm.saicheng[vm.requestTurn];
                //if(++vm.requestTurn <= vm.turns.length)
                if (temp["type_id"] != 1)
                    typeId = temp["type_id"];
                axios.get($self.url() + "/api/league/getSeasonsByTurn?lea_id=" + vm.leguea_id + "&year=" + (vm.newtime - 1) + "&season_gameweek=" + temp["season_gameweek"] + "&type_id=" + typeId).then(function (res) {//赛程详情
                    if (res.data.status.code == '0') {
                        vm.seasons = res.data.datalist;
                    }
                });
                vm.nowTurn = vm.turns[vm.requestTurn]["value"];
                $('#turn_select').text(vm.nowTurn);
                this.mobileSelectTurn.locatePostion(0, vm.requestTurn);
            }


        },
        //下一轮
        downTurn: function () {
            if (vm.requestTurn != vm.turns.length - 1) {
                vm.requestTurn++;
                var typeId = 1;
                var temp = vm.saicheng[vm.requestTurn];
                if (temp["type_id"] != 1)
                    typeId = temp["type_id"];
                axios.get($self.url() + "/api/league/getSeasonsByTurn?lea_id=" + vm.leguea_id + "&year=" + (vm.newtime - 1) + "&season_gameweek=" + temp["season_gameweek"] + "&type_id=" + typeId).then(function (res) {//赛程详情
                    if (res.data.status.code == '0') {
                        vm.seasons = res.data.datalist;
                    }
                });
                vm.nowTurn = vm.turns[vm.requestTurn]["value"];
                $('#turn_select').text(vm.nowTurn);
                this.mobileSelectTurn.locatePostion(0, vm.requestTurn);
            } else {

            }

        },
    },
});
