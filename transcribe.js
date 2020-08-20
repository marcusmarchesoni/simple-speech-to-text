'use strict';

const SOURCE = {
    LOCAL: 'local',
    CLOUD: 'cloud'
};
const ENCODING = {
    MP3: 'mp3',
    WAVE: 'wave'
};
const SAMPLE_RATE = {
    DEFAULT: '48000'
};
const LANGUAGE = {
    BRAZILIAN_PORTUGUESE: 'pt-BR',
    USA_ENGLISH: 'en-US'
};
const ENABLE_PUNCTUATION = true;
const TRANSCRIPTIONS_FOLDER = './transcriptions/' ;

function printHeader(config, source) {
    console.log('Configuration');

    for (let param in config) {
        console.log(`  ${param}: ${config[param]}`)
    }
    console.log(`  source: ${source}`);
    console.log('');
}

function printTranscription(transcription) {
    console.log('');
    console.log('=============== TRANSCRIPTION START ===============');
    console.log('');
    console.log(transcription);
    console.log('');
    console.log('===============  TRANSCRIPTION END  ===============');
}

function logToFile(filename, transcription) {
    const fs = require('fs');
    const textFile = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt';
    fs.writeFile(TRANSCRIPTIONS_FOLDER + textFile, transcription, function (err) {
        if (err) return console.log('Error while creating file: '+ textFile - ': ' + err);
    });

    console.log('');
    console.log('Saved on file: ' + TRANSCRIPTIONS_FOLDER + textFile);
}

async function transcribe(
    fileName,
    encoding,
    sampleRateHertz,
    languageCode,
    sync = false,
    source = SOURCE.LOCAL
) {
    // [START speech_transcribe]
    const speech = require('@google-cloud/speech');
    const fs = require('fs');
    const client = new speech.SpeechClient();
    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        enableAutomaticPunctuation: ENABLE_PUNCTUATION
    };

    const audio = {};
    if (source === SOURCE.LOCAL) {
        audio.content = fs.readFileSync(fileName).toString('base64')
    } else {
        audio.uri = fileName
    }

    printHeader(config, source);

    const request = {
        config: config,
        audio: audio,
    };

    let response = [];
    if (sync) {
        [response] = await client.recognize(request);
    } else {
        const [operation] = await client.longRunningRecognize(request);
        [response] = await operation.promise();
    }

    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

    printTranscription(transcription);
    logToFile(fileName, transcription);
    // [END speech_transcribe]
}

require(`yargs`) // eslint-disable-line
    .demand(1)

    .command(
        'convert <fileName>',
        '',
        {},
        opts =>
            transcribe(
                opts.fileName,
                opts.encoding,
                opts.sampleRateHertz,
                opts.languageCode,
                opts.sync,
                opts.source
            )
    )

    .command(
        'mp3-local <fileName>',
        '',
        {},
        opts =>
            transcribe(
                opts.fileName,
                ENCODING.MP3,
                SAMPLE_RATE.DEFAULT,
                LANGUAGE.BRAZILIAN_PORTUGUESE,
                true
            )
    )

    .command(
        'wave-local <fileName>',
        '',
        {},
        opts =>
            transcribe(
                opts.fileName,
                ENCODING.WAVE,
                SAMPLE_RATE.DEFAULT,
                LANGUAGE.BRAZILIAN_PORTUGUESE,
                true
            )
    )

    .command(
        'mp3-cloud <cloudURI>',
        '',
        {},
        opts =>
            transcribe(
                opts.cloudURI,
                ENCODING.MP3,
                SAMPLE_RATE.DEFAULT,
                LANGUAGE.BRAZILIAN_PORTUGUESE,
                false,
                SOURCE.CLOUD
            )
    )

    .command(
        'wave-cloud <cloudURI>',
        '',
        {},
        opts =>
            transcribe(
                opts.cloudURI,
                ENCODING.WAVE,
                SAMPLE_RATE.DEFAULT,
                LANGUAGE.BRAZILIAN_PORTUGUESE,
                false,
                SOURCE.CLOUD
            )
    )

    .options({
        encoding: {
            alias: 'e',
            default: ENCODING.WAVE,
            global: true,
            requiresArg: false,
            type: 'string',
        },
        sampleRateHertz: {
            alias: 'r',
            default: SAMPLE_RATE.DEFAULT,
            global: true,
            requiresArg: false,
            type: 'number',
        },
        languageCode: {
            alias: 'l',
            default: LANGUAGE.BRAZILIAN_PORTUGUESE,
            global: true,
            requiresArg: false,
            type: 'string',
        },
        sync: {
            alias: 's',
            default: false,
            global: true,
            requiresArg: false,
            type: 'boolean',
        },
        source: {
            alias: 'f',
            default: SOURCE.LOCAL,
            global: true,
            requiresArg: false,
            type: 'string'
        },
    })
    .wrap(120)
    .epilogue('For more information, see https://cloud.google.com/speech/docs')
    .help()
    .strict().argv;
