import amqp from 'amqplib';
import {
  ALLOWED_EXCHANGE_TYPES,
  EXCHANGE_TYPES_FANOUT,
} from '@config/constants';
import to from '@utils/awaitTo';

export default class Consumer {
  constructor(config, callback) {
    if (!callback) throw new Error('Callback function required');
    this.callback = callback;

    if (!config.uri) throw new Error('Connection String required');
    this.uri = config.uri;

    if (config.exchange) {
      if (!config.exchange.name) throw new Error('Exchange name required');
      if (!ALLOWED_EXCHANGE_TYPES.includes(config.exchange.type)) {
        throw new Error('Invalid exchange type');
      }
      if (
        config.exchange.type !== EXCHANGE_TYPES_FANOUT &&
        !config.bindingKeys
      ) {
        throw new Error('Binding key required');
      }

      this.bindQueue = true;
      this.bindingKeys = config.bindingKeys || '';
      if (!(this.bindingKeys instanceof Array)) {
        this.bindingKeys = [this.bindingKeys];
      }

      this.exchangeName = config.exchange.name;
      this.exchangeType = config.exchange.type;
      this.exchangeOptions = config.exchange.options || { durable: true };
    } else {
      this.bindQueue = false;
    }

    if (!config.queue) throw new Error('Queue information not provided');
    if (!config.queue.name) throw new Error('Queue name required');

    this.queueName = config.queue.name;
    this.queueOptions = config.queue.options || { durable: true };

    this.prefetch = config.prefetch || 5;
    this.acknowledgementRequired = !!config.acknowledgementRequired;
    this.noOfworkers = config.noOfworkers || 1;
  }

  async init() {
    let error;
    let conn;
    let ch;
    [error, conn] = await to(amqp.connect(this.uri));
    if (error) {
      throw error;
    }

    this.noOfworkers.forEach(async (_) => {
      [error, ch] = await to(conn.createChannel());
      if (error) {
        conn.close();
        throw error;
      }
      ch.assertQueue(this.queueName, this.queueOptions);
      ch.prefetch(this.prefetch);

      if (this.bindQueue) {
        ch.assertExchange(
          this.exchangeName,
          this.exchangeType,
          this.exchangeOptions
        );
        this.bindingKeys.forEach((key) =>
          ch.bindQueue(this.queueName, this.exchangeName, key)
        );
      }

      ch.consume(
        this.queueName,
        (msg) => {
          const payload = JSON.parse(msg.content);
          if (!this.acknowledgementRequired) this.callback(payload);
          else {
            this.callback(payload, (err) => {
              if (err) ch.nack(msg);
              else ch.ack(msg);
            });
          }
        },
        { noAck: !this.acknowledgementRequired }
      );
    });
  }
}
