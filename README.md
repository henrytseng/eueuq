# eueuq

[![Build Status](https://travis-ci.org/henrytseng/eueuq.svg?branch=master)](https://travis-ci.org/henrytseng/eueuq)

> A flexible messaging queue with priority

Work in progress.

## Features

* Distributed broker-producer-consumer
* Job priority
* Scheduled jobs
* RPC style command pattern
* Graceful broker and worker shutdown
* Rolling restarts
* Encryption
* Retry back-off
* Batch jobs
* Progress tracking
* Dashboard GUI



## Build

Install dependencies, this project uses yarn to manage dependencies

```
yarn install
```

Build files

```
yarn prepare
```



## Testing

Run tests with

```
yarn test
```
