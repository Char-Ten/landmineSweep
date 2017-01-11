(function() {
    var dialog = document.getElementById('dialog');
    var dialogCt = document.getElementById('dialog_ct');
    var dialogSub = document.getElementById('sub');

    var cvs = document.getElementById('app');
    var ctx = cvs.getContext('2d');
    var lms = new LandmineSweep();
    var first = true;
    var w, h

    startGame(9, 10);

    cvs.addEventListener('click', function(e) {
        var x = parseInt(e.offsetX / 20);
        var y = parseInt(e.offsetY / 20);

        if (first) {
            first = false;
            lms.createLandmine(x, y);
        }
        lms.openMapCell(x, y);

        updateUI();
    });

    cvs.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        var x = parseInt(e.offsetX / 20);
        var y = parseInt(e.offsetY / 20);

        lms.setFlag(x, y);
        updateUI();
    });

    dialogSub.addEventListener('click', function() {
        closeDialog();
        startGame(9, 10);
    })

    function updateUI() {
        ctx.clearRect(0, 0, w, h)
        lms.eachMap(function(item) {
            drawCell(item);
        });
        if (lms.isFail) {
            openDialog('菜鸡，你丫的炸了');
        }
        if (lms.isWin) {
            openDialog('你赢了！');
        }

    }

    function drawCell(item) {
        var x = item.x * 20;
        var y = item.y * 20;
        ctx.strokeRect(x, y, 20, 20);
        if (item.number === -1) {
            if (item.isFlag) {
                ctx.save();
                ctx.fillStyle = "#f00";
                ctx.fillRect(x, y, 20, 20);
                ctx.restore();
            } else {
                ctx.fillRect(x, y, 20, 20);
            }

        } else {
            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.fillRect(x, y, 20, 20);
            switch (item.number) {
                case 1:
                    ctx.fillStyle = "#00cc00";
                    break;
                case 2:
                    ctx.fillStyle = "#009999";
                    break;
                case 3:
                    ctx.fillStyle = "#04819e";
                    break;
                case 4:
                    ctx.fillStyle = "#1435ad";
                    break;
                case 5:
                    ctx.fillStyle = "#ff7f00";
                    break;
                case 6:
                    ctx.fillStyle = "#ffb100";
                    break;
                case 7:
                    ctx.fillStyle = "#ff7400";
                    break;
                case 8:
                    ctx.fillStyle = "#f00";
                    break;
            }
            ctx.fillText(item.number, x + 10, y + 10);
            ctx.restore();
        }
    }

    function startGame(cellNum, boomNum) {
        lms.startSet(cellNum, boomNum);
        lms.createMap();
        first = true;
        w = cvs.width = 20 * cellNum + 1;
        h = cvs.height = 20 * cellNum + 1;

        ctx.translate(0.5, 0.5);
        ctx.lineWidth = 1;
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#aaa";
        ctx.fillStyle = "#ddd"
        updateUI();
    }

    function openDialog(str) {
        dialogCt.innerHTML = str;
        dialog.classList.remove('z-hide');
    }

    function closeDialog() {
        dialog.classList.add('z-hide');
    }

})()