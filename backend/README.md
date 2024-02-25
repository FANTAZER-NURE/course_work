## Backend

1. Build the image `docker compose build`
2. Run it `docker compose up -d backend` and check if its running `docker ps -a`
3. Init prisma `docker exec -it backend npx prisma migrate dev --name init`
4. Run prisma `npx prisma studio` or check from the container `docker exec -it db psql -U postgres` => `\dt`

# After schema changes

1. `prisma migrate dev`
