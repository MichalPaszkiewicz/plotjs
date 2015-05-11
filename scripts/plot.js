var Plot;
(function (Plot) {
    var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/).test(navigator.userAgent);
    var defaultOptions = {};
    var BasePlot = (function () {
        function BasePlot(id, options, specificDefaults) {
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
            this.canvas = document.getElementById(id);
            this.context = this.canvas.getContext("2d");
            var me = this;
            this.baseDraw = function () {
                me.canvas.height = me.canvas.parentElement.offsetHeight;
                me.canvas.width = me.canvas.parentElement.offsetWidth;
            };
            this.baseHover = function () {
                me.context.fillStyle = "rgba(0,0,0,0.2)";
                me.context.fillRect(0, 0, me.canvas.width, me.canvas.height);
            };
            this.canvas.onmspointerhover = this.hover;
            Plot.plotManager.addPlot(me);
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
            };
            if (isMobile) {
                this.animateNum = 1;
                this.draw();
            }
            else {
                this.animate();
            }
        }
        return BasePlot;
    })();
    Plot.BasePlot = BasePlot;
})(Plot || (Plot = {}));
