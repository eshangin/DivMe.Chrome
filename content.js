let OverlayUniqueObject = {
    draw: false,
    remove: false,
    startpos: null,
    div: null,
    mouseup(e) {
        document.removeEventListener('mousemove', OverlayUniqueObject.mousemove);
        document.removeEventListener('mouseup', OverlayUniqueObject.mouseup);
        let date = new Date();
        let id = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        this.div.id = id;
        OverlayUniqueObject.draw = false;
        document.children[0].style.cursor = '';
        this.div.addEventListener('click', e => {
            if (OverlayUniqueObject.remove) {
                document.getElementById(id).remove();
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
                } else {
                    console.log('ERROR:');
                    console.log('Could not read the localstorage or it is empty.');
                }
            }
        });
        let obj = {
            hostname: location.hostname,
            pathname: location.pathname,
            search: location.search,
            top: parseInt(this.div.style.top.substr(0, this.div.style.top.length - 2)),
            left: parseInt(this.div.style.left.substr(0, this.div.style.left.length - 2)),
            width: parseInt(this.div.style.width.substr(0, this.div.style.width.length - 2)),
            height: parseInt(this.div.style.height.substr(0, this.div.style.height.length - 2)),
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
    },
    mousemove(e) {
        let size = e.pageX - startpos.x;
        e.preventDefault();
        if (size > 0) {
            this.div.style.left = startpos.x + 'px';
            this.div.style.width = size + 'px';
        } else {
            this.div.style.left = e.pageX + 'px';
            this.div.style.width = Math.abs(size) + 'px';
        }
        size = e.pageY - startpos.y;
        if (size > 0) {
            this.div.style.top = startpos.y + 'px';
            this.div.style.height = size + 'px';
        } else {
            this.div.style.top = e.pageY + 'px';
            this.div.style.height = Math.abs(size) + 'px';
        }
    },
    mousedown(e) {
        startpos = {
            x: e.pageX,
            y: e.pageY
        };
        this.div = document.createElement('div');
        this.div.style.backgroundColor = '#eee';
        this.div.style.position = 'absolute';
        this.div.style.zIndex = 1000000000;
        this.div.style.top = startpos.y + 'px';
        this.div.style.left = startpos.x + 'px';
        this.div.onclick = 'remove(this)';
        document.body.appendChild(this.div);
        document.addEventListener('mousemove', OverlayUniqueObject.mousemove);
        document.addEventListener('mouseup', OverlayUniqueObject.mouseup);
        document.removeEventListener('mousedown', OverlayUniqueObject.mousedown);
    },
    makeURL(obj) {
        if (!(obj.hostname == undefined || obj.pathname == undefined && obj.search == undefined)) {
            return obj.hostname + obj.pathname + obj.search;
        } else {
            console.log('ERROR:');
            console.log('Unable to construct URL mission property.');
            console.log(obj);
        }
    }
}

document.addEventListener('keydown', e => {
    document.body.focus();
    if (e.code == 'Escape') {
        OverlayUniqueObject.draw = false;
        OverlayUniqueObject.remove = false;
        document.children[0].style.cursor = '';
        document.removeEventListener('mousedown', OverlayUniqueObject.mousedown);
        document.removeEventListener('mousemove', OverlayUniqueObject.mousemove);
        document.removeEventListener('mouseup', OverlayUniqueObject.mouseup);
    }
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.data == 'draw' && !OverlayUniqueObject.draw) {
        document.children[0].style.cursor = 'crosshair';
        document.addEventListener('mousedown', OverlayUniqueObject.mousedown);
        OverlayUniqueObject.draw = true;
    } else if (request.data == 'remove') {
        OverlayUniqueObject.remove = true;
        document.children[0].style.cursor = 'not-allowed';
    }
});

let items = window.localStorage.getItem('Overlay UNIQUE KEY');
if (items) {
    let arr = JSON.parse(items);
    for (let i = 0; i < arr.length; i++) {
        if (OverlayUniqueObject.makeURL(arr[i]) == OverlayUniqueObject.makeURL(window.location)) {
            let div = document.createElement('div');
            div.style.backgroundColor = '#eee';
            div.style.position = 'absolute';
            div.style.zIndex = 1000000000;
            div.style.top = arr[i].top + 'px';
            div.style.left = arr[i].left + 'px';
            div.style.width = arr[i].width + 'px';
            div.style.height = arr[i].height + 'px';
            div.id = arr[i].id;
            div.addEventListener('click', e => {
                if (OverlayUniqueObject.remove) {
                    let id = arr[i].id;
                    document.getElementById(arr[i].id).remove();
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
                    } else {
                        console.log('ERROR:');
                        console.log('Could not read the localstorage or it is empty.');
                    }
                }
            });
            document.children[0].appendChild(div);
        }
    }
}