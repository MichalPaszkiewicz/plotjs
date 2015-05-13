module Plot {

    function drawLineAt(item: BoxAndWhisker, x, y, height) {
        item.context.moveTo(x, y + height / 2);
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

                var singlePlotHeight = effectiveHeight / me.data.length;

                for (var i = 0; i < me.data.length; i++) {
                    if (my > singlePlotHeight * i && my < singlePlotHeight * (i + 1)) {
                        // tooltip text
                        var fontSize = 16;

                        var txt = "Median: " + Maths.median(me.data[i].data) + "  ||  Range: [ "
                            + Maths.min(me.data[i].data, function (x: xDatum) { return x.x; }) + " : "
                            + Maths.max(me.data[i].data, function (x: xDatum) { return x.x; }) + " ]";

                        var w = (txt.length) * 10;


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
                        me.context.textAlign = "center";
                        me.context.fillText(txt, mx, my - 20);
                    }
                }

            }

            super(id, options, defaultOptions);

        }
    }
} 