const http = require('http');
const { exec } = require('child_process');

const formatEnv = (envs = {}) => {
  return Object.keys(envs).map(key => `--env ${key}=${envs[key]} `).join(' ');
}

const stopContainer = (taskDescription = {}, done) => {
  const { name } = taskDescription;
  exec(`docker stop ${name} && docker rm ${name}`, (err) => {
    if (err) {
      console.error(err);
    }

    done();
  });
};

const deploy = (taskDescription) => {
  stopContainer(taskDescription, () => {
    const { name, image, envs } = taskDescription;

    const formatedEnv = formatEnv(envs);

    console.log('formatedEnv', formatedEnv);

    console.log('--- command ---', `docker run --name ${name} ${formatedEnv} --expose 1337 ${image}`);

    exec(`docker run --name ${name} ${formatedEnv} -d --expose 1337 ${image}`, (err) => {
      if (err) {
        return console.error(err);
      }
    })
  });
}

const server = http.createServer((request, response) => {
  if (request.method !== 'POST') {
    response.statusCode = 500;
    return response.end();
  }

  let body = [];

  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    let values = null;

    try {
      console.log('--- body ---', body);
      values = JSON.parse(body);
      deploy(values);
    } catch (e) {
      console.error(e);
    }

    response.statusCode = 201;
    response.end();
  });
});

server.listen(3000);
