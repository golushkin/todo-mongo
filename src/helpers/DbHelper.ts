class DbHelper {
  static client:{[key: string]: any} = null;

  static async connect() {
    if (DbHelper.client) {
      return DbHelper.client
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const client = {};
        DbHelper.client = client;
        resolve(client);
      }, 0);
    });
  }

  static async diconnect(){
    return Promise.resolve(true)
  }
}

export default DbHelper;
