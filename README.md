# Mario Kart World Map

This is the a full web map with P-Switches, Peach Medallions, ? Panels, 
and Course & Character start positions.

You can view the current public version of the map here:
[https://mkw.techtangents.net/](https://mkw.techtangents.net/)

*Note that this project was not originally anticipated to recieve a full public release and the code isn't exactly elegent.*

## Codebase

The three main files of concern are:

 - **/index.html** : The main HTML markup for the website.
 - **/web/script.js** : The majority of the functionality of the site
 - **/web/style.css** : The styling for all web elements
 - **/web/data.js** : The map marker data

Image files for the map markers are found uner `/markers`. The keys used for the map markers must match the sub-directory names.

## Project History

A little history of this project would help to understand it. This map was 
originally only going to show P-Switches and have routing. The idea was just to
help make it easier to route an All P-Switch speedrun and track completion for
casual players. A **LOT** of the logic was originally hard coded with a single
type of map marker in mind.

### Element IDs

This is probably the most hacky thing that was done before this project was made
public. The mission titles of the P-Switches were used as the element IDs for 
map markers. The IDs are also used all over for searching for matching elements.

This was fine up until the ? Panels and Peach Medallions were added and those 
now must have arbitrary numbers assigned to ensure the IDs are unique.

### Development Enviornment

This project has been designed entirely without the use of a backend server. It
can be directly locally run without needing an HTTP server. While I would like 
to keep it that way, I am not super against it depending on backend functionality
if there are features that require it. I have ideas for some that would so it
may happen in the future.


## Screenshots

This map uses screenshots from the game. These are distributted under the 
authorization provided by the [Nintendo Game Content Guidelines
for Online Video & Image Sharing Platforms](https://www.nintendo.co.jp/networkservice_guideline/en/index.html).

Only complete in game screenshots will be accepted to this repo to continue
to stay in alginment with those guidelines.
