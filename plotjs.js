var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            if (isMobile) {
                this.animateNum = 1;
                this.draw();
            }
            else {
                setTimeout(function () { me.animate(); }, 20);
            }
        }
        BasePlot.prototype.animate = function () {
            var me = this;
            me.animateNum = 0;
            function animationFrame() {
                me.animateNum += 0.05;
                if (me.animateNum >= 1) {
                    me.animateNum = 1;
                    me.draw();
                    return;
                }
                me.draw();
                window.requestAnimationFrame(function () { return animationFrame(); });
            }
            animationFrame();
        };
        return BasePlot;
    }());
    Plot.BasePlot = BasePlot;
})(Plot || (Plot = {}));
/// <reference path="plot.ts" />
var Plot;
(function (Plot) {
    var defaultOptions = {
        margin: 10
    };
    var Bar = (function (_super) {
        __extends(Bar, _super);
        function Bar(id, data, options) {
            var _this = _super.call(this, id, options, defaultOptions) || this;
            _this.data = [];
            for (var prop in data) {
                var itemColour = null;
                if (options && options.colour) {
                    itemColour = options.colour[prop];
                }
                _this.data.push(new Plot.KVCDatum(prop, data[prop], itemColour));
            }
            var me = _this;
            _this.draw = function () {
                me.baseDraw();
                var max = Plot.Maths.max(me.data, function (x) { return x.value; });
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var top = me.options.margin + 10;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                //draw axis
                me.context.beginPath();
                me.context.moveTo(left, top - 10);
                me.context.lineTo(left + 5, top);
                me.context.lineTo(left - 5, top);
                me.context.lineTo(left, top - 10);
                me.context.moveTo(left, top);
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
            _this.hover = function (e) {
                var mx = (e.clientX - me.canvas.offsetLeft);
                var my = (e.clientY - me.canvas.offsetTop + document.body.scrollTop);
                var max = Plot.Maths.max(me.data, function (x) { return x.value; });
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var top = me.options.margin + 10;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                var barWidth = effectiveWidth / me.data.length;
                var tempLeft = left;
                for (var i = 0; i < me.data.length; i++) {
                    if (mx > tempLeft && mx < tempLeft + barWidth) {
                        // border line
                        me.context.beginPath();
                        me.context.strokeStyle = "gray";
                        me.context.lineWidth = 3;
                        me.context.rect(tempLeft, bottom, barWidth, -me.animateNum * effectiveHeight * me.data[i].value / max);
                        me.context.stroke();
                        // tooltip text
                        var fontSize = 16;
                        var w = (me.data[i].key.length + (me.data[i].value + "").length + 2) * 10;
                        var txtY = -40;
                        var txtX = mx;
                        if (my + txtY < 0) {
                            txtY = -txtY;
                        }
                        if (txtX - w / 2 < 0) {
                            txtX = w / 2;
                        }
                        if (txtX + w / 2 > me.canvas.width) {
                            txtX = me.canvas.width - w / 2;
                        }
                        me.context.beginPath();
                        me.context.lineWidth = 1;
                        me.context.fillStyle = "rgba(50,50,50,0.3)";
                        me.context.rect(txtX - w / 2 + 3, my + txtY + 3, w, 30);
                        me.context.fill();
                        me.context.strokeStyle = "black";
                        me.context.beginPath();
                        me.context.fillStyle = "rgba(255,255,255,0.85)";
                        me.context.rect(txtX - w / 2, my + txtY, w, 30);
                        me.context.fill();
                        me.context.stroke();
                        me.context.beginPath();
                        me.context.font = 16 + "px Arial";
                        me.context.fillStyle = "black";
                        me.context.fillText(me.data[i].key + ": " + me.data[i].value, txtX, my + txtY + 15);
                    }
                    else {
                        me.context.beginPath();
                        me.context.rect(tempLeft, bottom, barWidth, -me.animateNum * effectiveHeight * me.data[i].value / max);
                        me.context.fillStyle = "rgba(255,255,255,0.2)";
                        me.context.fill();
                    }
                    tempLeft += barWidth;
                }
            };
            return _this;
        }
        return Bar;
    }(Plot.BasePlot));
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
            var _this = _super.call(this, id, options, defaultOptions) || this;
            _this.data = [];
            _this.data = Plot.toXData(data);
            var me = _this;
            _this.draw = function () {
                me.baseDraw();
                var max = Plot.Maths.max(me.data, function (x) { return x.value; });
                var totalTop = me.options.margin;
                var totalBottom = me.canvas.height - me.options.margin;
                var top = totalTop;
                var bottom = totalBottom;
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin - 10;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                var totalMax = Plot.Maths.max(me.data, function (x) {
                    return Plot.Maths.max(x.data, function (y) { return y.x; });
                });
                // draw axis
                me.context.beginPath();
                me.context.moveTo(left, bottom);
                me.context.lineTo(right, bottom);
                me.context.moveTo(right + 10, bottom);
                me.context.lineTo(right, bottom - 5);
                me.context.lineTo(right, bottom + 5);
                me.context.lineTo(right + 10, bottom);
                me.context.stroke();
                var singlePlotHeight = effectiveHeight / me.data.length;
                for (var i = 0; i < me.data.length; i++) {
                    me.context.strokeStyle = me.data[i].colour;
                    var min = Plot.Maths.min(me.data[i].data, function (x) { return x.x; });
                    var max = Plot.Maths.max(me.data[i].data, function (x) { return x.x; });
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
            _this.hover = function (e) {
                var mx = (e.clientX - me.canvas.offsetLeft);
                var my = (e.clientY - me.canvas.offsetTop + document.body.scrollTop);
                var max = Plot.Maths.max(me.data, function (x) { return x.value; });
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var top = me.options.margin;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                var totalTop = me.options.margin;
                var singlePlotHeight = effectiveHeight / me.data.length;
                for (var i = 0; i < me.data.length; i++) {
                    if (my > singlePlotHeight * i && my < singlePlotHeight * (i + 1)) {
                        // highlight item
                        top = totalTop + singlePlotHeight * i;
                        var y = top - 10;
                        me.context.beginPath();
                        me.context.fillStyle = me.data[i].colour;
                        me.context.globalAlpha = 0.1;
                        me.context.rect(left, y, effectiveWidth, singlePlotHeight);
                        me.context.fill();
                        me.context.globalAlpha = 1;
                        // tooltip text
                        var fontSize = 16;
                        var txt = "Median: " + Plot.Maths.median(me.data[i].data) + "  ||  Range: [ "
                            + Plot.Maths.min(me.data[i].data, function (x) { return x.x; }) + " : "
                            + Plot.Maths.max(me.data[i].data, function (x) { return x.x; }) + " ]";
                        var w = (txt.length) * 10;
                        var txtY = -40;
                        var txtX = mx;
                        if (my + txtY < 0) {
                            txtY = -txtY;
                        }
                        if (txtX - w / 2 < 0) {
                            txtX = w / 2;
                        }
                        if (txtX + w / 2 > me.canvas.width) {
                            txtX = me.canvas.width - w / 2;
                        }
                        me.context.beginPath();
                        me.context.lineWidth = 1;
                        me.context.fillStyle = "rgba(50,50,50,0.3)";
                        me.context.rect(txtX - w / 2 + 3, my + txtY + 3, w, 30);
                        me.context.fill();
                        me.context.strokeStyle = "black";
                        me.context.beginPath();
                        me.context.fillStyle = "rgba(255,255,255,0.85)";
                        me.context.rect(txtX - w / 2, my + txtY, w, 30);
                        me.context.fill();
                        me.context.stroke();
                        me.context.beginPath();
                        me.context.font = 16 + "px Arial";
                        me.context.fillStyle = "black";
                        me.context.textAlign = "center";
                        me.context.fillText(txt, txtX, my + txtY + 20);
                    }
                }
            };
            return _this;
        }
        return BoxAndWhisker;
    }(Plot.BasePlot));
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
    }());
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
    }());
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
    }());
    Plot.xData = xData;
    function toXData(items) {
        if (Object.prototype.toString.call(items) === "[object Array]") {
            if (items.length == 0) {
                return [];
            }
            var isWorking = true;
            for (var i = 0; i < items.length; i++) {
                if (items[i].values == null || items[i].colour == null) {
                    isWorking = false;
                    throw new Error("The x data supplied is incorrect");
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
    }());
    Plot.xyData = xyData;
    function toXYData(items) {
        if (Object.prototype.toString.call(items) === "[object Array]") {
            if (items.length = 0) {
                return [];
            }
            var isWorking = true;
            for (var i = 0; i < items.length; i++) {
                if (items[i].values == null || items[i].colour == null) {
                    isWorking = false;
                    throw new Error("The xy data supplied is incorrect");
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
        }
        Maths.upperQuartile = upperQuartile;
        function getSplits(minNum, maxNum, splits) {
            if (splits == 0) {
                return [];
            }
            var absMin = Math.min(minNum, 0);
            var totalSize = maxNum - absMin;
            var splitSize = parseFloat((totalSize).toPrecision(1)) / splits;
            var results = [];
            for (var i = absMin; i < maxNum; i += splitSize) {
                results.push(Math.ceil(i / splitSize) * splitSize);
            }
            return results;
        }
        Maths.getSplits = getSplits;
        function isEqualToAccurate(num1, num2) {
            if (num1 == num2) {
                return true;
            }
            return Math.max(num1, num2) - Math.min(num1, num2) < 0.00000001;
        }
        Maths.isEqualToAccurate = isEqualToAccurate;
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
            var _this = _super.call(this, id, options, defaultOptions) || this;
            _this.data = [];
            for (var prop in data) {
                var itemColour = null;
                if (options && options.colour) {
                    itemColour = options.colour[prop];
                }
                _this.data.push(new Plot.KVCDatum(prop, data[prop], itemColour));
            }
            var me = _this;
            me.draw = function () {
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
                    var maximumSize = Math.min(Math.min(minLength * 3 / 2, minLength * addAngle) / (me.data[i].key.length), 50);
                    var minimumSize = Math.max(12, maximumSize);
                    me.context.font = minimumSize + "px Arial";
                    me.context.textBaseline = "middle";
                    me.context.textAlign = "center";
                    me.context.fillText(me.data[i].key, x + 2 * minLength / 3 * Math.cos(oldAngle + addAngle / 2), y + 2 * minLength / 3 * Math.sin(oldAngle + addAngle / 2), minLength);
                }
            };
            me.hover = function (e) {
                var cx = me.canvas.width / 2;
                var cy = me.canvas.height / 2;
                var mx = (e.clientX - me.canvas.offsetLeft);
                var my = (e.clientY - me.canvas.offsetTop + document.body.scrollTop);
                var x = mx - cx;
                var y = my - cy;
                var radius = Math.min(cy - me.options.margin, cx - me.options.margin);
                var radialDist = Math.sqrt(x * x + y * y);
                if (radialDist < radius) {
                    // pie border
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
                            //sector border
                            me.context.beginPath();
                            me.context.moveTo(cx, cy);
                            me.context.arc(cx, cy, minLength, oldAngle, (oldAngle + addAngle));
                            me.context.lineTo(cx, cy);
                            me.context.stroke();
                            //draw centre circle
                            me.context.beginPath();
                            me.context.arc(cx, cy, radius / 4, 0, 2 * Math.PI);
                            me.context.fillStyle = me.data[i].colour;
                            me.context.fill();
                            me.context.beginPath();
                            me.context.arc(cx, cy, radius / 4, (oldAngle + addAngle), oldAngle);
                            me.context.stroke();
                            //write text
                            var fontSize = 16;
                            var w = (me.data[i].key.length + (me.data[i].value + "").length + 8) * 10;
                            var txtY = -40;
                            var txtX = mx;
                            if (my + txtY < 0) {
                                txtY = -txtY;
                            }
                            if (txtX - w / 2 < 0) {
                                txtX = w / 2;
                            }
                            if (txtX + w / 2 > me.canvas.width) {
                                txtX = me.canvas.width - w / 2;
                            }
                            me.context.beginPath();
                            me.context.lineWidth = 1;
                            me.context.fillStyle = "rgba(50,50,50,0.3)";
                            me.context.rect(txtX - w / 2 + 3, my + txtY + 3, w, 30);
                            me.context.fill();
                            me.context.strokeStyle = "black";
                            me.context.beginPath();
                            me.context.fillStyle = "rgba(255,255,255,0.85)";
                            me.context.rect(txtX - w / 2, my + txtY, w, 30);
                            me.context.fill();
                            me.context.stroke();
                            me.context.beginPath();
                            me.context.font = 16 + "px Arial";
                            me.context.fillStyle = "black";
                            me.context.fillText(me.data[i].key + ": " + me.data[i].value + " (" + (Math.round(me.data[i].value / total * 1000) / 10) + "%)", txtX, my + txtY + 15);
                        }
                    }
                }
            };
            return _this;
        }
        return Pie;
    }(Plot.BasePlot));
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
    }());
    Plot.PlotManager = PlotManager;
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
            var _this = _super.call(this, id, options, defaultOptions) || this;
            _this.curves = [];
            _this.data = Plot.toXYData(data);
            var me = _this;
            _this.addCurve = function (formula, colour) {
                me.curves.push(new Plot.Curve(formula, colour));
            };
            _this.draw = function () {
                me.baseDraw();
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin - 10;
                var top = me.options.margin + 10;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                var maxX = Plot.Maths.max(me.data, function (x) { return Plot.Maths.max(x.data, function (y) { return y.x; }); });
                var maxY = Plot.Maths.max(me.data, function (x) { return Plot.Maths.max(x.data, function (y) { return y.y; }); });
                var minValX = Plot.Maths.min(me.data, function (x) { return Plot.Maths.min(x.data, function (y) { return y.x; }); });
                var minValY = Plot.Maths.min(me.data, function (x) { return Plot.Maths.min(x.data, function (y) { return y.y; }); });
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
                me.context.moveTo(left + yAxisPosition, top - 10);
                me.context.lineTo(left + yAxisPosition + 5, top);
                me.context.lineTo(left + yAxisPosition - 5, top);
                me.context.lineTo(left + yAxisPosition, top - 10);
                me.context.moveTo(left + yAxisPosition, top);
                me.context.lineTo(left + yAxisPosition, bottom);
                me.context.moveTo(left, bottom - xAxisPosition);
                me.context.lineTo(right, bottom - xAxisPosition);
                me.context.moveTo(right + 10, bottom - xAxisPosition);
                me.context.lineTo(right, bottom - xAxisPosition - 5);
                me.context.lineTo(right, bottom - xAxisPosition + 5);
                me.context.lineTo(right + 10, bottom - xAxisPosition);
                me.context.strokeStyle = "black";
                me.context.stroke();
                //draw axis text
                //x
                var xSplits = Math.floor(effectiveWidth / 50);
                var xLabels = Plot.Maths.getSplits(minX, maxX, xSplits);
                for (var i = 0; i < xLabels.length; i++) {
                    if (xLabels[i] != 0 && xLabels[i] <= maxX) {
                        var tempLabelX = left + effectiveWidth * ((xLabels[i] - minX) / (maxX - minX));
                        var tempLabelY = bottom - xAxisPosition;
                        me.context.beginPath();
                        me.context.moveTo(tempLabelX, tempLabelY);
                        me.context.lineTo(tempLabelX, tempLabelY + 5);
                        me.context.stroke();
                        me.context.textAlign = "center";
                        me.context.fillText(xLabels[i].toPrecision(3), tempLabelX, tempLabelY + 15);
                    }
                }
                //y
                var ySplits = Math.floor(me.canvas.height / 50);
                var yLabels = Plot.Maths.getSplits(minY, maxY, ySplits);
                for (var i = 0; i < yLabels.length; i++) {
                    if (yLabels[i] != 0 && yLabels[i] <= maxY) {
                        var tempLabelX = left + yAxisPosition;
                        var tempLabelY = bottom - effectiveHeight * ((yLabels[i] - minY) / (maxY - minY));
                        me.context.beginPath();
                        me.context.moveTo(tempLabelX, tempLabelY);
                        me.context.lineTo(tempLabelX - 5, tempLabelY);
                        me.context.stroke();
                        me.context.textAlign = "right";
                        me.context.textBaseline = "middle";
                        me.context.fillText(yLabels[i].toPrecision(3), tempLabelX - 10, tempLabelY);
                    }
                }
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
            _this.hover = function (e) {
                var mx = (e.clientX - me.canvas.offsetLeft);
                var my = (e.clientY - me.canvas.offsetTop + document.body.scrollTop);
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin - 10;
                var top = me.options.margin + 10;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;
                var maxX = Plot.Maths.max(me.data, function (x) { return Plot.Maths.max(x.data, function (y) { return y.x; }); });
                var maxY = Plot.Maths.max(me.data, function (x) { return Plot.Maths.max(x.data, function (y) { return y.y; }); });
                var minValX = Plot.Maths.min(me.data, function (x) { return Plot.Maths.min(x.data, function (y) { return y.x; }); });
                var minValY = Plot.Maths.min(me.data, function (x) { return Plot.Maths.min(x.data, function (y) { return y.y; }); });
                var minX = Math.min(0, minValX);
                var minY = Math.min(0, minValY);
                var setX = 0;
                var setY = 0;
                var nearestDataPoint = { data: 0, datum: 0, pointDistance: Infinity };
                for (var i = 0; i < me.data.length; i++) {
                    for (var j = 0; j < me.data[i].data.length; j++) {
                        var lengthX = (me.data[i].data[j].x - minX) / (maxX - minX);
                        var tempX = left + effectiveWidth * lengthX;
                        var heightY = (me.data[i].data[j].y - minY) / (maxY - minY);
                        var tempY = bottom - effectiveHeight * heightY;
                        var xDist = tempX - mx;
                        var yDist = tempY - my;
                        var pointDistance = Math.sqrt(xDist * xDist + yDist * yDist);
                        if (pointDistance <= nearestDataPoint.pointDistance) {
                            nearestDataPoint.data = i;
                            nearestDataPoint.datum = j;
                            nearestDataPoint.pointDistance = pointDistance;
                            setX = tempX;
                            setY = tempY;
                        }
                    }
                }
                var i = nearestDataPoint.data;
                var j = nearestDataPoint.datum;
                // circle the item
                me.context.beginPath();
                me.context.arc(setX, setY, 10, 0, 2 * Math.PI);
                me.context.strokeStyle = me.data[i].colour;
                me.context.stroke();
                var txt = "( " + me.data[i].data[j].x + " , " + me.data[i].data[j].y + " )";
                // tooltip text
                var fontSize = 16;
                var w = txt.length * 10;
                var txtY = -60;
                var txtX = mx;
                if (my + txtY < 0) {
                    txtY = -txtY;
                }
                if (txtX - w / 2 < 0) {
                    txtX = w / 2;
                }
                if (txtX + w / 2 > me.canvas.width) {
                    txtX = me.canvas.width - w / 2;
                }
                me.context.textBaseline = "middle";
                me.context.beginPath();
                me.context.lineWidth = 1;
                me.context.fillStyle = "rgba(50,50,50,0.3)";
                me.context.rect(txtX - w / 2 + 3, my + txtY + 3, w, 30);
                me.context.fill();
                me.context.strokeStyle = "black";
                me.context.beginPath();
                me.context.fillStyle = "rgba(255,255,255,0.85)";
                me.context.rect(txtX - w / 2, my + txtY, w, 30);
                me.context.fill();
                me.context.stroke();
                me.context.beginPath();
                me.context.font = 16 + "px Arial";
                me.context.fillStyle = "black";
                me.context.textAlign = "center";
                me.context.fillText(txt, txtX, my + txtY + 15);
            };
            return _this;
        }
        return Scatter;
    }(Plot.BasePlot));
    Plot.Scatter = Scatter;
})(Plot || (Plot = {}));
//# sourceMappingURL=plotjs.js.map