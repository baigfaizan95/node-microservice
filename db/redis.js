const redis = require('redis');
const { promisify } = require('util');
const { to } = require('../utils');
const logger = require('../logger');

class Redis {
  constructor(uri) {
    if (uri) {
      this.client = redis.createClient(uri);
      this.client.on('error', function(error) {
        throw error;
      });
    } else {
      logger.info('No redis URI');
    }
  }

  async getByKey(key) {
    const get = promisify(this.client.get).bind(this.client);
    const [err, result] = await to(get(key));
    if (err) {
      throw err;
    }
    return result;
  }

  async getByMultipleKey(keys) {
    const get = promisify(this.client.mget).bind(this.client);
    const [err, result] = await to(get(keys));
    if (err) {
      throw err;
    }
    return result;
  }

  async setByKey(key, value, ttl = null) {
    const set = promisify(this.client.set).bind(this.client);
    let err, result;
    if (ttl) {
      [err, result] = await to(set(key, value, 'ex', ttl));
      if (err) {
        throw err;
      }
      return result;
    }
    [err, result] = await to(set(key, value));
    if (err) {
      throw err;
    }
    return result;
  }

  async deleteByKey(key) {
    const del = promisify(this.client.del).bind(this.client);
    const [err, result] = await to(del(key));
    if (err) {
      throw err;
    }
    return result;
  }

  async incrementByKey(key) {
    const incr = promisify(this.client.incr).bind(this.client);
    const [err, result] = await to(incr(key));
    if (err) {
      throw err;
    }
    return result;
  }

  async decrementByKey(key) {
    const decr = promisify(this.client.decr).bind(this.client);
    const [err, result] = await to(decr(key));
    if (err) {
      throw err;
    }
    return result;
  }

  async decrementKeyByValue(key, value) {
    const decrby = promisify(this.client.decrby).bind(this.client);
    const [err, result] = await to(decrby(key, value));
    if (err) {
      throw err;
    }
    return result;
  }

  async incrementKeyByValue(key, value) {
    const incrby = promisify(this.client.incrby).bind(this.client);
    const [err, result] = await to(incrby(key, value));
    if (err) {
      throw err;
    }
    return result;
  }

  async getList(key) {
    const lrange = promisify(this.client.lrange).bind(this.client);
    const [err, result] = await to(lrange(key, 0, -1));
    if (err) {
      throw err;
    }
    return result;
  }

  async pushIntoList(key, value) {
    const lpush = promisify(this.client.lpush).bind(this.client);
    const [err, result] = await to(lpush(key, value));
    if (err) {
      throw err;
    }
    return result;
  }

  async removeFromList(key, value) {
    const lrem = promisify(this.client.lrem).bind(this.client);
    const [err, result] = await to(lrem(key, 1, value));
    if (err) {
      throw err;
    }
    return result;
  }
}

module.exports = new Redis(process.env.REDIS_URI);
