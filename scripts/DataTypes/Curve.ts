module Plot {

    export class Curve {

        formula: (x) => number;
        colour: string;

        constructor(formula: (x) => number, colour?: string) {
            this.formula = formula;

            this.colour = colour;

            if (colour == null || colour == undefined) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

} 