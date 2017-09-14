Demo chute to use airshark API
===================================================
This simple chute demonstrate how to use Airshark API of ParaDrop


Build the backend
---------------------
On host
```
docker build -f development/Dockerfile -t paradrop/airshark-demo .
docker run -t -i -p 8080:80 -v $PWD:/opt/paradrop paradrop/airshark-demo /bin/bash
```

In the container, install the pip and test it.
```
cd /opt/paradrop/development
pip install --editable .
```

Build the frontend (dashboard)
------------------------------------
On host
```
cd development/dashboard
yarn
gulp build
```

Deploy the chute
--------------------
On host
```
./install.sh
cd deployment
pdtools device --address=<router_ip> chutes install
```
