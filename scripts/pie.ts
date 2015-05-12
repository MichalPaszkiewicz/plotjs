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

            this.hover = function (e: MouseEvent) {
                me.baseHover();

                var cx = me.canvas.width / 2;
                var cy = me.canvas.height / 2;

                var x = (e.clientX - me.canvas.offsetLeft ) - cx;
                var y = (e.clientY - me.canvas.offsetTop + document.body.scrollTop) - cy;

                var radius = Math.min(cy - me.options.margin, cx - me.options.margin);

                var radialDist = Math.sqrt(x * x + y * y);

                if (radialDist < radius) {
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
                            me.context.arc(cx, cy, minLength, oldAngle,(oldAngle + addAngle));
                            me.context.lineTo(cx, cy);
                            me.context.fillStyle = me.data[i].colour;
                            me.context.fill();
                            me.context.stroke();

                            var fontSize = Math.min(cx * 2 / (me.data[i].key.length + 2 + (me.data[i].value + "").length), 80);

                            me.context.font = fontSize + "px Arial";
                            me.context.fillStyle = "black";
                            me.context.fillText(me.data[i].key + ": " + me.data[i].value, cx, cy);
                        }
                    }
                }
            }

            super(id, options, defaultOptions);
        }

    }

} 