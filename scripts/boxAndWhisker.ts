module Plot {

    function drawLineAt(item: BoxAndWhisker, x, y, height) {
        item.context.moveTo(x,y + height / 2);
        item.context.lineTo(x, y);
        item.context.moveTo(x, y - height / 2);
        item.context.lineTo(x, y);
    }

    function draw(item: BoxAndWhisker) {
        item.baseDraw();

        var max = Maths.max(item.data, function (x) { return x.value; });

        var totalTop = item.options.margin;
        var totalBottom = item.canvas.height - item.options.margin;
        var top = totalTop;
        var bottom = totalBottom;
        var left = item.options.margin;
        var right = item.canvas.width - item.options.margin;
        var effectiveHeight = bottom - top;
        var effectiveWidth = right - left;

        var totalMax = Maths.max(item.data, function (x: xData) {
            return Maths.max(x.data, function (y: xDatum) { return y.x; });
        });

        item.context.beginPath();
        item.context.moveTo(left, bottom);
        item.context.lineTo(right, bottom);
        item.context.lineTo(right - 10, bottom - 5);
        item.context.lineTo(right - 10, bottom + 5);
        item.context.lineTo(right, bottom);
        item.context.stroke();

        var singlePlotHeight = effectiveHeight / item.data.length;

        for (var i = 0; i < item.data.length; i++) {
            item.context.strokeStyle = item.data[i].colour;

            var min = Maths.min(item.data[i].data, function (x: xDatum) { return x.x; });
            var max = Maths.max(item.data[i].data, function (x: xDatum) { return x.x; });
            var lowerQuartile = Maths.lowerQuartile(item.data[i].data);
            var upperQuartile = Maths.upperQuartile(item.data[i].data);
            var median = Maths.median(item.data[i].data);

            top = totalTop + singlePlotHeight * i;
            bottom = totalTop + singlePlotHeight * (i + 1);

            var y = top + singlePlotHeight / 2 - 10;

            item.context.beginPath();
            drawLineAt(item, left + item.animateNum * effectiveWidth * min / totalMax, y, singlePlotHeight * 4 / 5);
            item.context.lineTo(left + item.animateNum * effectiveWidth * lowerQuartile / totalMax, y);
            drawLineAt(item, left + item.animateNum * effectiveWidth * median / totalMax, y, singlePlotHeight * 4 / 5);
            item.context.moveTo(left + item.animateNum * effectiveWidth * upperQuartile / totalMax, y);
            item.context.lineTo(left + item.animateNum * effectiveWidth * max / totalMax, y);
            drawLineAt(item, left + item.animateNum * effectiveWidth * max / totalMax, y, singlePlotHeight * 4 / 5);
            item.context.rect(left + item.animateNum * effectiveWidth * lowerQuartile / totalMax, y - singlePlotHeight * 2 / 5, item.animateNum * effectiveWidth * (upperQuartile - lowerQuartile) / totalMax, singlePlotHeight * 4 / 5);
            item.context.stroke();
        }
    }

    var defaultOptions = {

        margin: 10

    }

    export class BoxAndWhisker extends BasePlot implements Ianimateable {

        data: xData[];

        constructor(id: string, data: any, options?: Object) {
            this.data = [];

            this.data = toXData(data);

            super(id, options, draw, defaultOptions);

            var me = this;
        }
    }
} 