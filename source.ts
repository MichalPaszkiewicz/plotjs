
module Plot {

    var defaultOptions = {

        margin: 10

    }

    export class Bar extends BasePlot implements Ianimateable {

        data: KVCDatum[];

        constructor(id: string, data: any, options: Object) {
            this.data = [];        

            for (var prop in data) {
                this.data.push(new KVCDatum(prop, data[prop]));
            }


            var me = this;

            this.draw = function () {
                me.baseDraw();

                var max = Maths.max(me.data, function (x) { return x.value; });

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
                    me.context.fillRect(tempLeft, bottom, barWidth, - me.animateNum * effectiveHeight * me.data[i].value / max);
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
            }

            super(id, options, defaultOptions);

        }
    }

}
module Plot {

    function drawLineAt(item: BoxAndWhisker, x, y, height) {
        item.context.moveTo(x,y + height / 2);
        item.context.lineTo(x, y);
        item.context.moveTo(x, y - height / 2);
        item.context.lineTo(x, y);
    }

    var defaultOptions = {

        margin: 10

    }

    export class BoxAndWhisker extends BasePlot implements Ianimateable {

        data: xData[];

        constructor(id: string, data: any, options?: Object) {
            this.data = [];

            this.data = toXData(data);


            var me = this;

            this.draw = function () {
                me.baseDraw();

                var max = Maths.max(me.data, function (x) { return x.value; });

                var totalTop = me.options.margin;
                var totalBottom = me.canvas.height - me.options.margin;
                var top = totalTop;
                var bottom = totalBottom;
                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;

                var totalMax = Maths.max(me.data, function (x: xData) {
                    return Maths.max(x.data, function (y: xDatum) { return y.x; });
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

                    var min = Maths.min(me.data[i].data, function (x: xDatum) { return x.x; });
                    var max = Maths.max(me.data[i].data, function (x: xDatum) { return x.x; });
                    var lowerQuartile = Maths.lowerQuartile(me.data[i].data);
                    var upperQuartile = Maths.upperQuartile(me.data[i].data);
                    var median = Maths.median(me.data[i].data);

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
            }

            super(id, options, defaultOptions);

        }
    }
} 
 
module Plot.Maths {

    export function max(items: any[], value: (item: any) => number): number {

        var maxNum: number = 0;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (value(item) > maxNum) {
                maxNum = value(item);
            }
        }

        return maxNum;
    }

    export function min(items: any[], value: (item: any) => number): number {

        var maxNum: number = Infinity;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (value(item) < maxNum) {
                maxNum = value(item);
            }
        }

        return maxNum;
    }

    export function median(items: xDatum[]): number {

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

    export function lowerQuartile(items: xDatum[]): number {

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

    export function upperQuartile(items: xDatum[]): number {

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
}
module Plot {

    function hover(item: Pie) {

    }

    var defaultOptions = {

        margin: 10

    }

    export class Pie extends BasePlot implements Ianimateable {

        data: KVCDatum[];


        constructor(id: string, data: any, options?: Object) {
            this.data = [];

            for (var prop in data) {
                this.data.push(new KVCDatum(prop, data[prop]));
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
            }

            super(id, options, defaultOptions);
        }

    }

} 
module Plot {

    var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/).test(navigator.userAgent);

    var defaultOptions = {


    }

    export class BasePlot {

        canvas: HTMLCanvasElement;

        context: CanvasRenderingContext2D;

        draw: () => void;

        hover: () => void;

        baseDraw: () => void;

        baseHover: () => void;

        options: any;
        
        animate: () => void;

        animateNum: number;

        constructor(id: string, options: Object, specificDefaults: any) {

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

            this.canvas = <HTMLCanvasElement> document.getElementById(id);

            this.context = this.canvas.getContext("2d");

            var me = this;

            this.baseDraw = function () {
                me.canvas.height = me.canvas.parentElement.offsetHeight;
                me.canvas.width = me.canvas.parentElement.offsetWidth;
            }

            this.baseHover = function () {
                me.context.fillStyle = "rgba(0,0,0,0.2)";
                me.context.fillRect(0, 0, me.canvas.width, me.canvas.height);
            }

            this.canvas.onmspointerhover = this.hover;

            plotManager.addPlot(me);

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

            }

            if (isMobile) {
                this.animateNum = 1;
                this.draw();
            }
            else{
                this.animate();
            }
        }
    }

} 
module Plot {

