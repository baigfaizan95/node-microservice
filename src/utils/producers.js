'use strict';
import amqp from 'amqplib';
import to from '@utils/awaitTo';

import { ALLOWED_EXCHANGE_TYPES } from '@config/constants';

export default class Producer {
  constructor(config) {
    try {
      if (!config.uri) throw new Error('Connection String required');
      this.uri = config.uri;

      if (config.exchange) {
        if (!config.exchange.name) throw new Error('Exchange name required');
        if (!ALLOWED_EXCHANGE_TYPES.includes(config.exchange.type))
          throw new Error('Invalid exchange type');

        this.throughExchange = true;
        this.exchangeName = config.exchange.name;
        this.exchangeType = config.exchange.type;
        this.exchangeOptions = config.exchange.options || { durable: true };
      } else if (config.queue) {
        if (!config.queue.name) throw new Error('Queue name required');

        this.throughExchange = false;
        this.queueName = config.queue.name;
        this.queueOptions = config.queue.options || { durable: true };
      } else {
        throw new Error('Invalid Configuration');
      }

      this.payloadOption = config.payloadOption || { persistent: true };
    } catch (error) {
      throw error;
    }
  }

  init() {
    return new Promise(async (resolve, reject) => {
      if (this.channel) {
        return resolve();
      }
      let error;
      [error, this.connection] = await to(amqp.connect(this.uri));
      if (error) {
        return reject(error);
      }

      [error, this.channel] = await to(this.connection.createChannel());
      if (error) {
        conn.close();
        return reject(error);
      }

      if (this.throughExchange) {
        this.channel.assertExchange(
          this.exchangeName,
          this.exchangeType,
          this.exchangeOptions
        );
      } else {
        this.channel.assertQueue(this.queueName, this.queueOptions);
      }
      return resolve(true);
    });
  }

  send(payload, routingKey = '') {
    if (!this.channel) throw new Error('Producer not initialised');

    if (this.throughExchange) {
      this.channel.publish(
        this.exchangeName,
        routingKey,
        new Buffer(JSON.stringify(payload)),
        this.payloadOption
      );
    } else {
      this.channel.sendToQueue(
        this.queueName,
        new Buffer(JSON.stringify(payload)),
        this.payloadOption
      );
    }
  }
}
