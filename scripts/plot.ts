module Plot {

    var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/).test(navigator.userAgent);

    var defaultOptions = {


    }

    export class BasePlot {

        canvas: HTMLCanvasElement;

        context: CanvasRenderingContext2D;

        draw: () => void;

        baseDraw: () => void;

        hover: () => void;

        baseHover: () => void;

        options: any;
        
        animate: () => void;

        animateNum: number;

        constructor(id: string, options: Object, specificDefaults: any) {

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

            this.baseHover = function () {
                me.context.fillStyle = "rgba(0,0,0,0.2)";
                me.context.fillRect(0, 0, me.canvas.width, me.canvas.height);
            }

            this.canvas.addEventListener("mouseover", function () {
                me.hover();
            });

            plotManager.addPlot(me);

            this.animate = function () {
                me.animateNum = 0;

                function animationFrame() {
                    me.animateNum += 0.05;
                    if (me.animateNum >= 1) {
                        me.animateNum = 1;
                        me.draw();
                        return;
                    }
                    me.draw();
                    window.requestAnimationFrame(animationFrame);
                }

                animationFrame();

            }

            if (isMobile) {
                this.animateNum = 1;
                this.draw();
            }
            else{
                this.animate();
            }
        }
    }

} 