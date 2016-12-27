; //包
(function(root, fn) {
    if (typeof define === 'function' && define.amd) {
        define(fn);
    } else if (typeof exports === 'object') {
        module.exports = fn();
    } else {
        root.LandmineSweep = fn();
    }
}(this, function() {
    /**
     * 扫雷
     */
    function Main() {
        this.$map;
        this.$max;
        this.$num;
        this.isWin;
        this.isFail;
    }
    Main.prototype = {
        constructor: Main,

        /**
         * 创建地图
         * @return {JSON} 一个包含地图数据的JSON 
         *  */
        createMap: function() {
            var len = this.$max;
            var $map = [];
            var index = 0;
            var x, y;
            for (var i = 0; i < len; i++) {
                y = [];
                for (var j = 0; j < len; j++, index++) {
                    x = {
                        number: -1,
                        islandmine: false,
                        isFlag: false,
                        isOpen: false,
                        x: j,
                        y: i,
                        index: index
                    };
                    y.push(x);
                }
                $map.push(y);
            }
            this.$map = $map;
            return $map;
        },

        /**
         * 创建地雷
         * @param nox {Number} 不是地雷的格子的x值，必须为数字
         * @param noy {Number} 不是地雷的格子的y值，必须为数字
         * @return {Array} 一个包含地雷位置的数组
         */
        createLandmine: function(nox, noy) {
            var x, y, islandmine, a = [];
            var num = this.$num;
            if (typeof nox !== 'number' && typeof noy !== 'number') {
                console.error('nox或者noy只能是数字！');
                return [];
            }
            if (typeof num !== 'number') {
                console.error('地雷数量类型必须为数字');
                return [];
            }

            while (num > 0) {
                x = parseInt(Math.random() * this.$max);
                y = parseInt(Math.random() * this.$max);
                console.log()
                islandmine = this.$map[y][x].islandmine;
                if (x !== nox && y !== noy && !islandmine) {
                    this.$map[y][x].islandmine = true;
                    a.push([x, y]);
                    num--;
                }
            }
            return a;
        },

        /**
         * 开图
         * @param x {Number}  
         * 开图起点x值
         * @param y {Number}
         * 开图起点y值
         */
        openMapCell: function(x, y) {
            if (!typeof x === 'number' && !typeof y === 'number') {
                console.error('开图起点坐标值必须为数字！')
                return false
            }
            var self = this;
            var map = this.$map;
            var dx = [-1, 0, 1, 1, 1, 0, -1, -1];
            var dy = [-1, -1, -1, 0, 1, 1, 1, 0];

            var num = 0;
            var flag = 0;
            var index = 0;
            var isOpen = false;

            if (isNext(x, y)) {
                loopPos(x, y);
            } else if (num) {
                /**boom */
                this.isFail = true;
            }
            if (isOpen && index === 0) {
                loopPos(x, y);
            }

            if (isOpen && flag && flag >= num && index > 0) {
                /**boom */
                this.isFail = true;
            }

            function loopPos(_x, _y) {
                var nextNode = [];
                var nx, ny, a;
                index = 0;
                num = 0;
                flag = 0;
                for (var i = 0; i < 8; i++) {
                    nx = _x + dx[i];
                    ny = _y + dy[i];
                    if (isNext(nx, ny)) {
                        /**将合法的点放进去 */
                        nextNode.push([nx, ny]);
                    }
                }
                self.$map[_y][_x].number = num;
                self.$map[_y][_x].isOpen = true;
                if (index == 0) {
                    while (nextNode.length > 0) {
                        a = nextNode.shift();
                        loopPos(a[0], a[1]);
                    }
                }
            }

            function isNext(j, i) {
                if (i < 0 || i > self.$max - 1 || j < 0 || j > self.$max - 1) {
                    return false; //在图外
                }
                if (map[i][j].islandmine) {
                    num++;
                }
                if (map[i][j].isFlag) {
                    flag++;
                }
                if (map[i][j].islandmine && !map[i][j].isFlag) {
                    index++;
                    return false; //是未被探测的雷
                }
                if (map[i][j].isOpen) {
                    isOpen = true;
                    return false; //已经遍历过
                }
                if (map[i][j].isFlag) {
                    return false;
                }
                return true; //该点合格 
            }
        },

        /**遍历整个地图
         * @param fn {Function}
         * 遍历到每个格子的时候的回调，递入参数item为地图的单位数据
         */
        eachMap: function(fn) {
            var opened = 0;
            var flagTrue = 0;
            var self = this;
            this.$map.forEach(function(line) {
                line.forEach(function(item) {
                    if (item.isOpen) {
                        opened++;
                    }
                    if (item.isFlag && item.islandmine) {
                        flagTrue++;
                    }
                    fn(item);
                });
            });
            if (flagTrue === this.$num) {
                //插旗正确胜利
                this.isWin = true;
            } else if (opened === this.$max * this.$max - this.$num) {
                //盲扫正确胜利
                this.isWin = true;
            } else {
                this.isWin = false;
            }
        },

        /**插旗 
        * @param x {Number} 要设置旗子的位置x
        * @param y {Number} 要设置旗子的位置y
        */
        setFlag: function(x, y) {
            if (this.$map[y][x].isOpen) {
                return
            }
            var bool = this.$map[y][x].isFlag;
            this.$map[y][x].isFlag = bool ? false : true;
        },

        /**获取位置 
        * @param index {Number} 地图位置的序号
        * @return x {Number} 地图位置的x值
        * @return y {Number} 地图位置的y值
        */
        getPos: function(index) {
            if(typeof index!=='number'){
                console.error('参数不是数字！')
                return 
            }
            return {
                x: index % this.$max,
                y: parseInt(index / this.$max)
            }
        },

        /**获取序号
        * @param x {Number} 地图位置的x值
        * @param y {Number} 地图位置的y值
        * @return {Number} 地图位置的序号
        */
        getIndex: function(x, y) {
            return y * this.$max + x;
        },

        /**游戏初始化
        * @param cellNum {Number} 地图格子的边数（总格子=cellNum*cellNum）
        * @param boomNum {Number} 地雷的数量
         */
        startSet: function(cellNum, boomNum) {
            if (typeof cellNum !== 'number' || typeof boomNum !== 'number') {
                console.error('请输入数字')
            }
            if (boomNum > cellNum * cellNum) {
                console.error('地图格子数量小于地雷数量！');
                return
            }
            this.$max = cellNum;
            this.$num = boomNum;
            this.isWin = false;
            this.isFail = false;
        }
    }

    return Main;

}));