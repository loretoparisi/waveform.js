/**
 * Waveform.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2020 Loreto Parisi
*/

"use strict";

(function () {

    var cp = require('child_process');
    var path = require('path');
    var fs = require('fs');

    var Waveform;
    var Util = require('./util');

    Waveform = (function () {

        /**
         * Audio Waveform
         */
        function Waveform(options) {

            this._options = {
                debug: false,
                bin: '',
                child: {
                    detached: false
                }
            };

            /**
             * Get binary file path
             */
            this.GetBinFolder = function (filename) {
                var cdir = process.cwd();
                var pathComponents = __dirname.split('/');
                var root = pathComponents.slice(0, pathComponents.length).join('/');
                process.chdir(root);
                var binpath = path.resolve('./bin/' + process.platform + '/' + filename);
                process.chdir(cdir);
                if (fs.existsSync(binpath)) { // check local binary path
                    return binpath;
                }
                return null;
            }

            this._options.bin = this.GetBinFolder('audiowaveform');

            Util.mergeRecursive(this._options, options);

        } //Waveform

        /**
         * @param {Object} options
         * bits - Number of bits resolution when creating a waveform data file (either 8 or 16), default: 16
         * -s <seconds>	--start <seconds>	Start time (seconds), default: 0
         * -e <seconds>	--end <seconds>	End time (seconds). Not valid if --zoom is also specified
        */
        Waveform.prototype.waveform = function (params, inputPath, outputPath) {
            var self = this;
            var options = {
                pixelsPerSecond: 100,
                bits: 8,
                start: 0,
                end: 0
            };
            for(var attr in params) { options[attr] = params[attr]; }
            return new Promise((resolve, reject) => {
                //audiowaveform -i /root/audio/B07SFH3987.mp3 -o /root/B07SFH3987.json  --pixels-per-second 50 -b 8
                const args = [
                    '-i', inputPath,
                    '-o', outputPath,
                    '-b', options.bits
                ];
                if( options.start ) {
                    args.push('--start', options.start);
                }
                if( options.end ) {
                    args.push('--end', options.end);
                } else { //  Not valid if --end or --zoom is also specified
                    args.push('--pixels-per-second', options.pixelsPerSecond);
                }

                const opts = {
                    //stdio: 'ignore'
                    maxBuffer: 1024 * 1000
                };
                if(self._options.debug) console.log( args.join(" "))
                cp.spawn(self._options.bin, args, opts)
                    .on('error', reject)
                    .on('close', () => {
                        const cb = (error, stdout) => {
                            if (error)
                                return reject(error);
                            try {
                                const outputObj = JSON.parse(stdout);
                                return resolve(outputObj);
                            } catch (ex) {
                                return reject(ex);
                            }
                        };
                        cp.execFile('cat', [outputPath], opts, cb)
                            .on('error', reject);
                    });
            });
        }//waveform

        /**
         * @param {Object} options
         * pixelsPerSecond - Zoom level (pixels per second), default: 100. Not valid if --end or --zoom is also specified
         * bits - Number of bits resolution when creating a waveform data file (either 8 or 16), default: 16
         * width - Width of output image (pixels), default: 800
         * height - Height of output image (pixels), default: 250
         * --border-color <color>	Border color (in rrggbb[aa] hex format), default: set by --colors option
         * --background-color <color>	Background color (in rrggbb[aa] hex format), default: set by --colors option
         * --waveform-color <color>	Waveform color (in rrggbb[aa] hex format), default: set by --colors option
         * --no-axis-labels	Render PNG images without axis labels
         * --with-axis-labels	Render PNG images with axis labels (default)
         * --waveform-color <color>	Waveform color (in rrggbb[aa] hex format), default: set by --colors option
         * -s <seconds>	--start <seconds>	Start time (seconds), default: 0
         * -e <seconds>	--end <seconds>	End time (seconds). Not valid if --zoom is also specified
         */
        Waveform.prototype.png = function (params, inputPath, outputPath) {
            var self = this;
            var options = {
                pixelsPerSecond: 50,
                bits: 8,
                width: 1800,
                height: 140,
                backgroundColor: 'FFFFFF00',
                waveformColor: 'DDDDDD',
                axisLabels: true,
                start: 0,
                end: 0
            };
            for(var attr in params) { options[attr] = params[attr]; }
            return new Promise((resolve, reject) => {
                //audiowaveform -i /root/audio/B07SFH3987.mp3 -o /root/B07SFH3987.json  --pixels-per-second 50 -b 8
                const args = [
                    '-i', inputPath,
                    '-o', outputPath,
                    '-w', options.width,
                    '-h', options.height,
                    '-b', options.bits,
                    '--waveform-color', options.waveformColor,
                    '--background-color', options.backgroundColor
                ];
                if( !options.axisLabels ) { // render axis by default
                    args.push('--no-axis-labels');
                }
                if( options.start ) {
                    args.push('--start', options.start);
                }
                if( options.end ) {
                    args.push('--end', options.end);
                } else { //  Not valid if --end or --zoom is also specified
                    args.push('--pixels-per-second', options.pixelsPerSecond);
                }

                const opts = {
                    //stdio: 'ignore'
                    maxBuffer: 1024 * 1000
                };
                if(self._options.debug) console.log( args.join(" "))
                cp.spawn(self._options.bin, args, opts)
                    .on('error', reject)
                    .on('close', () => {
                        return resolve(true);
                    });
            });
        }//png

        return Waveform;

    })();

    module.exports = Waveform;

}).call(this);