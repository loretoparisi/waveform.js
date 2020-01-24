/**
 * Waveform.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2020 Loreto Parisi
*/

(function () {

    var Util = {

        /*
        * Recursively merge properties of two objects 
        * @todo: moved to Util
        */
        mergeRecursive: function (obj1, obj2) {
            for (var p in obj2) {
                try {
                    // Property in destination object set; update its value.
                    if (obj2[p].constructor == Object) {
                        obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);

                    } else {
                        obj1[p] = obj2[p];

                    }

                } catch (e) {
                    // Property in destination object not set; create it and set its value.
                    obj1[p] = obj2[p];

                }
            }
            return obj1;
        }//mergeRecursive

    }//Util

    module.exports = Util;

}).call(this);