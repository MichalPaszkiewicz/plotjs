var Plot;
(function (Plot) {
    var BasePlot = (function () {
        function BasePlot(id, options, sketcher) {
            this.options = options;
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
        var max = Plot.Maths.max(item.data, function (x) {
            return x.value;
        });
        var left = item.options.margin;
        var right = item.canvas.width - item.options.margin;
        var top = item.options.margin;
        var bottom = item.canvas.height - item.options.margin;
        var effectiveHeight = bottom - top;
        var effectiveWidth = right - left;
        //draw axis
        item.context.beginPath();
        item.context.moveTo(left, top);
        item.context.lineTo(left + 5, top + 10);
        item.context.lineTo(left - 5, top + 10);
        item.context.lineTo(left, top);
        item.context.lineTo(left, bottom);
        item.context.lineTo(right, bottom);
        item.context.strokeStyle = "black";
        item.context.stroke();
        var barWidth = effectiveWidth / item.data.length;
        var tempLeft = left;
        for (var i = 0; i < item.data.length; i++) {
            item.context.beginPath();
            item.context.fillStyle = item.data[i].colour;
            item.context.fillRect(tempLeft, bottom, barWidth, -item.animateNum * effectiveHeight * item.data[i].value / max);
            item.context.closePath();
            item.context.beginPath();
            item.context.textAlign = "center";
            item.context.textBaseline = "middle";
            var isOverHalf = (item.data[i].value) > max / 2;
            var txtY = bottom - item.animateNum * effectiveHeight * item.data[i].value / max + (isOverHalf ? 10 : -10);
            item.context.fillStyle = "black";
            item.context.fillText(item.data[i].key, tempLeft + barWidth / 2, txtY);
            tempLeft += barWidth;
        }
    }
    var defaultOptions = {
        margin: 10
    };
    var Bar = (function (_super) {
        __extends(Bar, _super);
        function Bar(id, data, options) {
            this.data = [];
            this.animateNum = 0;
            if (options == null || options == undefined) {
                options = defaultOptions;
            }
            var tempOptions = options;
            for (var prop in defaultOptions) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = defaultOptions[prop];
                }
            }
            for (var prop in data) {
                this.data.push(new Plot.KVCDatum(prop, data[prop]));
            }
            _super.call(this, id, options, draw);
            var me = this;
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
        return Bar;
    })(Plot.BasePlot);
    Plot.Bar = Bar;
})(Plot || (Plot = {}));
var Plot;
(function (Plot) {
    var KVCDatum = (function () {
        function KVCDatum(key, value, colour) {
            this.key = key;
            this.value = value;
            this.colour = colour;
            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
        return KVCDatum;
    })();
    Plot.KVCDatum = KVCDatum;
})(Plot || (Plot = {}));
var Plot;
(function (Plot) {
    var xyData = (function () {
        // values have to be of the form {x: 3423, y: 12312}
        function xyData(values, colour) {
            this.data = values;
            this.colour = colour;
            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
        return xyData;
    })();
    Plot.xyData = xyData;
    function toXYData(items) {
        if (Object.prototype.toString.call(items) === "[object Array]") {
            if (items.length = 0) {
                return [];
            }
            var isWorking = true;
            for (var i = 0; i < items.length; i++) {
                if (items[i].values == null || items[i].colour == null) {
                    throw new Error("The xy data supplied is incorrect");
                    isWorking = false;
                }
            }
            if (isWorking) {
                //change from array to stuff
                var xyDataeaeaeae = [];
                for (var i = 0; i < items.length; i++) {
                    xyDataeaeaeae.push(new xyData(items[i].values, items[i].colour));
                }
                return xyDataeaeaeae;
            }
        }
        else {
            if (items.values == null || items.colour == null) {
                throw new Error("The xy data supplied is incorrect");
            }
            else {
                //change from object to stuff
                return [new xyData(items.values, items.colour)];
            }
        }
    }
    Plot.toXYData = toXYData;
})(Plot || (Plot = {}));
var Plot;
(function (Plot) {
    var Maths;
    (function (Maths) {
        function max(items, value) {
            var maxNum = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (value(item) > maxNum) {
                    maxNum = value(item);
                }
            }
            return maxNum;
        }
        Maths.max = max;
        function min(items, value) {
            var maxNum = Infinity;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (value(item) < maxNum) {
                    maxNum = value(item);
                }
            }
            return maxNum;
        }
        Maths.min = min;
    })(Maths = Plot.Maths || (Plot.Maths = {}));
})(Plot || (Plot = {}));
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
    var Pie = (function (_super) {
        __extends(Pie, _super);
        function Pie(id, data, options) {
            this.data = [];
            this.animateNum = 0;
            if (options == null || options == undefined) {
                options = defaultOptions;
            }
            var tempOptions = options;
            for (var prop in defaultOptions) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = defaultOptions[prop];
                }
            }
            for (var prop in data) {
                this.data.push(new Plot.KVCDatum(prop, data[prop]));
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
var Plot;
(function (Plot) {
    function draw(item) {
        item.baseDraw();
        var left = item.options.margin;
        var right = item.canvas.width - item.options.margin;
        var top = item.options.margin;
        var bottom = item.canvas.height - item.options.margin;
        var effectiveHeight = bottom - top;
        var effectiveWidth = right - left;
        var maxX = Plot.Maths.max(item.data, function (x) {
            return Plot.Maths.max(x.data, function (y) {
                return y.x;
            });
        });
        var maxY = Plot.Maths.max(item.data, function (x) {
            return Plot.Maths.max(x.data, function (y) {
                return y.y;
            });
        });
        var minValX = Plot.Maths.min(item.data, function (x) {
            return Plot.Maths.min(x.data, function (y) {
                return y.x;
            });
        });
        var minValY = Plot.Maths.min(item.data, function (x) {
            return Plot.Maths.min(x.data, function (y) {
                return y.y;
            });
        });
        var minX = Math.min(0, minValX);
        var minY = Math.min(0, minValY);
        var axisPosition = 0;
        if (minY < 0) {
            axisPosition = effectiveHeight * (-minY) / (maxY - minY);
        }
        //draw axis
        item.context.beginPath();
        item.context.moveTo(left, top);
        item.context.lineTo(left + 5, top + 10);
        item.context.lineTo(left - 5, top + 10);
        item.context.lineTo(left, top);
        item.context.lineTo(left, bottom);
        item.context.moveTo(left, bottom - axisPosition);
        item.context.lineTo(right, bottom - axisPosition);
        item.context.strokeStyle = "black";
        item.context.stroke();
        for (var i = 0; i < item.data.length; i++) {
            item.context.strokeStyle = item.data[i].colour;
            for (var j = 0; j < item.data[i].data.length; j++) {
                item.context.beginPath();
                var lengthX = item.data[i].data[j].x / maxX;
                var tempX = left + effectiveWidth * lengthX;
                var heightY = (item.data[i].data[j].y - minY) / (maxY - minY);
                var tempY = bottom - effectiveHeight * heightY;
                item.context.moveTo(tempX - 3, tempY);
                item.context.lineTo(tempX + 3, tempY);
                item.context.moveTo(tempX, tempY - 3);
                item.context.lineTo(tempX, tempY + 3);
                item.context.stroke();
            }
        }
    }
    var defaultOptions = {
        margin: 10
    };
    var Scatter = (function (_super) {
        __extends(Scatter, _super);
        function Scatter(id, data, options) {
            this.animateNum = 0;
            if (options == null || options == undefined) {
                options = defaultOptions;
            }
            var tempOptions = options;
            for (var prop in defaultOptions) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = defaultOptions[prop];
                }
            }
            this.data = Plot.toXYData(data);
            _super.call(this, id, options, draw);
            var me = this;
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
        return Scatter;
    })(Plot.BasePlot);
    Plot.Scatter = Scatter;
})(Plot || (Plot = {}));
//# sourceMappingURL=@script.js.map