const { app, BrowserWindow } = require('electron');
const kill = require('tree-kill');
const promise = require('minimal-request-promise');

//A function to open the window. It will invoke itself once every five seconds in a loop until it suceeds at connecting to the Vaadin url. 
const initialize = function (javaProcess, serverProcess) {

	console.log("INIT")

	//The url for the Vaadin server
	let url = 'http://localhost:8081'

	//Check for the Vaadin server once every five seconds until found
	promise.get(url).then(function (response) {

			//Open the window 
			window = new BrowserWindow({ title: "Vaadin OpenMP Demo" });
			window.loadURL(url)

			//On window close, kill the processes if either is still running
			window.on('closed', function () { window = null });
			window.on('close', function (e) {

				if (javaProcess || serverProcess) {
					e.preventDefault();

					if (javaProcess) {
						kill(javaProcess.pid, 'SIGTERM', function () {
							javaProcess = null;
							if (window) {
								window.close();
							}
						});
					}

					if (serverProcess) {
						kill(serverProcess.pid, 'SIGTERM', function () {
							serverProcess = null;
							if (window) {
								window.close();
							}
						});
					}
				}
			});
	}, function (response) {
		setTimeout(function () {
			initialize();
		}, 500);
	});
};

//Start all processes on app startup
app.on('ready', () => {

	//The UI Vaadin process  
	let javaProcess;

	//The computation backend process
	let serverProcess;

	//TODO cross compile linux
	//TODO cross compile mac
	//Start processes
	if (process.platform == 'win32') {
		serverProcess = require('child_process').spawn(app.getAppPath() + "\\server.exe");
		javaProcess = require('child_process').spawn('java', ['-jar', app.getAppPath() + '\\com.example.vaadin-1.0-SNAPSHOT.war']);
	}

	//Fail if either process failed
	if (!serverProcess) {
		console.error("Unable to start the c++ server.exe process.");
		app.quit();
		return;
	}

	if (!javaProcess) {
		console.error("Unable to start the java Vaadin process.");
		app.quit();
		return;
	}

	//Echo all process output to the console
	javaProcess.stdout.on('data', function (data) { console.log(data) });
	javaProcess.stderr.on('data', function (data) { console.log(data) });
	serverProcess.stdout.on('data', function (data) { console.log(data) });
	serverProcess.stderr.on('data', function (data) { console.log(data) });

	//Open the Electron Chrome window
	initialize(javaProcess, serverProcess);

});

//Quit when the window is closed
app.on('window-all-closed', () => { app.quit() });