# !/bin/bash

#=============================================================================#
#                                                                             #
# @file backupDB.sh                                                           #
# @author Clément Désiles <main@jokester.fr>                                  #
# @date 2013-07-28                                                            #
#                                                                             #
# Backup rfidea database                                                      #
#                                                                             #
#=============================================================================#

DIRNAME=`dirname $0`
BACKUP_DIR=${DIRNAME}/backup
mkdir -p $BACKUP_DIR

mongodump --db rfidea --out ${BACKUP_DIR}