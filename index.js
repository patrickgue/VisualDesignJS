const {app, BrowserWindow, Menu, MenuItem} = require('electron')
const openAboutWindow = require('about-window').default;
const join = require('path').join;

let win
let template = [
        {
            label: 'File', submenu: [
                { role: 'quit' },
                {
                    label: 'About This App',
                    click: () =>
                        openAboutWindow({
                            icon_path:  join(__dirname, 'assets/icon.png'),
                            //license: 'Copyright (c) 2019 Patrick Günthard',
                            package_json_dir: __dirname,
                            //license: "Licensed under the BSD 2-Clause-License",
                            win_options: {
                                parent: win,
                                modal: false,
                            }

                        }),
                }
            ],
        },
        {
            label: 'Edit', submenu: [
                { role: 'undo' },
                /*{ role: 'redo' },
                { role: 'separator' },*/
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                /*{ role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' },*/
            ],
        },
        {
            label: 'Help', submenu: [
                { role: 'reload' },
                { role: 'toggleFullScreen' },
                { role: 'toggleDevTools' },
            ],
        },
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));



function createWindow() {
    let windowSettings = {
        width: 960,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        },
        icon: join(__dirname, 'assets/icons/png/64x64.png')
    };

    if(process.platform === "darwin") {
        windowSettings.frame =  false;
    }

    win = new BrowserWindow(windowSettings);


    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    win.loadFile('html/index.html')

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
