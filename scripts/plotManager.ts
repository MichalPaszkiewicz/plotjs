/// <reference path="plot.ts" />
module Plot {

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
                for (var i = 0; i < self.plots.length; i++) {
                    self.plots[i].draw(self.plots[i]);
                }
            }
        }
    }

    export var plotManager = new PlotManager();
} 