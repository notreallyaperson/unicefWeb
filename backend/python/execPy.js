const spawn = require('child_process').spawn

function execPy(script, args) {
  return new Promise(function(resolve, reject) {
    const pythonProcess = spawn('python3',[script, JSON.stringify(args)]);
    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', data => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', data => {
      error += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
      if (error == '') {
        resolve(output.slice(0,-1))
      } else {
        reject(error)
      }
    })

  });
}

module.exports = execPy;
