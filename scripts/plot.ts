module Plot {

    var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/).test(navigator.userAgent);

    var defaultOptions = {


    }

    export class BasePlot {

        canvas: HTMLCanvasElement;

        context: CanvasRenderingContext2D;

        draw: (item: BasePlot) => void;

        baseDraw: () => void;

        options: any;
        
        animate: () => void;

        animateNum: number;

        constructor(id: string, options: Object, sketcher: (item: BasePlot) => void, specificDefaults: any) {

            this.animateNum = 0;

            var tempOptions = options;

            if (options == null || options == undefined) {
                tempOptions = defaultOptions;
            }

            var tempOptions = options;
            for (var prop in defaultOptions) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = defaultOptions[prop];
                }
            }
            for (var prop in specificDefaults) {
                if (tempOptions[prop] == null || tempOptions[prop] == undefined) {
                    tempOptions[prop] = specificDefaults[prop];
                }
            }

            this.options = tempOptions;

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

            if (isMobile) {
                this.animateNum = 1;
                this.draw(this);
            }
            else{
                this.animate();
            }
        }
    }

} 