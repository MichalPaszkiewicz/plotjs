/// <reference path="plot.ts" />
module Plot {

    function draw(item: Bar) {
        item.baseDraw();

        var max = Maths.max(item.data, function (x) { return x.value; });

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
            item.context.fillStyle = item.data[i].colour;
            item.context.fillRect(tempLeft, bottom, barWidth, - effectiveHeight * item.data[i].value / max);
            tempLeft += barWidth;
        }
    }

    var defaultOptions = {

        margin: 10

    }

    export class Bar extends BasePlot implements Ianimateable {

        data: KVCDatum[];

        animate: () => void;

        animateNum: number;

        constructor(id: string, data: any, options: Object) {
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
                this.data.push(new KVCDatum(prop, data[prop]));
            }

            super(id, options, draw);

            var me = this;

            me.draw(me);

        }
    }

}