const spawn = require('child_process').spawn

function execPy(script, args) {
  return new Promise(function(resolve, reject) {
    const pythonProcess = spawn('python3',[script, JSON.stringify(args)]);

    pythonProcess.stdout.on('data', data => {
      resolve(data.toString());
    })

    pythonProcess.stderr.on('data', data => {
      reject({ PythonError: data.toString()});
    });
  });
}

module.exports = execPy;
