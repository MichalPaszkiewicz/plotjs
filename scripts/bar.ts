/// <reference path="plot.ts" />
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