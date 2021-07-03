//Rutas y elementos a utilizar para almacenamiento en Cache
const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js"
]

//Nombre del cache
const CACHE_NAME = "v1_cache_contador_react"

//Inicialización del Cache
self.addEventListener("install",(e)=>{
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache=>{
            cache
                .addAll(CACHE_ELEMENTS)
                .then(()=>{
                    self.skipWaiting()
                })
                .catch(console.log)
        })
    )
})

//Activar cache y peticiones se toman de ahí
self.addEventListener("activate",(e)=>{
    const cacheWhiteList = [CACHE_NAME];
    e.waitUntil(
        caches.keys().then(cachesNames=>{
            return Promise.all(
                cachesNames.map(cacheName =>{
                    return cacheWhiteList.indexOf(cacheName)===-1 && caches.delete(cacheName)
            }));
        }).then(() => self.clients.claim())
    )
})

self.addEventListener("fetch",(e)=>{
    e.respondWith(
        caches.match(e.request).then((res)=>{
            if(res){
                return res;
            }
            return fetch(e.request);
        })
    )
})