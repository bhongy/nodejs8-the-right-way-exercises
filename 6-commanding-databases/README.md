Use Docker for easy setup of elasticsearch (no need to worry about JVM, etc).
My current docker version: `18.06.0-ce`

All commands must be run in this folder.

Start up

```sh
docker-compose up
```

Shut down

```sh
docker-compose down
```

The data is in the folder of the previous chapter so the path is `../5-transform-data/data`.

```sh
./esclu bulk ../5-transform-data/data/bulk_pg.ldj -i books -t book > bulk-result.json
```

```sh
./esclu create-index -i books
./esclu get
# remember, `fullUrl` builds pathname automatically with index and type
./esclu li
./esclu li -j | jq '.' 
./esclu q authors:Shakespeare AND subjects:Drama -f title,authors | jq '.hits.hits[]._source.title'
./esclu get pg132 -i books -t book | jq '._source' > art_of_war.json
cat art_of_war.json | ./esclu put pg132 -i books -t book
```