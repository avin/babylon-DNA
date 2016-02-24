import Renderer from './Models/Renderer';

window.app = {};
var app = window.app;

// Init
app.renderer = new Renderer();

app.renderer.initialize(document.getElementById("canvas"), () => {
    app.renderer.loadScene(() => {
        app.renderer.run();
    });
});