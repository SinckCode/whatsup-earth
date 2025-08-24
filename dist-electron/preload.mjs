"use strict";
const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("whatsup", {
  // expón funciones/flags si los necesitas (p.ej. versions/builder info)
});
