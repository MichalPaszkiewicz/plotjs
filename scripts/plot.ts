module Plot {

    export class BasePlot {

        canvas: HTMLCanvasElement;

        context: CanvasRenderingContext2D;

        draw: (item: BasePlot) => void;

        baseDraw: () => void;

        options: any;

        animate: () => void;

        animateNum: number;

        constructor(id: string, options: Object, sketcher: (item: BasePlot) => void) {

            this.animateNum = 0;

            this.options = options;

            this.canvas = <HTMLCanvasElement> document.getElementById(id);

            this.context = this.canvas.getContext("2d");

            var me = this;

            this.baseDraw = function () {
                me.canvas.height = me.canvas.parentElement.offsetHeight;
                me.canvas.width = me.canvas.parentElement.offsetWidth;
            }

            this.draw = sketcher;

            plotManager.addPlot(me);

            this.animate = function () {
                me.animateNum = 0;

                function animationFrame() {
                    me.animateNum += 0.05;
                    if (me.animateNum >= 1) {
                        me.animateNum = 1;
                        me.draw(me);
                        return;
                    }
                    me.draw(me);
                    window.requestAnimationFrame(animationFrame);
                }

                animationFrame();

            }

            this.animate();
        }
    }

} 