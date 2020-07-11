## Features:
- [x] Render each setlist out separately, displaying relevant concert date information (date, tour name, supporting artists, sold out, # of songs, etc.) _Note: not all of this data was available_
  - [x] Add button to each setlist letting user confirm songs and create a playlist
- [x] Allow user to double check results of Spotify Song Search, showing all options letting the user pick and choose how to handle duplicate matches
  - [ ] Some songs cannot be found, create modal to browse selected artist's Spotify discography to find the song
- [x] New favicon (can do better)
- [x] Create view component to hold Spotify widget atfer playlist is made
  - [ ] Add loading overlay
- [ ] Improve band/venue searching
  - [ ] might have to abandon libraries and make calls "manually"
- [ ] Improve song searching
  - [ ] Properly encode song/artist names
  - [ ] Filter out obvious false positives (artist name in song data doesn't match)
  - [x] Create warning on songs with collisions (do this in new component [[vue-slideout-panel](https://github.com/officert/vue-slideout-panel)])
    - [x] Warning can be clicks and show scrollable div with song/album name and album artwork
      - [x] Each song match in list will have radio to select
- [x] Create spotify login (http://jsfiddle.net/JMPerez/62wafrm7/)

## Bugs:
- [x] Stop unexpected search for artist/venue after user has chosen from dropdown
- [ ] Fix issue where page refresh triggers another Spotify login
- [x] Fix display of setlists pre Spotify search
