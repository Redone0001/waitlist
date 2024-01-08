#!/bin/sh
envsubst < /config.toml | sponge /tdf_wl/config.toml
./waitlist
