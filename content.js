let OverlayUniqueObject = {
    draw: false,
    remove: false,
    loading: null,
    startPos: null,
    div: null,
    divs: [],
    newDivs: [],
    URL: null,
    position: null,
    mouseup(e) {
        if (!(e.pageX == OverlayUniqueObject.startPos.x && e.pageY == OverlayUniqueObject.startPos.y)) {
            let date = new Date();
            let id = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
            OverlayUniqueObject.div.id = id;
            document.children[0].style.cursor = '';
            OverlayUniqueObject.draw = false;
            OverlayUniqueObject.divs.push(OverlayUniqueObject.div);
            document.removeEventListener('mousemove', OverlayUniqueObject.mousemove);
            document.removeEventListener('mouseup', OverlayUniqueObject.mouseup);
            document.removeEventListener('contextmenu', OverlayUniqueObject.preventContextMenu);

            OverlayUniqueObject.div.addEventListener('click', OverlayUniqueObject.selfremove);
            let obj = {
                hostname: location.hostname,
                pathname: location.pathname,
                search: location.search,
                top: parseInt(OverlayUniqueObject.div.style.top.substr(0, OverlayUniqueObject.div.style.top.length - 2)),
                left: parseInt(OverlayUniqueObject.div.style.left.substr(0, OverlayUniqueObject.div.style.left.length - 2)),
                width: parseInt(OverlayUniqueObject.div.style.width.substr(0, OverlayUniqueObject.div.style.width.length - 2)),
                height: parseInt(OverlayUniqueObject.div.style.height.substr(0, OverlayUniqueObject.div.style.height.length - 2)),
                position: OverlayUniqueObject.position,
                id: id
            };
            let items = window.localStorage.getItem('Overlay UNIQUE KEY');
            if (items) {
                let storage = JSON.parse(items);
                storage.push(obj);
                window.localStorage.setItem('Overlay UNIQUE KEY', JSON.stringify(storage));
            } else {
                window.localStorage.setItem('Overlay UNIQUE KEY', JSON.stringify([obj]));
            }
        }
    },
    mousemove(e) {
        let size = (OverlayUniqueObject.position == 'absolute' ? e.pageX : e.clientX) - OverlayUniqueObject.startPos.x;
        e.preventDefault();
        if (size > 0) {
            OverlayUniqueObject.div.style.left = OverlayUniqueObject.startPos.x + 'px';
            OverlayUniqueObject.div.style.width = size + 'px';
        } else {
            OverlayUniqueObject.div.style.left = e.pageX + 'px';
            OverlayUniqueObject.div.style.width = Math.abs(size) + 'px';
        }
        size = (OverlayUniqueObject.position == 'absolute' ? e.pageY : e.clientY) - OverlayUniqueObject.startPos.y;
        if (size > 0) {
            OverlayUniqueObject.div.style.top = OverlayUniqueObject.startPos.y + 'px';
            OverlayUniqueObject.div.style.height = size + 'px';
        } else {
            OverlayUniqueObject.div.style.top = e.pageY + 'px';
            OverlayUniqueObject.div.style.height = Math.abs(size) + 'px';
        }
    },
    mousedown(e) {
        OverlayUniqueObject.startPos = {
            x: OverlayUniqueObject.position == 'absolute' ? e.pageX : e.clientX,
            y: OverlayUniqueObject.position == 'absolute' ? e.pageY : e.clientY
        };
        OverlayUniqueObject.div = document.createElement('div');
        OverlayUniqueObject.div.style.backgroundColor = '#eee';
        OverlayUniqueObject.div.style.position = OverlayUniqueObject.position;
        OverlayUniqueObject.div.style.zIndex = 1000000000;
        OverlayUniqueObject.div.style.top = OverlayUniqueObject.startPos.y + 'px';
        OverlayUniqueObject.div.style.left = OverlayUniqueObject.startPos.x + 'px';
        document.body.appendChild(OverlayUniqueObject.div);
        document.addEventListener('mousemove', OverlayUniqueObject.mousemove);
        document.addEventListener('mouseup', OverlayUniqueObject.mouseup);
        document.removeEventListener('mousedown', OverlayUniqueObject.mousedown, {
            capture: true
        });
    },
    makeURL(obj) {
        if (!(obj.hostname == undefined || obj.pathname == undefined && obj.search == undefined)) {
            return obj.hostname + obj.pathname + obj.search;
        } else {
            console.log('ERROR:');
            console.log('Unable to construct URL mission property.');
            console.log(obj);
        }
    },
    preventContextMenu(e) {
        e.preventDefault();
    },
    escapeCursor() {
        OverlayUniqueObject.draw = false;
        OverlayUniqueObject.remove = false;
        document.children[0].style.cursor = '';
        document.removeEventListener('mousedown', OverlayUniqueObject.mousedown, {
            capture: true
        });
        document.removeEventListener('mousemove', OverlayUniqueObject.mousemove);
        document.removeEventListener('mouseup', OverlayUniqueObject.mouseup);
        document.removeEventListener('contextmenu', OverlayUniqueObject.preventContextMenu);
    },
    selfremove(e) {
        // The clicked element removes it self.
        if (OverlayUniqueObject.remove) {
            let id = e.target.id;
            e.target.remove();
            let items = window.localStorage.getItem('Overlay UNIQUE KEY');
            if (items) {
                let storage = JSON.parse(items);
                for (let i = 0; i < storage.length; i++) {
                    if (id == storage[i].id) {
                        storage.splice(i, 1);
                        break;
                    }
                }
                window.localStorage.setItem('Overlay UNIQUE KEY', JSON.stringify(storage));
                for (let i = 0; i < OverlayUniqueObject.divs.length; i++) {
                    if (OverlayUniqueObject.divs[i].id == id) {
                        OverlayUniqueObject.divs.splice(i, 1);
                        break;
                    }
                }
                if (OverlayUniqueObject.divs.length == 0) {
                    OverlayUniqueObject.escapeCursor();
                }
            } else {
                console.log('ERROR:');
                console.log('Could not read the localstorage or it is empty.');
            }
        }
    },
    load(toNewDivs = false) {
        // Loads the divs from localstorage.
        let items = window.localStorage.getItem('Overlay UNIQUE KEY');
        if (items) {
            let arr = JSON.parse(items);
            for (let i = 0; i < arr.length; i++) {
                if (OverlayUniqueObject.makeURL(arr[i]) == OverlayUniqueObject.makeURL(window.location)) {
                    let div = document.createElement('div');
                    div.style.backgroundColor = '#eee';
                    div.style.position = arr[i].position ? arr[i].position : 'absolute';
                    div.style.zIndex = 1000000000;
                    div.style.top = arr[i].top + 'px';
                    div.style.left = arr[i].left + 'px';
                    div.style.width = arr[i].width + 'px';
                    div.style.height = arr[i].height + 'px';
                    div.id = arr[i].id;
                    div.addEventListener('click', OverlayUniqueObject.selfremove);
                    OverlayUniqueObject[toNewDivs ? 'newDivs' : 'divs'].push(div);
                    document.children[0].appendChild(div);
                }
            }
        }
    }
};
OverlayUniqueObject.URL = OverlayUniqueObject.makeURL(location);

