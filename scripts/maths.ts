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

}