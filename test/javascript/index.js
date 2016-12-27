;
(function() {
    var dialog = document.getElementById('dialog');
    var dialogCt = document.getElementById('dialog_ct');
    var dialogSub = document.getElementById('sub');
    var table = document.getElementById('tbl');
    var lm = new LandmineSweep();
    var first = true;
    var td, tr, cell = [];
    startGame(9, 10)

    table.addEventListener('click', function(e) {
        var target = e.target;
        var index = parseInt(target.dataset.index);
        var pos = lm.getPos(index);
        if (first) {
            first = false;
            lm.createLandmine(pos.x, pos.y);
        }
        lm.openMapCell(pos.x, pos.y);
        updateUI();
    });

    table.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        var target = e.target;
        var index = parseInt(target.dataset.index);
        var pos = lm.getPos(index);
        lm.setFlag(pos.x, pos.y);
        updateUI();
    });

    dialogSub.addEventListener('click', function() {
        closeDialog();
        startGame(9, 10);
    })

    function startGame(cellNum, boomNum) {
        lm.startSet(cellNum, boomNum);
        lm.createMap();
        cell = [];
        first = true;
        table.innerHTML = '';
        lm.$map.forEach(function(line) {
            tr = document.createElement('tr');
            line.forEach(function(item) {
                td = document.createElement('td');
                td.dataset.index = item.index;
                tr.appendChild(td);
                cell.push(td);
            });
            table.appendChild(tr);
        });
    }

    function updateUI() {
        var i = 0;
        lm.eachMap(function(item) {
            i = item.index;
            if (item.isOpen) {
                classColor = 'z-num-' + item.number
                cell[i].classList.add('z-open', classColor);
                cell[i].innerText = item.number ? item.number : '';
            }
            if (item.isFlag) {
                cell[i].classList.add('z-flag');
            } else {
                cell[i].classList.remove('z-flag');
            }
        });
        if (lm.isFail) {
            openDialog('菜鸡，你丫的炸了');
        }
        if (lm.isWin) {
            openDialog('你赢了！');
        }
    }



    function openDialog(str) {
        dialogCt.innerHTML = str;
        dialog.classList.remove('z-hide');
    }

    function closeDialog() {
        dialog.classList.add('z-hide');
    }


})();