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
    // generate json waveform
    wv.waveform({
        bits: 8
    },
        'sample.wav',
        'sample.json')
        .then(_ => {
            elapsed_time('ended');
        })
        .catch(error => {
            console.error(error.stack);
        });

}).call(this);