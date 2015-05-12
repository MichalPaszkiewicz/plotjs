var Plot;
(function (Plot) {
    var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/).test(navigator.userAgent);
    var defaultOptions = {};
    var BasePlot = (function () {
        function BasePlot(id, options, specificDefaults) {
            this.animateNum = 0;
            var tempOptions = options;
            if (options == null || options == undefined) {
                tempOptions = defaultOptions;
            }
            var tempOptions = options;
            for (var prop in defaultOptions) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = defaultOptions[prop];
                }
            }
            for (var prop in specificDefaults) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = specificDefaults[prop];
                }
            }
            this.options = tempOptions;
            this.canvas = document.getElementById(id);
            this.context = this.canvas.getContext("2d");
            var me = this;
            this.baseDraw = function () {
                me.canvas.height = me.canvas.parentElement.offsetHeight;
                me.canvas.width = me.canvas.parentElement.offsetWidth;
            };
            this.baseHover = function () {
                if (me.hover != null) {
                    me.context.fillStyle = "rgba(250,250,250,0.8)";
                    me.context.fillRect(0, 0, me.canvas.width, me.canvas.height);
                }
            };
            var moveEvent = function (e) {
                if (me.hover != null) {
                    me.draw();
                    me.hover(e);
                }
            };
            this.canvas.addEventListener("mouseover", function () {
                me.canvas.addEventListener("mousemove", moveEvent);
            });
            this.canvas.addEventListener("mouseout", function () {
                me.canvas.removeEventListener("mousemove", moveEvent);
                me.draw();
            });
            Plot.plotManager.addPlot(me);
            this.animate = function () {
                me.animateNum = 0;
                function animationFrame() {
                    me.animateNum += 0.05;
                    if (me.animateNum >= 1) {
                        me.animateNum = 1;
                        me.draw();
                        return;
                    }
                    me.draw();
                    window.requestAnimationFrame(animationFrame);
                }
                animationFrame();
            };
            if (isMobile) {
                this.animateNum = 1;
                this.draw();
            }
            else {
                this.animate();
            }
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
    var defaultOptions = {
        margin: 10
    };
    var Bar = (function (_super) {
        __extends(Bar, _super);
        function Bar(id, data, options) {
            this.data = [];
            for (var prop in data) {
                this.data.push(new Plot.KVCDatum(prop, data[prop]));
            }
            var me = this;
            this.draw = function () {
                me.baseDraw();
                var max = Plot.Maths.max(me.data, function (x) {
                    return x.value;
                });
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var top = me.options.margin;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                //draw axis
                me.context.beginPath();
                me.context.moveTo(left, top);
                me.context.lineTo(left + 5, top + 10);
                me.context.lineTo(left - 5, top + 10);
                me.context.lineTo(left, top);
                me.context.lineTo(left, bottom);
                me.context.lineTo(right, bottom);
                me.context.strokeStyle = "black";
                me.context.stroke();
                var barWidth = effectiveWidth / me.data.length;
                var tempLeft = left;
                for (var i = 0; i < me.data.length; i++) {
                    me.context.beginPath();
                    me.context.fillStyle = me.data[i].colour;
                    me.context.fillRect(tempLeft, bottom, barWidth, -me.animateNum * effectiveHeight * me.data[i].value / max);
                    me.context.closePath();
                    tempLeft += barWidth;
                }
                tempLeft = left;
                for (var i = 0; i < me.data.length; i++) {
                    me.context.beginPath();
                    me.context.textAlign = "center";
                    me.context.textBaseline = "middle";
                    var isOverHalf = (me.data[i].value) > max / 2;
                    var txtY = bottom - me.animateNum * effectiveHeight * me.data[i].value / max + (isOverHalf ? 10 : -10);
                    me.context.fillStyle = "black";
                    me.context.fillText(me.data[i].key, tempLeft + barWidth / 2, txtY);
                    tempLeft += barWidth;
                }
            };
            //this.hover = function () {
            //    me.baseHover();
            //}
            _super.call(this, id, options, defaultOptions);
        }
        return Bar;
    })(Plot.BasePlot);
    Plot.Bar = Bar;
})(Plot || (Plot = {}));
var Plot;
(function (Plot) {
    function drawLineAt(item, x, y, height) {
        item.context.moveTo(x, y + height / 2);
        item.context.lineTo(x, y);
        item.context.moveTo(x, y - height / 2);
        item.context.lineTo(x, y);
    }
    var defaultOptions = {
        margin: 10
    };
    var BoxAndWhisker = (function (_super) {
        __extends(BoxAndWhisker, _super);
        function BoxAndWhisker(id, data, options) {
            this.data = [];
            this.data = Plot.toXData(data);
            var me = this;
            this.draw = function () {
                me.baseDraw();
                var max = Plot.Maths.max(me.data, function (x) {
                    return x.value;
                });
                var totalTop = me.options.margin;
                var totalBottom = me.canvas.height - me.options.margin;
                var top = totalTop;
                var bottom = totalBottom;
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                var totalMax = Plot.Maths.max(me.data, function (x) {
                    return Plot.Maths.max(x.data, function (y) {
                        return y.x;
                    });
                });
                me.context.beginPath();
                me.context.moveTo(left, bottom);
                me.context.lineTo(right, bottom);
                me.context.lineTo(right - 10, bottom - 5);
                me.context.lineTo(right - 10, bottom + 5);
                me.context.lineTo(right, bottom);
                me.context.stroke();
                var singlePlotHeight = effectiveHeight / me.data.length;
                for (var i = 0; i < me.data.length; i++) {
                    me.context.strokeStyle = me.data[i].colour;
                    var min = Plot.Maths.min(me.data[i].data, function (x) {
                        return x.x;
                    });
                    var max = Plot.Maths.max(me.data[i].data, function (x) {
                        return x.x;
                    });
                    var lowerQuartile = Plot.Maths.lowerQuartile(me.data[i].data);
                    var upperQuartile = Plot.Maths.upperQuartile(me.data[i].data);
                    var median = Plot.Maths.median(me.data[i].data);
                    top = totalTop + singlePlotHeight * i;
                    bottom = totalTop + singlePlotHeight * (i + 1);
                    var y = top + singlePlotHeight / 2 - 10;
                    me.context.beginPath();
                    drawLineAt(me, left + me.animateNum * effectiveWidth * min / totalMax, y, singlePlotHeight * 4 / 5);
                    me.context.lineTo(left + me.animateNum * effectiveWidth * lowerQuartile / totalMax, y);
                    drawLineAt(me, left + me.animateNum * effectiveWidth * median / totalMax, y, singlePlotHeight * 4 / 5);
                    me.context.moveTo(left + me.animateNum * effectiveWidth * upperQuartile / totalMax, y);
                    me.context.lineTo(left + me.animateNum * effectiveWidth * max / totalMax, y);
                    drawLineAt(me, left + me.animateNum * effectiveWidth * max / totalMax, y, singlePlotHeight * 4 / 5);
                    me.context.rect(left + me.animateNum * effectiveWidth * lowerQuartile / totalMax, y - singlePlotHeight * 2 / 5, me.animateNum * effectiveWidth * (upperQuartile - lowerQuartile) / totalMax, singlePlotHeight * 4 / 5);
                    me.context.stroke();
                }
            };
            //this.hover = function () {
            //    me.baseHover();
            //}
            _super.call(this, id, options, defaultOptions);
        }
        return BoxAndWhisker;
    })(Plot.BasePlot);
    Plot.BoxAndWhisker = BoxAndWhisker;
})(Plot || (Plot = {}));
var Plot;
(function (Plot) {
    var Curve = (function () {
        function Curve(formula, colour) {
            this.formula = formula;
            this.colour = colour;
            if (colour == null || colour == undefined) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
        return Curve;
    })();
    Plot.Curve = Curve;
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
    var xData = (function () {
        // values have to be of the form {x: 3423, y: 12312}
        function xData(values, colour) {
            this.data = values;
            this.colour = colour;
            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
        return xData;
    })();
    Plot.xData = xData;
    function toXData(items) {
        if (Object.prototype.toString.call(items) === "[object Array]") {
            if (items.length == 0) {
                return [];
            }
            var isWorking = true;
            for (var i = 0; i < items.length; i++) {
                if (items[i].values == null || items[i].colour == null) {
                    throw new Error("The x data supplied is incorrect");
                    isWorking = false;
                }
            }
            if (isWorking) {
                //change from array to stuff
                var xyDataeaeaeae = [];
                for (var i = 0; i < items.length; i++) {
                    xyDataeaeaeae.push(new xData(items[i].values, items[i].colour));
                }
                return xyDataeaeaeae;
            }
        }
        else {
            if (items.values == null || items.colour == null) {
                throw new Error("The x data supplied is incorrect");
            }
            else {
                //change from object to stuff
                return [new xData(items.values, items.colour)];
            }
        }
    }
    Plot.toXData = toXData;
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
        function median(items) {
            items.sort(function (a, b) {
                return a.x - b.x;
            });
            var half = Math.floor(items.length / 2);
            if (items.length % 2) {
                return items[half].x;
            }
            else {
                return (items[half - 1].x + items[half].x) / 2.0;
            }
            return 0;
        }
        Maths.median = median;
        function lowerQuartile(items) {
            items.sort(function (a, b) {
                return a.x - b.x;
            });
            var quarter = Math.floor(items.length / 4);
            if (items.length % 4) {
                return items[quarter].x;
            }
            else {
                return (items[quarter - 1].x + items[quarter].x) / 2.0;
            }
            return 0;
        }
        Maths.lowerQuartile = lowerQuartile;
        function upperQuartile(items) {
            items.sort(function (a, b) {
                return a.x - b.x;
            });
            var threeQuarter = Math.floor(items.length * 3 / 4);
            if (items.length % 4) {
                return items[threeQuarter].x;
            }
            else {
                return (items[threeQuarter - 1].x + items[threeQuarter].x) / 2.0;
            }
            return 0;
        }
        Maths.upperQuartile = upperQuartile;
    })(Maths = Plot.Maths || (Plot.Maths = {}));
})(Plot || (Plot = {}));
/// <reference path="plot.ts" />
var Plot;
(function (Plot) {
    function hover(item) {
    }
    var defaultOptions = {
        margin: 10
    };
    var Pie = (function (_super) {
        __extends(Pie, _super);
        function Pie(id, data, options) {
            this.data = [];
            for (var prop in data) {
                this.data.push(new Plot.KVCDatum(prop, data[prop]));
            }
            var me = this;
            this.draw = function () {
                me.baseDraw();
                var total = 0;
                for (var i = 0; i < me.data.length; i++) {
                    total += me.data[i].value;
                }
                var x = me.canvas.width / 2;
                var y = me.canvas.height / 2;
                var minLength = Math.min(x - me.options.margin, y - me.options.margin);
                me.context.arc(x, y, minLength, 0, Math.PI * 2);
                me.context.stroke();
                var tempAngle = 0;
                for (var i = 0; i < me.data.length; i++) {
                    var oldAngle = tempAngle;
                    var addAngle = me.animateNum * Math.PI * 2 * me.data[i].value / total;
                    me.context.beginPath();
                    me.context.moveTo(x, y);
                    me.context.arc(x, y, minLength, tempAngle, tempAngle = tempAngle + addAngle);
                    me.context.fillStyle = me.data[i].colour;
                    me.context.fill();
                    me.context.beginPath();
                    me.context.fillStyle = "black";
                    me.context.font = Math.min(Math.min(minLength * 3 / 2, minLength * addAngle) / (me.data[i].key.length), 100) + "px Arial";
                    me.context.textBaseline = "middle";
                    me.context.textAlign = "center";
                    me.context.fillText(me.data[i].key, x + 2 * minLength / 3 * Math.cos(oldAngle + addAngle / 2), y + 2 * minLength / 3 * Math.sin(oldAngle + addAngle / 2), minLength);
                }
            };
            this.hover = function (e) {
                var cx = me.canvas.width / 2;
                var cy = me.canvas.height / 2;
                var x = (e.clientX - me.canvas.offsetLeft) - cx;
                var y = (e.clientY - me.canvas.offsetTop + document.body.scrollTop) - cy;
                var radius = Math.min(cy - me.options.margin, cx - me.options.margin);
                var radialDist = Math.sqrt(x * x + y * y);
                if (radialDist < radius) {
                    me.baseHover();
                    me.context.strokeStyle = "gray";
                    me.context.beginPath();
                    me.context.lineWidth = 3;
                    me.context.arc(cx, cy, radius, 0, Math.PI * 2);
                    me.context.stroke();
                    var total = 0;
                    for (var i = 0; i < me.data.length; i++) {
                        total += me.data[i].value;
                    }
                    var minLength = Math.min(cx - me.options.margin, cy - me.options.margin);
                    var tempAngle = 0;
                    var mouseAngle = Math.atan2(y, x);
                    if (mouseAngle < 0) {
                        mouseAngle += 2 * Math.PI;
                    }
                    for (var i = 0; i < me.data.length; i++) {
                        var oldAngle = tempAngle;
                        var addAngle = me.animateNum * Math.PI * 2 * me.data[i].value / total;
                        tempAngle = tempAngle + addAngle;
                        if (mouseAngle > oldAngle && mouseAngle < oldAngle + addAngle) {
                            me.context.beginPath();
                            me.context.moveTo(cx, cy);
                            me.context.arc(cx, cy, minLength, oldAngle, (oldAngle + addAngle));
                            me.context.lineTo(cx, cy);
                            me.context.fillStyle = me.data[i].colour;
                            me.context.fill();
                            me.context.stroke();
                            var fontSize = Math.min(3 * radius / (2 * (me.data[i].key.length + 2 + (me.data[i].value + "").length)), 80);
                            me.context.beginPath();
                            me.context.arc(cx, cy, radius / 2, 0, 2 * Math.PI);
                            me.context.fillStyle = me.data[i].colour;
                            //me.context.stroke();
                            me.context.fill();
                            me.context.beginPath();
                            me.context.arc(cx, cy, radius / 2, (oldAngle + addAngle), oldAngle);
                            me.context.stroke();
                            me.context.font = fontSize + "px Arial";
                            me.context.fillStyle = "black";
                            me.context.fillText(me.data[i].key + ": " + me.data[i].value, cx, cy);
                        }
                    }
                }
            };
            _super.call(this, id, options, defaultOptions);
        }
        return Pie;
    })(Plot.BasePlot);
    Plot.Pie = Pie;
})(Plot || (Plot = {}));
/// <reference path="plot.ts" />
var Plot;
(function (Plot) {
    var wndw = { h: window.innerHeight, w: window.innerWidth };
    var PlotManager = (function () {
        function PlotManager() {
            this.plots = [];
            var self = this;
            this.addPlot = function (item) {
                self.plots.push(item);
            };
            window.onresize = function () {
                if (window.innerHeight != wndw.h || window.innerWidth != wndw.w) {
                    for (var i = 0; i < self.plots.length; i++) {
                        self.plots[i].draw();
                    }
                    wndw.h = window.innerHeight;
                    wndw.w = window.innerWidth;
                }
            };
        }
        return PlotManager;
    })();
    Plot.plotManager = new PlotManager();
})(Plot || (Plot = {}));
var Plot;
(function (Plot) {
    var defaultOptions = {
        margin: 10
    };
    var Scatter = (function (_super) {
        __extends(Scatter, _super);
        function Scatter(id, data, options) {
            this.curves = [];
            this.data = Plot.toXYData(data);
            var me = this;
            this.addCurve = function (formula, colour) {
                me.curves.push(new Plot.Curve(formula, colour));
            };
            this.draw = function () {
                me.baseDraw();
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var top = me.options.margin;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                var maxX = Plot.Maths.max(me.data, function (x) {
                    return Plot.Maths.max(x.data, function (y) {
                        return y.x;
                    });
                });
                var maxY = Plot.Maths.max(me.data, function (x) {
                    return Plot.Maths.max(x.data, function (y) {
                        return y.y;
                    });
                });
                var minValX = Plot.Maths.min(me.data, function (x) {
                    return Plot.Maths.min(x.data, function (y) {
                        return y.x;
                    });
                });
                var minValY = Plot.Maths.min(me.data, function (x) {
                    return Plot.Maths.min(x.data, function (y) {
                        return y.y;
                    });
                });
                var minX = Math.min(0, minValX);
                var minY = Math.min(0, minValY);
                var yAxisPosition = 0;
                if (minX < 0) {
                    yAxisPosition = effectiveWidth * (-minX) / (maxX - minX);
                }
                var xAxisPosition = 0;
                if (minY < 0) {
                    xAxisPosition = effectiveHeight * (-minY) / (maxY - minY);
                }
                //draw axis
                me.context.beginPath();
                me.context.moveTo(left + yAxisPosition, top);
                me.context.lineTo(left + yAxisPosition + 5, top + 10);
                me.context.lineTo(left + yAxisPosition - 5, top + 10);
                me.context.lineTo(left + yAxisPosition, top);
                me.context.lineTo(left + yAxisPosition, bottom);
                me.context.moveTo(left, bottom - xAxisPosition);
                me.context.lineTo(right, bottom - xAxisPosition);
                me.context.lineTo(right - 10, bottom - xAxisPosition - 5);
                me.context.lineTo(right - 10, bottom - xAxisPosition + 5);
                me.context.lineTo(right, bottom - xAxisPosition);
                me.context.strokeStyle = "black";
                me.context.stroke();
                for (var i = 0; i < me.data.length; i++) {
                    me.context.strokeStyle = me.data[i].colour;
                    var nums = Math.round(me.data[i].data.length * me.animateNum / 1);
                    for (var j = 0; j < nums; j++) {
                        me.context.beginPath();
                        var lengthX = (me.data[i].data[j].x - minX) / (maxX - minX);
                        var tempX = left + effectiveWidth * lengthX;
                        var heightY = (me.data[i].data[j].y - minY) / (maxY - minY);
                        var tempY = bottom - effectiveHeight * heightY;
                        me.context.moveTo(tempX - 3, tempY);
                        me.context.lineTo(tempX + 3, tempY);
                        me.context.moveTo(tempX, tempY - 3);
                        me.context.lineTo(tempX, tempY + 3);
                        me.context.stroke();
                    }
                }
                for (var c = 0; c < me.curves.length; c++) {
                    var steps = 3000;
                    for (var i = minX; i < maxX - (maxX - minX) * (1 - me.animateNum); i += (maxX - minX) / steps) {
                        var lengthX = (i - minX) / (maxX - minX);
                        var tempX = left + effectiveWidth * lengthX;
                        var heightY = (me.curves[c].formula(i) - minY) / (maxY - minY);
                        var tempY = bottom - effectiveHeight * heightY;
                        me.context.fillStyle = me.curves[c].colour;
                        me.context.fillRect(tempX, tempY, 1, 1);
                    }
                }
            };
            //this.hover = function () {
            //    me.baseHover();
            //}
            _super.call(this, id, options, defaultOptions);
        }
        return Scatter;
    })(Plot.BasePlot);
    Plot.Scatter = Scatter;
})(Plot || (Plot = {}));
//# sourceMappingURL=plotjs.js.map