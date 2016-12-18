declare namespace Plot {
    class BasePlot {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        draw: () => void;
        baseDraw: () => void;
        hover: (e) => void;
        baseHover: () => void;
        options: any;
        animateNum: number;
        constructor(id: string, options: Object, specificDefaults: any);
        animate(): void;
    }
}
declare namespace Plot {
    class Bar extends BasePlot implements Ianimateable {
        data: KVCDatum[];
        constructor(id: string, data: any, options: any);
    }
}
declare namespace Plot {
    class BoxAndWhisker extends BasePlot implements Ianimateable {
        data: xData[];
        constructor(id: string, data: any, options?: any);
    }
}
declare namespace Plot {
    class Curve {
        formula: (x) => number;
        colour: string;
        constructor(formula: (x) => number, colour?: string);
    }
}
declare namespace Plot {
    class KVCDatum {
        key: string;
        value: number;
        colour: string;
        constructor(key: string, value: number, colour?: string);
    }
}
declare namespace Plot {
    interface xDatum {
        x: number;
    }
    class xData {
        data: xDatum[];
        colour: string;
        constructor(values: xDatum[], colour: string);
    }
    function toXData(items: any): xData[];
}
declare namespace Plot {
    interface xyDatum {
        x: number;
        y: number;
    }
    class xyData {
        data: xyDatum[];
        colour: string;
        constructor(values: xyDatum[], colour: string);
    }
    function toXYData(items: any): xyData[];
}
declare module Plot {
    interface Ianimateable {
        animate: () => void;
    }
}
declare namespace Plot.Maths {
    function max(items: any[], value: (item: any) => number): number;
    function min(items: any[], value: (item: any) => number): number;
    function median(items: xDatum[]): number;
    function lowerQuartile(items: xDatum[]): number;
    function upperQuartile(items: xDatum[]): number;
    function getSplits(minNum: any, maxNum: any, splits: any): number[];
    function isEqualToAccurate(num1: number, num2: number): Boolean;
}
declare namespace Plot {
    class Pie extends BasePlot implements Ianimateable {
        data: KVCDatum[];
        constructor(id: string, data: any, options?: any);
    }
}
declare namespace Plot {
    class PlotManager {
        plots: BasePlot[];
        addPlot: (item: BasePlot) => void;
        constructor();
    }
    var plotManager: PlotManager;
}
declare namespace Plot {
    class Scatter extends BasePlot implements Ianimateable {
        data: xyData[];
        curves: Curve[];
        addCurve: (x: any, colour: string) => void;
        constructor(id: string, data: any, options: any);
    }
}
