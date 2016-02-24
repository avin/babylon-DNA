export default {
    /**
     * Convert hex color to BABYLON color format
     * @param hex
     * @returns {BABYLON.Color3.FromInts}
     */
    hexColorToBabylonColor3(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let color = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;

        if (color) {
            return new BABYLON.Color3.FromInts(color.r, color.g, color.b)
        } else {
            return new BABYLON.Color3(0.1, 0.1, 0.1)
        }
    },

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    },

    readSingleFile(e, cb) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            cb(contents);
        };
        reader.readAsText(file);
    }
};