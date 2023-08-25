#!/usr/bin/env node
require('dotenv').config();

const { BlobServiceClient } = require("@azure/storage-blob");

const storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnectionString);

async function main() {
// Create a container (folder) if it does not exist
const containerName = 'photos';
const containerClient = blobServiceClient.getContainerClient(containerName);
const containerExists = await containerClient.exists()
if ( !containerExists) {
    const createContainerResponse = await containerClient.createIfNotExists();
    console.log(`Create container ${containerName} successfully`, createContainerResponse.succeeded);
}
else {
    console.log(`Container ${containerName} already exists`);
}

// Upload the file
const filename = 'docs-and-friends-selfie-stick.png';
const blockBlobClient = containerClient.getBlockBlobClient(filename);
blockBlobClient.uploadFile(filename);

// Get a list of all the blobs in the container
let blobs = containerClient.listBlobsFlat();
let blob = await blobs.next();
while (!blob.done) {
    console.log(`${blob.value.name} --> Created: ${blob.value.properties.createdOn}   Size: ${blob.value.properties.contentLength}`);
    blob = await blobs.next();
}
}
main();
