# LandmineSweep
> 喜欢玩扫雷游戏吗？现在来做一个！就用`javascript`，自然是一个网页版的扫雷啦 <(￣︶￣)↗ 

landmineSweep是一个帮助你快速创建一个扫雷游戏的游戏模型的模块，从创建地图、埋雷、探雷到插旗到判断输赢，这里都提供了一系列的方法！

---
## 无图言diao，先上图！
![gif](./GIF.gif)

## 使用
这里我推荐直接阅读源码，不多，就200多行，其中很多都还是注释，注释我写得很清楚的。  
源码在./lib/LandmineSweep.js里
也建议你们参考demo的写法，直接使用原生JS+table的一个例子。
### 1. 引用

你可以使用AMD或者CMD的方式将这个模块引入，也可以用正常的方式引入
* AMD，你可以通过defind的方式引入
```javascript
/*AMD*/
defind(['LandmineSweep'],function(LandmineSweep){
    var lms=new LandmineSweep();
    /*next*/
});

```

* CMD，你可以通过require的方式引入：
```javascript
/*CMD*/
var lms= new require('LandmineSweep')();
/*next*/
```

* 直接引入，正常浏览器模式
```javascript
var lms=new LandmineSweep();     
/*next*/
```

* 不支持es6的模块引入

---

### 2. 初始化数据 方法：`startSet`
`startSet`方法是初始化整个模块的数据如地图数据、地雷数据、旗帜数据还有输赢状态，其实就是个重置方法。它接受两个参数：
* 第一个参数是地图边界`cellNum`，数字类型，比如你想创建一个9*9大小的地图矩阵，那就传入9。
* 第二个参数是地雷数量`boomNum`，数字类型，比如你想在9*9大小的地图矩阵里面埋入10个雷，那就传入10。
> 注意，这里的话，地雷数量是不能超过地图边界的平方的，也就是说，9*9的地图，不允许埋入81个雷。

使用示例：
```javascript
var lms=new LandmineSweep();
lms.startSet(9,10);
```

---

### 3. 创建地图 方法：`createMap`
`createMap`方法创建一个地图模型，将返回一个二维数组，数组里面存储着初始化的地图信息，但里面没有雷。当然这部分地图信息也可以
在调用`createMap`方法之后，访问属性`$map`得到。  

使用示例：
```javascript
var lms=new LandmineSweep();
lms.startSet(1,0);
lms.createMap();
console.log(lms.$map);
/*打印
lms.$map=[
    [{
        number:-1,//周围雷的数量，-1是未知
        islandmine: false,//是不是雷，false为非雷
        isFlag: false,//是否插旗，false为没有
        isOpen: false,//是否已经展开，false为没有
        x: 0,//位置x
        y: 0,//位置y
        index: 0// 该地图格子的顺序index  
    }]
]
*/
```

---

### 4. 创建地雷 方法 `createLandmine`
因为必须保证第一次探雷的时候所探的位置不是雷，所以该方法必须在初始化和创建地图后，在游戏界面发生第一次探雷事件后调用。它接受两个参数：
* 非雷位置x值，数字类型
* 非雷位置y值，数字类型

执行该方法之后，将返回一个记录各个地雷位置的数组。同时，属性`$map`的格子中的`islandmine`值将会变成`true`  
使用示例：
```javascript
var first=true;
app.addEventListener('click',function(e){
    if(first){
        first=false;
        lms.createLandmine(0,0);//除了（0,0）点，在地图任意位置埋雷，真正使用时，应该传入鼠标点击的坐标值
    }
    
})
```
> 注意，改方法只能在游戏第一次探雷事件发生时调用！！！具体参考demo里面的写法

---

### 5. 探测地雷 方法 `openMapCell`
这个就是核心方法了，它接收两个参数：
* 点击位置：x ,数字类型
* 点击位置：y ,数字类型

使用示例：
```javascript
app.addEventListener('click',function(){
    lms.openMapCell(0,0);//以(0,0)为中心，向周围扩散探索地雷，直遇上地雷附近的格子停下来
    /*更具体的用请参考demo*/
})
```

---

### 6. 遍历地图 方法 `eachMap`
这个方法是用来方便更新ui的，它会遍历整张地图的格子数据，它接受一个参数：
* fn ，函数类型，遍历到每个地图格子时的回调，它的第一个参数就是该格子的实例  

使用示例：
```javascript
lms.eachMap(function(item){
    console.log(item);
    /*打印：
    {
        number:-1,//周围雷的数量，-1是未知
        islandmine: false,//是不是雷，false为非雷
        isFlag: false,//是否插旗，false为没有
        isOpen: false,//是否已经展开，false为没有
        x: 0,//位置x
        y: 0,//位置y
        index: 0// 该地图格子的顺序index  
    }
    */
})
```

---

### 7. 设置旗子 方法 `setFlag`
插旗子是扫雷里面最重要的一个胜利条件啦~，扫雷里面两种玩法流派，一派是比较正常的，插旗派，直接简单粗暴地将雷标记出来。
另一种流派就比较高端了，盲扫派，将整个地图不是地雷的格子给点出来。  
针对正常玩法，提供一个设置旗子的方法，它接受两个参数：
* 要设置旗子的位置x，数字类型
* 要设置旗子的位置y，数字类型
> 注意，`setFlag`方法是允许对一个格子多次设置的，如果该格子已经是插旗状态，再对这个格子使用这个方法，将会变成非插旗状态。

使用示例：
```javascript
app.addEventListener('contextmenu',function(){
    lms.setFlag(0,0);//设置（0,0）点为旗子状态，若（0,0）点已经是插旗状态，那么将会变成非插旗状态
})
```

### 8. 根据顺序的序号获取位置 方法 `getPos`
该方法接受一个参数：地图格子的index值，数字类型。  
将会返回两个参数：
* x 数字类型 地图格子位置的x值
* y 数字类型 地图格子位置的y值
使用示例：
```javascript
var pos=lms.getPos(0);
console.log(pos);
/*打印：
    {
        x:0,
        y:0
    }
*/

```

---

### 9. 根据位置获取顺序序号 方法 `getIndex`
该方法接受两个参数：
* x ，数字类型 地图格子位置的x值
* y ，数字类型 地图格子位置的y值

它会返回一个值，数字类型，这个值就是地图格子的顺序序号

使用示例：
```javascript
var index=lms.getIndex(0,0);
console.log(index);
/*打印：
    0
*/
```

---

### 10. 胜利标志 属性 `isWin`
布尔值，每次执行`eachMap`方法后会更新一次。`true`代表游戏胜利，`false`代表游戏进行中

使用示例
```javascript
lms.eachMap(fn);
console.log(lms.isWin);
```


---

### 11. 失败标志 属性 `isFail`
布尔值，每次执行`eachMap`方法后会更新一次。`true`代表游戏失败，`false`代表游戏进行中

使用示例
```javascript
lms.eachMap(fn);
console.log(lms.isFail);
```

---

### 12. 地图数据 属性 `$map`

详见创建地雷方法`createLandmine`里面的说明与示例


