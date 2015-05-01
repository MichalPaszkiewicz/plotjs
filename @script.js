var Plot;
(function (Plot) {
    var BasePlot = (function () {
        function BasePlot(id, options, sketcher) {
            this.canvas = document.getElementById(id);
            this.context = this.canvas.getContext("2d");
            var me = this;
            this.baseDraw = function () {
                me.canvas.height = me.canvas.parentElement.offsetHeight;
                me.canvas.width = me.canvas.parentElement.offsetWidth;
            };
            this.draw = sketcher;
            Plot.plotManager.addPlot(me);
        }
        return BasePlot;
    })();
    Plot.BasePlot = BasePlot;
})(Plot || (Plot = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="plot.ts" />
var Plot;
(function (Plot) {
    function draw(item) {
        item.baseDraw();
        var total = 0;
        for (var i = 0; i < item.data.length; i++) {
            total += item.data[i].value;
        }
        var x = item.canvas.width / 2;
        var y = item.canvas.height / 2;
        var minLength = Math.min(x, y);
        item.context.arc(x, y, minLength, 0, Math.PI * 2);
        item.context.stroke();
        var tempAngle = 0;
        for (var i = 0; i < item.data.length; i++) {
            var oldAngle = tempAngle;
            var addAngle = item.animateNum * Math.PI * 2 * item.data[i].value / total;
            item.context.beginPath();
            item.context.moveTo(x, y);
            item.context.arc(x, y, minLength, tempAngle, tempAngle = tempAngle + addAngle);
            item.context.fillStyle = item.data[i].colour;
            item.context.fill();
            item.context.beginPath();
            item.context.fillStyle = "black";
            item.context.font = (Math.min(minLength, minLength / 2 * addAngle) / (item.data[i].key.length)) + "px Arial";
            item.context.textBaseline = "middle";
            item.context.textAlign = "center";
            item.context.fillText(item.data[i].key, x + 2 * minLength / 3 * Math.cos(oldAngle + addAngle / 2), y + 2 * minLength / 3 * Math.sin(oldAngle + addAngle / 2), minLength);
        }
    }
    var defaultOptions = {};
    var PieDatum = (function () {
        function PieDatum(key, value) {
            this.key = key;
            this.value = value;
            this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
        }
        return PieDatum;
    })();
    var Pie = (function (_super) {
        __extends(Pie, _super);
        function Pie(id, data, options) {
            this.data = [];
            this.animateNum = 0;
            if (options == null || options == undefined) {
                options = defaultOptions;
            }
            for (var prop in data) {
                this.data.push(new PieDatum(prop, data[prop]));
            }
            _super.call(this, id, options, draw);
            var me = this;
            //this.draw(me);
            this.animate = function () {
                me.animateNum = 0;
                function animationFrame() {
                    me.animateNum += 0.05;
                    if (me.animateNum >= 1) {
                        me.animateNum = 1;
                        me.draw(me);
                        return;
                    }
                    me.draw(me);
                    window.requestAnimationFrame(animationFrame);
                }
                animationFrame();
            };
            this.animate();
        }
        return Pie;
    })(Plot.BasePlot);
    Plot.Pie = Pie;
})(Plot || (Plot = {}));
/// <reference path="plot.ts" />
var Plot;
(function (Plot) {
    var PlotManager = (function () {
        function PlotManager() {
            this.plots = [];
            var self = this;
            this.addPlot = function (item) {
                self.plots.push(item);
            };
            window.onresize = function () {
                for (var i = 0; i < self.plots.length; i++) {
                    self.plots[i].draw(self.plots[i]);
                }
            };
        }
        return PlotManager;
    })();
    Plot.plotManager = new PlotManager();
})(Plot || (Plot = {}));
//# sourceMappingURL=@script.js.map