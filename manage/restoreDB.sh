# !/bin/bash

#=============================================================================#
#                                                                             #
# @file restoreDB.sh                                                          #
# @author Clément Désiles <main@jokester.fr>                                  #
# @date 2013-07-28                                                            #
#                                                                             #
# Restore rfidea database                                                     #
#                                                                             #
#=============================================================================#

DIRNAME=`dirname $0`
BACKUP_DIR=${DIRNAME}/backup

mongorestore --db rfidea --drop ${BACKUP_DIR}/rfidea