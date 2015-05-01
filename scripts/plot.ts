module Plot {

    export class BasePlot {

        canvas: HTMLCanvasElement;

        context: CanvasRenderingContext2D;

        draw: (item: BasePlot) => void;

        baseDraw: () => void;

        constructor(id: string, options: Object, sketcher: (item: BasePlot) => void) {

            this.canvas = <HTMLCanvasElement> document.getElementById(id);

            this.context = this.canvas.getContext("2d");

            var me = this;

            this.baseDraw = function () {
                me.canvas.height = me.canvas.parentElement.offsetHeight;
                me.canvas.width = me.canvas.parentElement.offsetWidth;
            }

            this.draw = sketcher;

            plotManager.addPlot(me);
        }
    }

} 