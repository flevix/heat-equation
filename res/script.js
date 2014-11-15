/**
 * Created by mihail.nechaev on 23/10/14.
 */

var x = [];

function fun1(i){return i < number / 5 ? 1. : 0.}
function fun2(i){return i == number / 2 ? 100. : 0.}
function fun3(i){return Math.random()}

var fun = funcId == 1 ? fun1 : funcId == 2 ? fun2 : fun3;
var y = init(fun);

var scheme1 = new ExplicitUpstreamScheme(velocity, kappa, dx, dt, y);
var scheme2 = new ExplicitDownstreamScheme(velocity, kappa, dx, dt, y);
var scheme3 = new ImplicitDownstreamScheme(velocity, kappa, dx, dt, y);
var scheme4 = new ImplicitUpstreamScheme(velocity, kappa, dx, dt, y);
var scheme5 = new StaggeredGridScheme(velocity, kappa, dx, dt, y, (new ExplicitUpstreamScheme(velocity, kappa, dx, dt, y)).nextTimeLayer());

function init(fun) {
    var f = [];
    for (var i = 0; i < number; i++) {
        x[i] = dx * i;
        f[i] = fun(i);
    }
    return f;
}

function next(scheme) {
    var f = scheme.nextTimeLayer();
    return {
        x : x,
        y : f
    };
}
var update = function (chart, dps, data) {
    for (var i = 0; i < data.x.length; i++) {
        dps[i] = {x:data.x[i],y:data.y[i]};
    }
    chart.render();
};

var dps1 = [];
var chart1 = new CanvasJS.Chart("chartContainer1",{
    title : { text: "Явная против потока" },
    data: [{ type: "line", dataPoints: dps1 }]
});

var dps2 = [];
var chart2 = new CanvasJS.Chart("chartContainer2",{
    title : { text: "Явная по потоку" },
    data: [{ type: "line", dataPoints: dps2 }]
});

var dps3 = [];
var chart3 = new CanvasJS.Chart("chartContainer3",{
    title : { text: "Неявная по потоку" },
    data: [{ type: "line", dataPoints: dps3 }]
});

var dps4 = [];
var chart4 = new CanvasJS.Chart("chartContainer4",{
    title : { text: "Неявная против потоку" },
    data: [{ type: "line", dataPoints: dps4 }]
});

var dps5 = [];
var chart5 = new CanvasJS.Chart("chartContainer5",{
    title : { text: "Чехарда" },
    data: [{ type: "line", dataPoints: dps5 }]
});

function updateAll() {
    update(chart1, dps1, next(scheme1));
    update(chart2, dps2, next(scheme2));
    update(chart3, dps3, next(scheme3));
    update(chart4, dps4, next(scheme4));
    update(chart5, dps5, next(scheme5));
}


