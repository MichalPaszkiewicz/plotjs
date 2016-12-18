namespace Plot {

    export class KVCDatum {
        key: string;
        value: number;
        colour: string;

        constructor(key: string, value: number, colour?: string) {
            this.key = key;
            this.value = value;
            this.colour = colour;

            if (colour == null) {
                this.colour = "hsl(" + ~~(Math.random() * 360) + ",99%,60%)";
            }
        }
    }

} 