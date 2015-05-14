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
                var cx = me.canvas.width / 2;
                var cy = me.canvas.height / 2;

                var mx = (e.clientX - me.canvas.offsetLeft);
                var my = (e.clientY - me.canvas.offsetTop + document.body.scrollTop);

                var x = mx - cx;
                var y = my - cy;

                var radius = Math.min(cy - me.options.margin, cx - me.options.margin);

                var radialDist = Math.sqrt(x * x + y * y);

                if (radialDist < radius) {
                    
                    // pie border
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
                            //sector border
                            me.context.beginPath();
                            me.context.moveTo(cx, cy);
                            me.context.arc(cx, cy, minLength, oldAngle,(oldAngle + addAngle));
                            me.context.lineTo(cx, cy);
                            me.context.stroke();

                            //draw centre circle
                            me.context.beginPath();
                            me.context.arc(cx, cy, radius / 4, 0, 2 * Math.PI);
                            me.context.fillStyle = me.data[i].colour;
                            me.context.fill();
                            me.context.beginPath();
                            me.context.arc(cx, cy, radius / 4,(oldAngle + addAngle), oldAngle);
                            me.context.stroke();

                            //write text
                            var fontSize = 16;
                            var w = (me.data[i].key.length + (me.data[i].value + "").length + 8) * 10;

                            var txtY = -40;
                            var txtX = mx;

                            if (my + txtY < 0) {
                                txtY = -txtY;
                            }

                            if (txtX - w/2 < 0) {
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
                            me.context.fillText(me.data[i].key + ": " + me.data[i].value + " (" + (Math.round(me.data[i].value / total * 1000) / 10) + "%)", txtX, my + txtY + 15);
                        }
                    }
                }
            }

            super(id, options, defaultOptions);
        }

    }

} 