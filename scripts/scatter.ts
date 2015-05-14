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

            this.draw = function () {
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

            this.hover = function (e: MouseEvent) {
                var mx = (e.clientX - me.canvas.offsetLeft);
                var my = (e.clientY - me.canvas.offsetTop + document.body.scrollTop);

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

                var setX = 0;
                var setY = 0;

                var nearestDataPoint = { data: 0, datum: 0, pointDistance: Infinity };

                for (var i = 0; i < me.data.length; i++) {
                    for (var j = 0; j < me.data[i].data.length; j++) {

                        var lengthX = (me.data[i].data[j].x - minX) / (maxX - minX);
                        var tempX = left + effectiveWidth * lengthX;

                        var heightY = (me.data[i].data[j].y - minY) / (maxY - minY);
                        var tempY = bottom - effectiveHeight * heightY;

                        var xDist = tempX - mx;
                        var yDist = tempY - my;

                        var pointDistance = Math.sqrt(xDist * xDist + yDist * yDist);
                        if (pointDistance <= nearestDataPoint.pointDistance) {           
                            nearestDataPoint.data = i;
                            nearestDataPoint.datum = j;
                            nearestDataPoint.pointDistance = pointDistance;

                            setX = tempX;
                            setY = tempY;
                        }
                    }
                }

                var i = nearestDataPoint.data;
                var j = nearestDataPoint.datum;

                // circle the item
                me.context.beginPath();
                me.context.arc(setX, setY, 10, 0, 2 * Math.PI);
                me.context.strokeStyle = me.data[i].colour;
                me.context.stroke();

                var txt = "( " + me.data[i].data[j].x + " , " + me.data[i].data[j].y + " )";

                // tooltip text
                var fontSize = 16;
                var w = txt.length * 10;

                var txtY = -60;
                var txtX = mx;

                if (my + txtY < 0) {
                    txtY = -txtY;
                }

                if (txtX - w / 2 < 0) {
                    txtX = w / 2;
                }

                if (txtX + w / 2 > me.canvas.width) {
                    txtX = me.canvas.width - w / 2;
                }

                me.context.beginPath();
                me.context.lineWidth = 1;

                me.context.fillStyle = "rgba(50,50,50,0.3)";
                me.context.rect(txtX - w / 2 + 3, my + txtY + 3, w, 30);
                me.context.fill();

                me.context.strokeStyle = "black";
                me.context.beginPath();
                me.context.fillStyle = "rgba(255,255,255,0.85)";
                me.context.rect(txtX - w / 2, my + txtY, w, 30);
                me.context.fill();
                me.context.stroke();

                me.context.beginPath();
                me.context.font = 16 + "px Arial";
                me.context.fillStyle = "black";
                me.context.textAlign = "center";
                me.context.fillText(txt, txtX, my + txtY + 20);

            }
            super(id, options, defaultOptions);

        }
    }

}