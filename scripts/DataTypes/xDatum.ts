namespace Plot {

    export interface xDatum {
        x: number;
    }

    export class xData {
        data: xDatum[];
        colour: string;

        // values have to be of the form {x: 3423, y: 12312}
        constructor(values: xDatum[], colour: string) {
            this.data = values;

            this.colour = colour;

            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

    export function toXData(items: any): xData[] {

        if (Object.prototype.toString.call(items) === "[object Array]") {

            if (items.length == 0) {
                return [];
            }

            var isWorking = true;

            for (var i = 0; i < items.length; i++) {
                if (items[i].values == null || items[i].colour == null) {
                    isWorking = false;                    
                    throw new Error("The x data supplied is incorrect");
                }
            }

            if (isWorking) {
                //change from array to stuff
                var xyDataeaeaeae = [];

                for (var i = 0; i < items.length; i++) {
                    xyDataeaeaeae.push(new xData(items[i].values, items[i].colour));
                }

                return xyDataeaeaeae;
            }
        }
        else {
            if (items.values == null || items.colour == null) {
                throw new Error("The x data supplied is incorrect");
            }
            else {
                //change from object to stuff
                return [new xData(items.values, items.colour)];
            }
        }

    }
}

