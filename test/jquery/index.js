;
(function() {
    var lm = new LandmineSweep();
    var first = true;
    var td, tr, cell = [];
    startGame(9, 10)

    $('#tbl')
        .on('click', function(e) {
            var target = e.target;
            var index = parseInt(target.dataset.index);
            var pos = lm.getPos(index);
            if (first) {
                first = false;
                lm.createLandmine(pos.x, pos.y);
            }
            lm.openMapCell(pos.x, pos.y);
            updateUI();
        }).on('contextmenu', function(e) {
            e.preventDefault();
            var target = e.target;
            var index = parseInt(target.dataset.index);
            var pos = lm.getPos(index);
            lm.setFlag(pos.x, pos.y);
            updateUI();
        });

    $('#sub').on('click', function() {
        closeDialog();
        startGame(9, 10);
    })

    function startGame(cellNum, boomNum) {
        lm.startSet(cellNum, boomNum);
        lm.createMap();
        cell = [];
        first = true;
        $('#tbl').empty();
        var frg = document.createDocumentFragment();
        lm.$map.forEach(function(line) {
            tr = $('<tr></tr>');
            line.forEach(function(item) {
                td = $('<td></td>');
                td.attr('data-index', item.index);
                tr.append(td);
                cell.push(td);
            });
            $(frg).append(tr);
        });
        $('#tbl').append($(frg));
    }

    function updateUI() {
        var i = 0;
        lm.eachMap(function(item) {
            i = item.index;
            if (item.isOpen) {
                classColor = 'z-num-' + item.number
                cell[i].addClass('z-open ' + classColor);
                cell[i].text(item.number ? item.number : '');
            }
            if (item.isFlag) {
                cell[i].addClass('z-flag');
            } else {
                cell[i].removeClass('z-flag');
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
        $('#dialog_ct').html(str);
        $('#dialog').removeClass('z-hide');
    }

    function closeDialog() {
        $('#dialog').addClass('z-hide');
    }


})();