/**
 * Waveform.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2020 Loreto Parisi
*/
(function () {

    var start;
    var elapsed_time = function (note) {
        var precision = 3; // 3 decimal places
        var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
        console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    }

    const Waveform = require('../lib/index');

    start = process.hrtime();
    var wv = new Waveform({});
    // generate png from waveform
    wv.png({
        pixelsPerSecond: 7,
        bits: 8,
        width: 1800,
        height: 140,
        backgroundColor: 'FFFFFF00',
        waveformColor: 'FF0000',
        axisLabels: 1
    },
        'sample.wav',
        'sample.png')
        .then(_ => {
            elapsed_time('ended');
        })
        .catch(error => {
            console.error(error.stack);
        });

}).call(this);