module Plot.Maths {

    export function max(items: any[], value: (item: any) => number): number {

        var maxNum: number = 0;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (value(item) > maxNum) {
                maxNum = value(item);
            }
        }

        return maxNum;
    }

    export function min(items: any[], value: (item: any) => number): number {

        var maxNum: number = Infinity;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (value(item) < maxNum) {
                maxNum = value(item);
            }
        }

        return maxNum;
    }

    export function median(items: xDatum[]): number {

        items.sort(function (a, b) {
            return a.x - b.x;
        });

        var half = Math.floor(items.length / 2);

        if (items.length % 2) {
            return items[half].x;
        }
        else {
            return (items[half - 1].x + items[half].x) / 2.0;
        }

        return 0;
    }

    export function lowerQuartile(items: xDatum[]): number {

        items.sort(function (a, b) {
            return a.x - b.x;
        });

        var quarter = Math.floor(items.length / 4);

        if (items.length % 4) {
            return items[quarter].x;
        }
        else {
            return (items[quarter - 1].x + items[quarter].x) / 2.0;
        }

        return 0;
    }

    export function upperQuartile(items: xDatum[]): number {

        items.sort(function (a, b) {
            return a.x - b.x;
        });

        var threeQuarter = Math.floor(items.length * 3 / 4);

        if (items.length % 4) {
            return items[threeQuarter].x;
        }
        else {
            return (items[threeQuarter - 1].x + items[threeQuarter].x) / 2.0;
        }

        return 0;
    }
}