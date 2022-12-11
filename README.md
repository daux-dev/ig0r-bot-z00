# ig0r
[Discord](https://discord.com) BOT used to manage attendance for a local arcade gaming meetup.

Consists of the bot itself (ig0r) and a web interface for managing events (z00). SQLite is used for storage.

From the projects root directory:

`node ig0r/deploy_commands.js` adds necessary commands to discord server.

`node ig0r/ig0r_bot.js` launches the bot.

`node z00/z00_web.js` launches web interface.

Needs `BOT_TOKEN`, `CLIENT_ID` and `GUILD_ID` environment variables set.




### Main commands
* **/dojo** 

   Shows next event with info like date, attending users and taken/free sleeping accommodations.
* **/attend**

   Adds user to next event. With option to call dibs on a sleeping spot. Also used to change sleeping spot.
* **/unattend**

   Removes user from event.
* **/undibs**

   Frees up that users sleeping spot.
* **/events**

   Shows the next 4 events by date.
* **/links**

   Displays some useful links.
   
 ### Example
 Output of **/dojo**
 
![IG0r example](https://github.com/d-per/ig0r-bot/blob/70c2210be1d1a1c76da7e2e3d1488b9f9357ae36/ig0r_example.png "Output of /dojo")
