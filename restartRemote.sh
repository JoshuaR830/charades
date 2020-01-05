echo "Pulling changes"
git pull
echo "Stopping charades container"
docker stop charades
echo "Remove charades container"
docker rm charades
echo "Build the new charades docker image"
docker build -t root/charades-image .
echo "Running the new charades container"
docker run --name charades --restart always -p 38119:8001 -d root/charades-image
echo ""

echo "Complete"
echo ""