﻿$(function () {
    var data = [{
        label: "Risco 1"
        , data: 10
        , color: "#4f5467"
    , }, {
        label: "Risco 2"
        , data: 1
        , color: "#26c6da"
    , }, {
        label: "Risco 3"
        , data: 3
        , color: "#009efb"
    , }, {
        label: "Risco 4"
        , data: 1
        , color: "#7460ee"
    , }];
    var plotObj = $.plot($("#flot-pie-chart"), data, {
        series: {
            pie: {
                innerRadius: 0.5
                , show: true
            }
        }
        , grid: {
            hoverable: true
        }
        , color: null
        , tooltip: true
        , tooltipOpts: {
            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20
                , y: 0
            }
            , defaultTheme: false
        }
    });
});