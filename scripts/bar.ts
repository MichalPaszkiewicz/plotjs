/// <reference path="plot.ts" />
module Plot {

    var defaultOptions = {

        margin: 10

    }

    export class Bar extends BasePlot implements Ianimateable{

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

            this.hover = function (e: MouseEvent) {
                var mx = (e.clientX - me.canvas.offsetLeft);
                var my = (e.clientY - me.canvas.offsetTop + document.body.scrollTop);
                
                var max = Maths.max(me.data, function (x) { return x.value; });

                var left = me.options.margin;
                var right = me.canvas.width - me.options.margin;
                var top = me.options.margin;
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
                        me.context.rect(tempLeft, bottom, barWidth, - me.animateNum * effectiveHeight * me.data[i].value / max);
                        me.context.stroke();

                        // tooltip text
                        var fontSize = 16;
                        var w = (me.data[i].key.length + (me.data[i].value + "").length + 2) * 10;

                        me.context.beginPath();
                        me.context.lineWidth = 1;

                        me.context.fillStyle = "rgba(50,50,50,0.3)";
                        me.context.rect(mx - w / 2 + 3, my - 37, w, 30);
                        me.context.fill();

                        me.context.strokeStyle = "black";
                        me.context.beginPath();
                        me.context.fillStyle = "rgba(255,255,255,0.85)";
                        me.context.rect(mx - w / 2, my - 40, w, 30);
                        me.context.fill();
                        me.context.stroke();

                        me.context.beginPath();
                        me.context.font = 16 + "px Arial";
                        me.context.fillStyle = "black";
                        me.context.fillText(me.data[i].key + ": " + me.data[i].value, mx, my - 25);
                    }
                    else {
                        me.context.beginPath();
                        me.context.rect(tempLeft, bottom, barWidth, - me.animateNum * effectiveHeight * me.data[i].value / max);
                        me.context.fillStyle = "rgba(255,255,255,0.2)";
                        me.context.fill();
                    }

                    tempLeft += barWidth;
                }

            }

            super(id, options, defaultOptions);

        }
    }

}