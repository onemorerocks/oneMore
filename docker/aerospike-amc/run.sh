#!/bin/bash
service amc start && tail -f /var/log/amc/*.log
