# [Simple Speech to Text](https://github.com/marcusmarchesoni/simple-speech-to-text)

A simple command line application running on Node.js that can be used to convert speech from audio files to text files.  
Uses Google [Speech-to-Text API](https://cloud.google.com/speech-to-text).  
Based on [nodejs-speech](https://github.com/googleapis/nodejs-speech).

## Table of Contents

* [Setup](#setup)
* [Google configuration](#google-configuration)
* [Usage](#usage)
  * [Generic command](#generic-command)
  * [Local Wave file](#local-wave-file)
  * [Local MP3 file](#local-mp3-file)
  * [Cloud Wave file](#cloud-wave-file)
  * [Cloud MP3 file](#cloud-mp3-file)

## Setup

### Install dependencies
Download it from [Node.js](https://nodejs.org/en/download/) and install.  
If you are a regular Windows user [this version](https://nodejs.org/dist/v12.18.3/node-v12.18.3-x64.msi) should work just fine.

### Install local application
`cd simplest-speech-to-text`  
`npm install`


## Google Configuration
You can play with local files to test the API, but it won't allow you to use audios longer than 1 minute.  
Instead you will have to upload and reference files from Google Cloud Storage.

__Required to use Speech-to-Text API__
1. Speech-to-Text is a paid Google API, so sign up to [Google Cloud](https://console.cloud.google.com/freetrial) free trial ([Help](https://cloud.google.com/speech-to-text))
2. Create a [project](https://console.cloud.google.com/cloud-resource-manager) ([Help](https://cloud.google.com/resource-manager/docs/creating-managing-projects))
3. Create a [Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) ([Help](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances))
4. Create a [service account key](https://console.cloud.google.com/iam-admin/serviceaccounts) ([Help](https://cloud.google.com/iam/docs/creating-managing-service-account-keys))
5. Set an [environment variable](https://en.wikipedia.org/wiki/Environment_variable) for the key ([Help](https://cloud.google.com/docs/authentication/getting-started#windows))

__Required for long audios (>1 minute)__
1. Configure Google Cloud Storage [permissions](https://console.cloud.google.com/storage/browser) ([Help](https://cloud.google.com/storage/docs/access-control/using-iam-permissions))
   1. Member should be something like? member-name@project-id.iam.gserviceaccount.com 
2. Create an [storage bucket](https://console.cloud.google.com/storage/browser) ([Help](https://cloud.google.com/storage/docs/creating-buckets))
3. Upload files to the bucket ([Help](https://cloud.google.com/storage/docs/uploading-objects))

## Usage

### Generic command
__Usage__

`node transcribe convert audio\example.wav -e wave -r 48000 -l en-US -f local`

`node transcribe convert audio\example.mp3 -e mp3 -r 44100 -l pt-BR -f local`

`node transcribe convert gs://your-service-account/example.wav -e wave -r 48000 -l en-US -f cloud`

`node transcribe convert gs://your-service-account/example.mp33 -e mp3 -r 44100 -l pt-BR -f cloud`


### Local Wave file
__Usage__

`node transcribe wave-local audio\example.wav`

### Local MP3 file
__Usage__

`node transcribe mp3-local audio\example.mp3`

### Cloud Wave file
__Usage__

`node transcribe wave-cloud gs://your-service-account/example.wav`

### Cloud MP3 file
__Usage__

`node transcribe mp3-cloud gs://your-service-account/example.mp3`
