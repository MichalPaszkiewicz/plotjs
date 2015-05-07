module Plot {

    function draw(item: BoxAndWhisker) {


    }

    var defaultOptions = {


    }

    export class BoxAndWhisker extends BasePlot implements Ianimateable {

        data: xData[];


        constructor(id: string, data: any, options?: Object) {
            this.data = [];

            this.data = toXData(data);

            super(id, options, draw, defaultOptions);

            var me = this;
        }
    }
} 