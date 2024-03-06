# backend for the blog-app

You can launch the app in a docker container by running

`docker compose up`

After composing, it is possible that the app crashes because it tries to connect to the pg database while the database is still ramping up. If that happens, simply manually stop the blog-app container from running and re-start it after the blog-database is up and running.

To run the tests in the container, run

`docker exec -it <container-id> npm run test`
