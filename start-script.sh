#!/bin/sh

# initial hiding of cursor
unclutter -display :0 -noevents -grab &

# start doorbell app
cd /home/pi/Doorbell
npm start