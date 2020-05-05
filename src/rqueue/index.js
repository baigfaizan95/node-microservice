/*
==================PRODCUER USAGE==================

Example 1: Simple(directly to a single queue)

let config = {
  uri: 'amqp://localhost',
  queue: {
    name: 'q1',
    options: {
      durable: true
    },
  },
  payloadOption: {
    persistent: true,
  }
}
let producer = new Producer(config);
await producer.init();
producer.send({msg: 'hello'});


Example 2: Using exchange(fanout/direct/topic) and routing key

let config = {
  uri: 'amqp://localhost',
  exchange: {
    name: 'e1',
    type: 'topic',
    options: {
      durable: true
    }
  },
  payloadOption: {
    persistent: true,
  }
}
let producer = new Producer(config);
await producer.init();
producer.send({msg: 'hello'}, 'quick.brown.fox');


==================COCNSUMER USAGE==================

Example 1: Simple(No binding)

let config = {
  uri: 'amqp://localhost',
  queue: {
    name: 'q2',
    options: {
      durable: false
    },
  },
  noOfworkers: 1,
  prefetch: 1,
  acknowledgementRequired: true
};

let consumer = new Consumer(config);
consumer.init((payload, done) => {
    <Perform your task>
    <if error>
      done(error);
    <else>
      done()
  });


Example 2: Bind to an exchange(fanout, direct, topic) using a bindingKey(not needed for fanout)

let config = {
  uri: 'amqp://localhost',
  exchange: {
    name: 'e1',
    type: 'topic',
    options: {
      durable: true
    }
  },
  queue: {
    name: 'q2',
    options: {
      durable: false
    },
  },
  bindingKeys: ['*.*.rabbit', 'lazy.#'],
  noOfworkers: 1,
  prefetch: 1,
  acknowledgementRequired: true
};

let consumer = new Consumer(config);
consumer.init((payload, done) => {
    <Perform your task>
    <if error>
      done(error);
    <else>
      done()
  });


NOTE:
  1. If acknowledgementRequired is set to false, no need to accept and call 'done' function
  2. bindingKeys  can either be a string or an array of string
*/