    var wndw = { h: window.innerHeight, w: window.innerWidth };

    class PlotManager{

        plots: BasePlot[];

        addPlot: (item: BasePlot) => void;

        constructor() {

            this.plots = [];

            var self = this;

            this.addPlot = function (item: BasePlot) {
                self.plots.push(item);
            }

            window.onresize = function () {
                if (window.innerHeight != wndw.h || window.innerWidth != wndw.w) {
                    for (var i = 0; i < self.plots.length; i++) {
                        self.plots[i].draw();
                    }
                    wndw.h = window.innerHeight;
                    wndw.w = window.innerWidth;
                }
            }
        }
    }

    export var plotManager = new PlotManager();
} 
module Plot {

     var defaultOptions = {

        margin: 10

    }


    export class Scatter extends BasePlot implements Ianimateable {

        data: xyData[];

        curves: Curve[];

        addCurve: (x: any, colour: string) => void;

        constructor(id: string, data: any, options: any) {

            this.curves = [];   

            this.data = toXYData(data);


            var me = this;
            
            this.addCurve = function (formula, colour) {
                me.curves.push(new Curve(formula, colour));
            }

            this.draw = function() {
                me.baseDraw();

                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var top = me.options.margin;
                var bottom = me.canvas.height - me.options.margin;
                var effectiveHeight = bottom - top;
                var effectiveWidth = right - left;

                var maxX = Maths.max(me.data, function (x: xyData) { return Maths.max(x.data, function (y: xyDatum) { return y.x; }); });
                var maxY = Maths.max(me.data, function (x: xyData) { return Maths.max(x.data, function (y: xyDatum) { return y.y; }); });
                var minValX = Maths.min(me.data, function (x: xyData) { return Maths.min(x.data, function (y: xyDatum) { return y.x; }); });
                var minValY = Maths.min(me.data, function (x: xyData) { return Maths.min(x.data, function (y: xyDatum) { return y.y; }); });

                var minX = Math.min(0, minValX);
                var minY = Math.min(0, minValY);

                var yAxisPosition = 0;
                if (minX < 0) {
                    yAxisPosition = effectiveWidth * (- minX) / (maxX - minX);
                }

                var xAxisPosition = 0;
                if (minY < 0) {
                    xAxisPosition = effectiveHeight * (- minY) / (maxY - minY);
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
            }

            super(id, options, defaultOptions);

        }
    }

}
module Plot {

    export class Curve {

        formula: (x) => number;
        colour: string;

        constructor(formula: (x) => number, colour?: string) {
            this.formula = formula;

            this.colour = colour;

            if (colour == null || colour == undefined) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

} 
module Plot {

    export class KVCDatum {
        key: string;
        value: number;
        colour: string;

        constructor(key: string, value: number, colour?: string) {
            this.key = key;
            this.value = value;
            this.colour = colour;

            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

} 
module Plot {

    export interface xDatum {
        x: number;
    }

    export class xData {
        data: xDatum[];
        colour: string;

        // values have to be of the form {x: 3423, y: 12312}
        constructor(values: xDatum[], colour: string) {
            this.data = values;

            this.colour = colour;

            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

    export function toXData(items: any): xData[] {

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
}


module Plot {

    export interface xyDatum {
        x: number;
        y: number;
    }

    export class xyData {
        data: xyDatum[];
        colour: string;

        // values have to be of the form {x: 3423, y: 12312}
        constructor(values: xyDatum[], colour: string) {
            this.data = values;

            this.colour = colour;

            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

    export function toXYData(items: any): xyData[] {

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
}


module Plot {

    export interface Ianimateable {

        animate: () => void;

    }

}