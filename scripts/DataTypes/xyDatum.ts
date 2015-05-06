module Plot {

    export interface xyDatum {
        x: number;
        y: number;
    }

    export class xyData {
        data: xyDatum[];
        colour: string;

        // values have to be of the form {x: 3423, y: 12312}
        constructor(values: xyDatum[], colour: string) {
            this.data = values;

            this.colour = colour;

            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

    export function toXYData(items: any): xyData[] {

        if (Object.prototype.toString.call(items) === "[object Array]") {

            if (items.length = 0) {
                return [];
            }

            var isWorking = true;

            for (var i = 0; i < items.length; i++) {
                if (items[i].values == null || items[i].colour == null) {
                    throw new Error("The xy data supplied is incorrect");
                    isWorking = false;
                }
            }

            if (isWorking) {
                //change from array to stuff
                var xyDataeaeaeae = [];

                for (var i = 0; i < items.length; i++) {
                    xyDataeaeaeae.push(new xyData(items[i].values, items[i].colour));
                }

                return xyDataeaeaeae;
            }
        }
        else {
            if (items.values == null || items.colour == null) {
                throw new Error("The xy data supplied is incorrect");
            }
            else {
                //change from object to stuff
                return [new xyData(items.values, items.colour)];
            }
        }

    }
}

