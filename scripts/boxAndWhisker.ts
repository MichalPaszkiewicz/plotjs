module Plot {

    function drawLineAt(item: BoxAndWhisker, x, y) {
        item.context.moveTo(x,y + 25);
        item.context.lineTo(x, y);
        item.context.moveTo(x, y - 25);
        item.context.lineTo(x, y);
    }

    function draw(item: BoxAndWhisker) {
        item.baseDraw();

        var max = Maths.max(item.data, function (x) { return x.value; });

        var left = item.options.margin;
        var right = item.canvas.width - item.options.margin;
        var top = item.options.margin;
        var bottom = item.canvas.height - item.options.margin;
        var effectiveHeight = bottom - top;
        var effectiveWidth = right - left;

        item.context.beginPath();
        item.context.moveTo(left, bottom);
        item.context.lineTo(right, bottom);
        item.context.lineTo(right - 10, bottom - 5);
        item.context.lineTo(right - 10, bottom + 5);
        item.context.lineTo(right, bottom);
        item.context.stroke();

        var min = 20;
        var max = 100;
        var lowerQuartile = 30;
        var upperQuartile = 60;
        var median = 50;

        item.context.beginPath();
        drawLineAt(item, left + effectiveWidth * min / max, top + effectiveHeight / 2 - 10);
        item.context.lineTo(left + effectiveWidth * lowerQuartile / max, top + effectiveHeight / 2 - 10);
        drawLineAt(item, left + effectiveWidth * lowerQuartile / max, top + effectiveHeight / 2 - 10);
        drawLineAt(item, left + effectiveWidth * median / max, top + effectiveHeight / 2 - 10);
        drawLineAt(item, left + effectiveWidth * upperQuartile / max, top + effectiveHeight / 2 - 10);
        item.context.lineTo(left + effectiveWidth, top + effectiveHeight / 2 - 10);
        drawLineAt(item, left + effectiveWidth, top + effectiveHeight / 2 - 10);
        item.context.rect(left + effectiveWidth * lowerQuartile / max, top + effectiveHeight / 2 - 35, effectiveWidth * (upperQuartile - lowerQuartile) / max, 50);
        item.context.stroke();
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