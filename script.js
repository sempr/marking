var filechooser = document.getElementById('filechooser');
var previewer = document.getElementById('previewer');

var $ = function(sel) {
    return document.querySelector(sel);
};

var change = function() {
    var files = $("#filechooser").files;
    if (files.length == 0) return;
    var file = files[0];
    if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) return;

    var reader = new FileReader();

    reader.onload = function() {
        var result = this.result;
        genPic(result);
    };

    reader.readAsDataURL(file);
};

function change2() {
    change();
}

$("#filechooser").onchange = change;
$("#alpha").onchange = change;
$("#angel").onchange = change;
$("#space").onchange = change;
$("#size").onchange = change;
$("#text").onchange = change;

function genPic(img_url) {
    var c = document.getElementById("canvas-2");
    var ctx = c.getContext("2d");
    var img = new Image();
    img.src = img_url;
    img.onload = function() {
        var limitW = 1000;
        var w = Math.max(img.width, img.height);
        if (w < limitW) {
            c.width = img.width;
            c.height = img.height;
        } else {
            c.width = img.width * limitW / w;
            c.height = img.height * limitW / w;
        }

        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, c.width, c.height
        );

        color_orig = $("#color").value;

        var x = color_orig.slice(3, color_orig.length - 1);

        ctx.fillStyle = "rgba" + x + "," + $('#alpha').value + ")";
        ctx.translate(400, 300);
        var fs = +$("#size").value * 4;
        ctx.font = fs + "px serif";
        var text = $("#text").value;

        var textw = ctx.measureText(text);
        var width = textw.width;
        var diff = 10 * $("#space").value;

        ctx.rotate($("#angel").value * Math.PI / 180);

        var N = 30;
        var M = 30;

        for (var j = -M; j < M; j++) {
            for (var i = -N; i < N; i++) {
                ctx.fillText(text, 10 + i * (width + diff), 10 + j * (fs + diff));
            }
        }
        ctx.rotate(315 * Math.PI / 180);
        ctx.translate(-400, -300);
    };
}

function download() {
    var canvas = document.getElementById("canvas-2");
    var img = canvas.toDataURL("image/png");

    var dlLink = document.createElement('a');
    var now = new Date();
    var ss = [now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes(), now.getSeconds()].join("-")
    dlLink.download = ss + ".png";
    dlLink.href = img;
    dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

document.addEventListener("DOMContentLoaded", function() {
    var click_color = function() {
        document.querySelectorAll(".color-box").forEach(function(el) {
            el.classList = "color-box";
        });
        this.classList = "color-box select";
        $("#color").value = this.style.backgroundColor;
        change2();
    };

    var colors = ["#000000", "#ff0000", "#00ff00", "#0000ff"];
    for (i = 0; i < colors.length; i++) {
        var bt = document.createElement("button");
        bt.style.backgroundColor = colors[i];
        bt.classList = "color-box";
        bt.onclick = click_color;
        $("#colors").appendChild(bt);
    }

    $(".color-box").onchange = change2;
});