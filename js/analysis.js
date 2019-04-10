var vm = new Vue({
    el: "#analysis",
    data: {
        oupei: [],//欧赔
        yapan: [],//亚盘
        red: true,//欧赔、亚盘颜色
        vic: [],
        names: [],//球队对阵名字
        namesid: [],//球队id
        // icon: [],//球队图标
        wji: [],//对赛往绩
        home_team: {},//主队
        teamA: [],//近期战绩A
        teamB: [],//近期战绩B
        // zj_aicon: [],//战绩a icon
        // zj_bicon: [],//战绩b icon
        wlA: [],//未来三场
        wlB: [],//未来三场
        // rankA_title: [],
        // rankB_title: [],
        rankA: [],//a队积分
        rankB: [],//b队积分
        // wl_aicon: [],//未来战绩a icon
        // wl_bicon: [],//未来战绩b icon
        // teama_1: '',
        // teama_2: '',
        // teamb_1: '',
        // teamb_2: '',
        // wla_1: '',
        // wla_2: '',
        // wlb_1: '',
        // wlb_2: '',
        tp: '',
        tpprice: [],
        saiji: [],
        paiming: [],
        liu: 1,
        toutitle: [],//公用标题
        touicon: [],//公用icon
    },
    //自定义在实例
    filters: {
        substr: function (value) {//截取前五个文字积分
            return value.substring(0, 5)
        },
        //保留2位小数点过滤器
        number: function (value) {
            value = Number(value);
            return (value * 100).toFixed(0) + "%"
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
        axios.get(this.url() + "/api/esoterica/getEsotericaInfoBySeasonId?season_id=" + this.getPara()).then(function (res) {
            // console.log(res);
            if (res.data.status.code == '0') {
                if (res.data.data) {
                    vm.tpprice.push(res.data.data);
                } else {
                    vm.tpprice = ''
                }
            }
            // console.log(vm.tpprice);
        })
        // 根据id改变图片路劲
        // axios.get(this.url() + "/api/esoterica/getLeagueIdBySeasonId?season_id=" + this.getPara()).then(function (res) {
        //     // console.log(res);
        //     if (res.data.status.code == '0') {
        //         vm.tp = res.data.data.lea_id;
        //     }
        // })
        // this.showData();//亚盘，欧赔
        axios.get(this.url() + "/api/season/getLottery?season_id=" + this.getPara()).then(function (res) {
            if (res.data.status.code == "0") {
                if (res.data.datalist) {
                    res.data.datalist.forEach(function (index, i) {
                        if (index.group_id == 1) {
                            if (index.type_name == "竞彩官方"
                                || index.type_name == "威廉希尔"
                                || index.type_name == "立博") {
                                vm.oupei.push(index);
                            }
                        } else if (index.group_id == 2) {
                            if (index.type_name == "澳门" || index.type_name == "Bet365") {
                                vm.yapan.push(index);
                            }
                        }
                    })
                }

            }
        }).catch(function (error) {
            console.log(error);
        });
        //近期战绩
        axios.get(this.url() + "/api/team/getTeamSeasonListByTeamIdNew?season_id=" + this.getPara()).then(function (res) {
            if (res.data.status.code == '0') {
                if (res.data.data.a) {
                    // vm.home_team = res.data.data.a[0].home_team;
                    res.data.data.a.forEach(function (index, i) {
                        vm.teamA.push(index);
                        // vm.zj_aicon.push(index.team_b);
                        // vm.zj_aicon.push(index.b_icon);
                    })
                    // vm.teamA.forEach(function (index, i) {
                    //     if (i == 2) {
                    //         vm.teama_1 = index.team_a;
                    //         vm.teama_2 = index.team_b;
                    //     }
                    // })
                }
                if (res.data.data.b) {
                    // vm.home_team = res.data.data.b[0].home_team;
                    res.data.data.b.forEach(function (index, i) {
                        vm.teamB.push(index);
                        // vm.zj_bicon.push(index.team_a);
                        // vm.zj_bicon.push(index.a_icon);
                    })
                    // vm.teamB.forEach(function (index, i) {
                    //     if (i == 2) {
                    //         vm.teamb_1 = index.team_a;
                    //         vm.teamb_2 = index.team_b;
                    //     }
                    // })
                }

            }
        });
        //未来三场
        axios.get(this.url() + "/api/team/getFutureTeamSeasonListByTeamId?season_id=" + this.getPara() + "&pageSize=3").then(function (res) {
            // console.log(res);
            if (res.data.status.code == '0') {
                if (res.data.data.a) {
                    res.data.data.a.forEach(function (index, i) {
                        vm.wlA.push(index);
                        // vm.wl_aicon.push(index.team_a);
                        // vm.wl_aicon.push(index.a_icon);
                    })
                    // vm.wlA.forEach(function (index, i) {
                    //     if (i == 0) {
                    //         vm.wla_1 = index.team_a;
                    //         vm.wla_2 = index.team_b;
                    //     }
                    // })
                }
                if (res.data.data.b) {
                    res.data.data.b.forEach(function (index, i) {
                        vm.wlB.push(index);
                        // vm.wl_bicon.push(index.team_b);
                        // vm.wl_bicon.push(index.b_icon);
                    })
                    // vm.wlB.forEach(function (index, i) {
                    //     if (i == 0) {
                    //         vm.wlb_1 = index.team_a;
                    //         vm.wlb_2 = index.team_b;
                    //     }
                    // })
                }
            }
        })
        //赛季积分
        axios.get(this.url() + "/api/league/getTeamRankingList?season_id=" + this.getPara()).then(function (res) {
            vm.saiji.push(res.data.data);
            if (res.data.status.code == '0') {
                vm.paiming.push(res.data.data.title.team_a_rank);
                vm.paiming.push(res.data.data.title.team_b_rank);
                if (res.data.data.title.home_team == 'team_a') {
                    vm.toutitle.push(res.data.data.title.team_a);
                    vm.toutitle.push(res.data.data.title.team_b);
                    vm.touicon.push(res.data.data.title.a_icon);
                    vm.touicon.push(res.data.data.title.b_icon);
                    vm.namesid.push(res.data.data.title.team_a_id);
                    vm.namesid.push(res.data.data.title.team_b_id);
                    // vm.rankA_title.push(res.data.data.title.team_a);
                    // vm.rankA_title.push(res.data.data.title.a_icon);
                    // vm.rankB_title.push(res.data.data.title.team_b);
                    // vm.rankB_title.push(res.data.data.title.b_icon);
                }
                // else {
                //     vm.toutitle.push(res.data.data.title.team_b);
                //     vm.toutitle.push(res.data.data.title.team_a);
                //     vm.touicon.push(res.data.data.title.b_icon);
                //     vm.touicon.push(res.data.data.title.a_icon);
                //     vm.namesid.push(res.data.data.title.team_b_id);
                //     vm.namesid.push(res.data.data.title.team_a_id);
                //     vm.rankB_title.push(res.data.data.title.team_a);
                //     vm.rankB_title.push(res.data.data.title.a_icon);
                //     vm.rankA_title.push(res.data.data.title.team_b);
                //     vm.rankA_title.push(res.data.data.title.b_icon);
                // }
                if (res.data.data.team_a) {
                    res.data.data.team_a.forEach(function (index, i) {
                        vm.rankA.push(index);
                    })
                }
                if (res.data.data.team_b) {
                    res.data.data.team_b.forEach(function (index, i) {
                        vm.rankB.push(index);
                    })
                }
            }
        })

        this.wangji();//往极
        // })
    },
    updated: function () {
        this.$nextTick(function () {
            $(function () {
                var sum = 0;
                $('.score li a').each(function () {
                    var s = $(this).text().substr(0, 1).split();
                    sum += s * 1;
                });
                var h = $('.score .home_score a').text().substr(0, 1);
                var d = $('.score .draw a').text().substr(0, 1);
                var g = $('.score .guest_score a').text().substr(0, 1);
                if (h == 0) {
                    $('.home_score').width(10 + "%");
                    $('.draw').width((d / sum) * 100 - 5 + "%");
                    $('.guest_score').width((g / sum) * 100 - 5 + "%");
                } else if (d == 0) {
                    $('.draw').width(10 + "%");
                    $('.home_score').width((h / sum) * 100 - 5 + "%");
                    $('.guest_score').width((g / sum) * 100 - 5 + "%");
                } else if (g == 0) {
                    $('.guest_score').width(10 + "%");
                    $('.home_score').width((h / sum) * 100 - 5 + "%");
                    $('.draw').width((d / sum) * 100 - 5 + "%");
                } else {
                    $('.home_score').width((h / sum) * 100 + "%");
                    $('.draw').width((d / sum) * 100 + "%");
                    $('.guest_score').width((g / sum) * 100 + "%");
                }
                if (h == 0 && d == 0) {
                    $('.home_score').width(10 + "%");
                    $('.draw').width(10 + "%");
                    $('.guest_score').width((g / sum) * 100 - 20 + "%");
                }
                if (h == 0 && g == 0) {
                    $('.home_score').width(10 + "%");
                    $('.guest_score').width(10 + "%");
                    $('.draw').width((d / sum) * 100 - 20 + "%");
                }
                if (d == 0 && g == 0) {
                    $('.draw').width(10 + "%");
                    $('.guest_score').width(10 + "%");
                    $('.home_score').width((h / sum) * 100 - 20 + "%");
                }
                if (h == 0 && d == 0 && g == 0) {
                    $('.draw,.home_score,.guest_score').width(33.333 + "%");
                }
            })
        })
    },
    methods: {
        openTips: function () {
            if (vm.liu == 1) {
                js.openTips(this.getPara());
            }
        },
        openSeason: function (id) {
            if (vm.liu == 1) {
                js.openSeason(id);
            }

        },
        openTeam: function (id) {
            if (vm.liu == 1) {
                js.openTeam(id);
            }

        },
        getPara: function () {
            return location.href.split("=")[1]
        },
        url: function () {
            return "https://www.liangqiujiang.com";
            // return "http://192.168.1.129:8080";
            // return "http://192.168.1.127";
        },
        wangji: function () {//对赛往绩
            axios.get(this.url() + "/api/team/getSeasonListByVsTeamIdWithLengthNew?season_id=" + this.getPara()).then(function (res) {
                if (res.data.status.code == "0") {
                    var vicotry = 0, deuce = 0, lose = 0;
                    res.data.datalist.forEach(function (index, i) {
                        if (i == 0) {
                            vm.names.push(index.team_a);
                            vm.names.push('最近' + res.data.datalist.length + '场交锋');
                            vm.names.push(index.team_b);
                            // vm.icon.push(index.a_icon);
                            // vm.icon.push(index.b_icon);
                            // vm.namesid.push(index.team_a_id);
                            // vm.namesid.push(index.team_b_id);

                        }
                        vm.wji.push(index);
                        if (index.source_a > index.source_b) {
                            if (index.team_a == vm.toutitle[0]) {
                                vicotry = vicotry + 1;
                            } else {
                                lose = lose + 1;
                            }

                        } else if (index.source_a == index.source_b) {
                            deuce = deuce + 1;
                        } else if (index.source_a < index.source_b) {
                            if (index.team_b == vm.toutitle[1]) {
                                lose = lose + 1;
                            } else {
                                vicotry = vicotry + 1;
                            }
                        }
                        // if (index.source_a > index.source_b) {
                        //     vicotry = vicotry + 1;
                        // } else if (index.source_a == index.source_b) {
                        //     deuce = deuce + 1;
                        // } else if (index.source_a < index.source_b) {
                        //     lose = lose + 1;
                        // }
                    })
                    // console.log(vm.wji);
                    vm.vic.push(vicotry + '胜');
                    vm.vic.push(deuce + '平');
                    vm.vic.push(lose + '胜');
                    console.log(vm.vic);
                }
            })
        },
    },

});

