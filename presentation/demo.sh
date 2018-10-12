#!/bin/bash
# mv testing file with console.logs for live hive demo
# only needed for presentation and can be removed after

[[ $1 == "start-demo" ]] && cp arm-route-demo-version.test ../src/routes/arm-route.js &&
exit 0

[[ $1 == "end-demo" ]] && git checkout -- ../src/routes/arm-route.js &&
exit 0

# else
echo -e "\nPass either start-demo or end-demo ...\n"

