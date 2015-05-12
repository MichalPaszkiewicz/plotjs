/// <reference path="plot.ts" />
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