document.addEventListener('keydown', e => {
    if (e.code == 'Escape') {
        OverlayUniqueObject.escapeCursor();
    }
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if ((request.data == 'fixed' || request.data == 'absolute') && !OverlayUniqueObject.draw) {
        OverlayUniqueObject.draw = true;
        OverlayUniqueObject.position = request.data;
        document.children[0].style.cursor = 'crosshair';
        document.addEventListener('mousedown', OverlayUniqueObject.mousedown, {
            capture: true
        });
        document.addEventListener('contextmenu', OverlayUniqueObject.preventContextMenu);
    } else if (request.data == 'remove') {
        OverlayUniqueObject.remove = true;
        document.children[0].style.cursor = 'not-allowed';
    } else if (request.data == 'complete') {
        if (OverlayUniqueObject.loading == null) {
            OverlayUniqueObject.loading = false;
        } else if (!OverlayUniqueObject.loading) {
            let currURL = OverlayUniqueObject.makeURL(location);
            if (OverlayUniqueObject.URL != currURL) {
                OverlayUniqueObject.loading = true;
                OverlayUniqueObject.URL = currURL;
                OverlayUniqueObject.escapeCursor();
                OverlayUniqueObject.load(true);
            }
        } else {
            OverlayUniqueObject.loading = false;
            for (let i = 0; i < OverlayUniqueObject.divs.length; i++) {
                OverlayUniqueObject.divs[i].remove();
            }
            OverlayUniqueObject.divs = OverlayUniqueObject.newDivs;
            OverlayUniqueObject.newDivs = [];
        }
    }
});

OverlayUniqueObject.load();