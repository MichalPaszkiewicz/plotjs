/// <reference path="plot.ts" />
module Plot {

    var wndw = { h: window.innerHeight, w: window.innerWidth };

    class PlotManager{

        plots: BasePlot[];

        addPlot: (item: BasePlot) => void;

        constructor() {

            this.plots = [];

            var self = this;

            this.addPlot = function (item: BasePlot) {
                self.plots.push(item);
            }

            window.onresize = function () {
                if (window.innerHeight != wndw.h || window.innerWidth != wndw.w) {
                    for (var i = 0; i < self.plots.length; i++) {
                        self.plots[i].draw();
                    }
                    wndw.h = window.innerHeight;
                    wndw.w = window.innerWidth;
                }
            }
        }
    }

    export var plotManager = new PlotManager();
} 