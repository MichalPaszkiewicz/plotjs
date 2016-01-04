# plotjs

A light, responsive graph drawing and plotting plugin


http://www.michalpaszkiewicz.co.uk/plotjs/

Allows creation of pie, bar, scatter and line charts.


#how to use

first, add the following script to the top of your html page:

```html
<script src="http://www.michalpaszkiewicz.co.uk/plotjs/plotjs.js"></script>
```

Then add your par chart js code from one of the following samples:

pie chart
-------------
```js
    var data = {
        bob: 3,
        jane: 5,
        x: 4,
        "Some random value": 32,
        y: 81
    }
    var options = {};
    var pie = new Plot.Pie("my-pie", data, options);
```

bar chart
-------------
```js
var data = {
    bob: 3,
    jane: 5,
    x: 4,
    "lots of yellow frogs with jumpers": 32,
    y: 81
}
var options = {};
//pie chart
var pie = new Plot.Pie("my-pie", data, options);
//bar chart
var bar = new Plot.Bar("my-bar", data, options);
bar.data = pie.data;
bar.draw(bar);
```

scatter plot
----------------
```js
var xyData = { values: [], colour: "red" };
for (var i = -200; i < 200; i++) {
    xyData.values.push({ x: i, y: 4 * Math.sin(i / 20) - 2 *  Math.cos( i / 10)});
}
var scatter = new Plot.Scatter("my-scatter", xyData, options);
scatter.addCurve(function (i) { return 2 * Math.sin(i / 20) - Math.cos(i / 8) }, "orange");
```

box and whisker diagram
----------------------------
```js
var xData = [{ values: [], colour: "red" }, { values: [], colour: "blue" }, { values: [], colour: "green" }];
for (var i = 0; i < 20; i++) {
    xData[0].values.push({ x: i * 2 + 5 });
    xData[1].values.push({ x: i / 2 + 12 });
    xData[2].values.push({ x: i * i / 20 + 10 });
}
var boxAndWhisker = new Plot.BoxAndWhisker("my-box-and-whisker", xData, options);
```
