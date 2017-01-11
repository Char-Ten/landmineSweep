var CTRL = new Vue();
var lms = new LandmineSweep()

;
(function() {
    Vue.component('m-tbl', {
        template: '#m_tbl',
        data: function() {
            return {
                map: [],
                first: true,
            }
        },
        methods: {
            eClick: function(e) {
                var target = e.target;
                var i = parseInt(target.dataset.index);
                var pos = lms.getPos(i);
                if (this.first) {
                    this.first = false;
                    lms.createLandmine(pos.x, pos.y);
                }
                lms.openMapCell(pos.x, pos.y);
                this._Update();
            },
            eCtm: function(e) {
                e.preventDefault();
                var target = e.target;
                var i = parseInt(target.dataset.index);
                var pos = lms.getPos(i);
                lms.setFlag(pos.x, pos.y);
                this._Update();
            },
            setClass: function(item) {
                var json = {
                    'z-open': item.isOpen,
                    'z-flag': item.isFlag,
                };
                var numClass = 'z-num-' + item.number;
                json[numClass] = true;
                return json
            },
            setText: function(item) {
                var num = item.number;
                if (num > 0) {
                    return num
                }
            },
            _Update: function() {
                lms.eachMap();
                if (lms.isWin) {
                    CTRL.$emit('win');
                }
                if (lms.isFail) {
                    CTRL.$emit('fail');
                }
            },
            _Start: function() {
                lms.startSet(9, 10);
                lms.createMap();
                this.map = lms.$map;
                this.first = true;
            }
        },
        mounted: function() {
            var vm = this;
            this._Start();
            CTRL.$on('reStart', function() {
                vm._Start();
            })

        }
    })
})();

;
(function() {
    Vue.component('m-dialog', {
        template: '#m_dialog',
        props: ['content'],
        methods: {
            eClick: function() {
                this.$emit('close');
            }
        },

    })
})();


;
(function() {
    new Vue({
        el: '#game',
        data: {
            bool: false,
            content: ''
        },
        methods: {
            eClose: function() {
                this.bool = false;
                CTRL.$emit('reStart')
            },

        },
        mounted: function() {
            var vm = this;
            CTRL.$on('win', function() {
                vm.bool = true;
                vm.content = '你赢了';
            });
            CTRL.$on('fail', function() {
                vm.bool = true;
                vm.content = '你输了';
            })
        }
    })
})();