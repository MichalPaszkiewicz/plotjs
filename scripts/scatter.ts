module Plot {

    function draw(item: Scatter) {
        item.baseDraw();

        var left = item.options.margin;
        var right = item.canvas.width - item.options.margin;
        var top = item.options.margin;
        var bottom = item.canvas.height - item.options.margin;
        var effectiveHeight = bottom - top;
        var effectiveWidth = right - left;

        var maxX = Maths.max(item.data, function (x: xyData) { return Maths.max(x.data, function (y: xyDatum) { return y.x; }); });
        var maxY = Maths.max(item.data, function (x: xyData) { return Maths.max(x.data, function (y: xyDatum) { return y.y; }); });
        var minValX = Maths.min(item.data, function (x: xyData) { return Maths.min(x.data, function (y: xyDatum) { return y.x; }); });
        var minValY = Maths.min(item.data, function (x: xyData) { return Maths.min(x.data, function (y: xyDatum) { return y.y; }); });

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
        item.context.beginPath();
        item.context.moveTo(left + yAxisPosition, top);
        item.context.lineTo(left + yAxisPosition + 5, top + 10);
        item.context.lineTo(left + yAxisPosition - 5, top + 10);
        item.context.lineTo(left + yAxisPosition, top);
        item.context.lineTo(left + yAxisPosition, bottom);

        item.context.moveTo(left, bottom - xAxisPosition);
        item.context.lineTo(right, bottom - xAxisPosition);
        item.context.lineTo(right - 10, bottom - xAxisPosition - 5);
        item.context.lineTo(right - 10, bottom - xAxisPosition + 5);
        item.context.lineTo(right, bottom - xAxisPosition);
        item.context.strokeStyle = "black";
        item.context.stroke();

        for (var i = 0; i < item.data.length; i++) {
            item.context.strokeStyle = item.data[i].colour;

            var nums = Math.round(item.data[i].data.length * item.animateNum / 1);

            for (var j = 0; j < nums; j++) {
                item.context.beginPath();
                var lengthX =  (item.data[i].data[j].x - minX) / (maxX - minX);
                var tempX = left + effectiveWidth * lengthX;

                var heightY = (item.data[i].data[j].y - minY ) / (maxY - minY);
                var tempY = bottom - effectiveHeight * heightY;

                item.context.moveTo(tempX - 3, tempY);
                item.context.lineTo(tempX + 3, tempY);
                item.context.moveTo(tempX, tempY - 3);
                item.context.lineTo(tempX, tempY + 3);
                item.context.stroke();
            } 
        }

        for (var c = 0; c < item.curves.length; c++) {
            var steps = 3000;
            for (var i = minX; i < maxX - (maxX - minX) * (1 - item.animateNum); i += (maxX - minX) / steps) {
                var lengthX = (i - minX) / (maxX - minX);
                var tempX = left + effectiveWidth * lengthX;

                var heightY = (item.curves[c].formula(i) - minY) / (maxY - minY);
                var tempY = bottom - effectiveHeight * heightY;

                item.context.fillStyle = item.curves[c].colour;
                item.context.fillRect(tempX, tempY, 1, 1);
            }
        }
    }

    var defaultOptions = {

        margin: 10

    }


    export class Scatter extends BasePlot implements Ianimateable {

        data: xyData[];

        curves: Curve[];

        addCurve: (x: any, colour: string) => void;

        constructor(id: string, data: any, options: any) {

            this.curves = [];

            if (options == null || options == undefined) {
                options = defaultOptions;
            }

            var tempOptions = options;
            for (var prop in defaultOptions) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = defaultOptions[prop];
                }
            }        

            this.data = toXYData(data);

            super(id, options, draw);

            var me = this;
            
            this.addCurve = function (formula, colour) {
                me.curves.push(new Curve(formula, colour));
            }
        }
    }

}