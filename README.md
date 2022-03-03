 This project should at the end be able to take a local user audio file, analyze it and visualise the audio while playing.
 For this to work I need figure out how to:
 - dynamically create a filesystem link to the audio file
 - analyze the audio file (api?)
 - make the audio play simultaneously with the visualization ? realtime ? time the playback?
    - functionality for recognizing the amount of ms elapsed at current location of audio file.
    - This can be acheived with audioObject.currentTime, this returns current position in seconds
 - learn to use canvas api
 - 

Stretch:
- make the visualization use something different than bars, ? renadom drawing of flowers?
-   Size of flowers based on audio DB
    - cna this be done with canvas?
-   stems created from mid range, leaves from treble and flowers from bass?