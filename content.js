let active = false;
let divs = [];
chrome.runtime.onMessage.addListener((request, sender, response) => {
    console.log(sender);
    if (request.data == 'activate' && !active) {
        let startpos;
        let div;
        document.body.style.cursor = 'crosshair';
        document.addEventListener('mousedown', mousedown);

        active = true;

        function mouseup(e) {
            console.log('MOUSEUP');
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            active = false;
            document.body.style.cursor = '';
            chrome.runtime.sendMessage(sender.id, {
                data: 'newdiv',
                obj: {
                    website: location.hostname + location.pathname,
                    top: parseInt(div.style.top.substr(0, div.style.top.length - 2)),
                    left: parseInt(div.style.left.substr(0, div.style.left.length - 2)),
                    width: parseInt(div.style.width.substr(0, div.style.width.length - 2)),
                    height: parseInt(div.style.height.substr(0, div.style.height.length - 2))
                }
            });
        }

        function mousemove(e) {
            let size = e.pageX - startpos.x;
            e.preventDefault();
            if (size > 0) {
                div.style.left = startpos.x + 'px';
                div.style.width = size + 'px';
            } else {
                div.style.left = e.pageX + 'px';
                div.style.width = Math.abs(size) + 'px';
            }
            size = e.pageY - startpos.y;
            if (size > 0) {
                div.style.top = startpos.y + 'px';
                div.style.height = size + 'px';
            } else {
                div.style.top = e.pageY + 'px';
                div.style.height = Math.abs(size) + 'px';
            }
        }

        function mousedown(e) {
            console.log('MOUSEDOWN');
            startpos = {
                x: e.pageX,
                y: e.pageY
            };
            div = document.createElement('div');
            div.style.backgroundColor = '#eee';
            div.style.position = 'absolute';
            div.style.zIndex = 1000000000;
            div.style.top = startpos.y + 'px';
            div.style.left = startpos.x + 'px';
            document.body.appendChild(div);
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
            document.removeEventListener('mousedown', mousedown);
        }
    } else if (request.data == 'showdiv') {
        let div = document.createElement('div');
        div.style.backgroundColor = '#eee';
        div.style.position = 'absolute';
        div.style.zIndex = 1000000000;
        div.style.top = request.obj.top + 'px';
        div.style.left = request.obj.left + 'px';
        div.style.width = request.obj.width + 'px';
        div.style.height = request.obj.height + 'px';
        divs.push(div);
        document.body.appendChild(div);
    }
});