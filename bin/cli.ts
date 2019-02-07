#!/usr/bin/env node
'use strict'

import sao  from 'sao'
import { cli } from './config'

sao(cli).run()
        .catch(err => {
          console.error(err)
          process.exit(1)
        })
